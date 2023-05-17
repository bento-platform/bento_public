package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	cache "github.com/patrickmn/go-cache"
)

const ConfigLogTemplate = `Config --
	Service ID: %s
	package.json: %s
	Static Files: %s
	Client Name: %s
	Katsu URL: %v
	Bento Portal Url: %s
	Port: %d
	Translated: %t
`

type BentoConfig struct {
	ServiceId       string `envconfig:"BENTO_PUBLIC_SERVICE_ID"`
	PackageJsonPath string `envconfig:"BENTO_PUBLIC_PACKAGE_JSON_PATH" default:"./package.json"`
	StaticFilesPath string `envconfig:"BENTO_PUBLIC_STATIC_FILES_PATH" default:"./www"`
	ClientName      string `envconfig:"BENTO_PUBLIC_CLIENT_NAME"`
	KatsuUrl        string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	BentoPortalUrl  string `envconfig:"BENTO_PUBLIC_PORTAL_URL"`
	Port            int    `envconfig:"INTERNAL_PORT" default:"8090"`
	Translated      bool   `envconfig:"BENTO_PUBLIC_TRANSLATED" default:"true"`
}

type JsonLike map[string]interface{}

func internalServerError(err error, c echo.Context) error {
	fmt.Println(err)
	return c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err.Error()})
}

func identityJSONTransform(j JsonLike) JsonLike {
	return j
}

func main() {
	// Initialize configuration from environment variables
	var cfg BentoConfig
	err := envconfig.Process("", &cfg)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	// Load JS package.json to extract version number
	packageJson, err := os.ReadFile(cfg.PackageJsonPath)
	if err != nil {
		fmt.Println("Error reading package.json")
		os.Exit(1)
	}

	var packageJsonContents JsonLike
	err = json.Unmarshal(packageJson, &packageJsonContents)
	if err != nil {
		fmt.Println("Error parsing package.json")
		os.Exit(1)
	}

	var version = packageJsonContents["version"]

	fmt.Printf("Bento-Public version %s\n", version)
	fmt.Printf(
		ConfigLogTemplate,
		cfg.ServiceId,
		cfg.PackageJsonPath,
		cfg.StaticFilesPath,
		cfg.ClientName,
		cfg.KatsuUrl,
		cfg.BentoPortalUrl,
		cfg.Port,
		cfg.Translated,
	)

	// Set up HTTP client
	client := &http.Client{}

	// Create Katsu request helper closure
	type responseFormatter func(JsonLike) JsonLike
	katsuRequestJsonOnly := func(path string, qs url.Values, c echo.Context, rf responseFormatter) (JsonLike, error) {
		var req *http.Request
		var err error

		if qs != nil {
			req, err = http.NewRequest(
				"GET", fmt.Sprintf("%s%s?%s", cfg.KatsuUrl, path, qs.Encode()), nil)
			if err != nil {
				return nil, internalServerError(err, c)
			}
		} else {
			req, err = http.NewRequest("GET", fmt.Sprintf("%s%s", cfg.KatsuUrl, path), nil)
			if err != nil {
				return nil, internalServerError(err, c)
			}
		}

		// We are inside a container context, so set the 'internal' flag
		req.Header.Add("X-CHORD-Internal", "1")

		resp, err := client.Do(req)
		if err != nil {
			return nil, internalServerError(err, c)
		}

		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like data structure

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, internalServerError(err, c)
		}

		jsonLike := make(JsonLike)
		err = json.Unmarshal(body, &jsonLike)
		if err != nil {
			return nil, internalServerError(err, c)
		}

		return jsonLike, nil
	}

	katsuRequest := func(path string, qs url.Values, c echo.Context, rf responseFormatter) error {
		jsonLike, err := katsuRequestJsonOnly(path, qs, c, rf)

		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, rf(jsonLike))
	}

	katsuRequestBasic := func(path string, c echo.Context) error {
		return katsuRequest(path, nil, c, identityJSONTransform)
	}

	fetchAndSetKatsuPublic := func(c echo.Context, katsuCache *cache.Cache) (JsonLike, error) {
		fmt.Println("'publicOverview' not found or expired in 'katsuCache' - fetching")
		publicOverview, err := katsuRequestJsonOnly("/api/public_overview", nil, c, identityJSONTransform)
		if err != nil {
			fmt.Println("something went wrong fetching 'publicOverview' for 'katsuCache': ", err)
			return nil, err
		}

		fmt.Println("storing 'publicOverview' in 'katsuCache'")
		katsuCache.Set("publicOverview", publicOverview, cache.DefaultExpiration)

		return publicOverview, nil
	}

	getKatsuPublicOverview := func(c echo.Context, katsuCache *cache.Cache) (JsonLike, error) {
		// make some server-side configurations available to the front end
		// - fetch overview from katsu and obtain part of the configuration
		// - cache so a public-overview call to katsu isn't made every
		//   time a call is made to config
		var (
			publicOverview JsonLike
			err            error
		)

		if publicOverviewInterface, didFind := katsuCache.Get("publicOverview"); didFind {
			fmt.Println("'publicOverview' found in 'katsuCache' - restoring")
			publicOverview = publicOverviewInterface.(JsonLike)
		} else {
			// fetch from katsu and store in cache
			publicOverview, err = fetchAndSetKatsuPublic(c, katsuCache)
			if err != nil {
				return nil, err
			}
		}

		return publicOverview, nil
	}

	// Begin Echo

	// Instantiate Server
	e := echo.New()

	// Configure Server
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	// -- Override handlers with "custom Gohan" context
	//		to be able to provide variables and global singletons
	e.Use(func(h echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// cc := &contexts.PublicContext{c, es, &cfg, *iz}
			// return h(cc)
			return h(c)
		}
	})

	// Global Middleware
	e.Use(middleware.Logger())

	// Begin MVC Routes
	// -- Root : static files
	e.Use(middleware.Static(cfg.StaticFilesPath))

	// -- GA4GH-compatible service information response
	e.GET("/service-info", func(c echo.Context) error {
		return c.JSON(http.StatusOK, JsonLike{
			"id":      cfg.ServiceId,
			"name":    "Bento Public",
			"version": version,
			"type": JsonLike{
				"group":    "ca.c3g.bento",
				"artifact": "public",
				"version":  version,
			},
			"organization": JsonLike{
				"name": "C3G",
				"url":  "https://www.computationalgenomics.ca",
			},
			"contactUrl": "mailto:info@c3g.ca",
			"bento": JsonLike{
				"serviceKind": "public",
			},
		})
	})

	// -- Data
	// Create a cache with a default expiration time of 5 minutes, and which
	// purges expired items every 10 minutes
	var katsuCache = cache.New(5*time.Minute, 10*time.Minute)

	e.GET("/config", func(c echo.Context) error {
		// restore from cache if present/not expired
		publicOverview, err := getKatsuPublicOverview(c, katsuCache)
		if err != nil {
			return internalServerError(err, c)
		}

		return c.JSON(http.StatusOK, JsonLike{
			"clientName":         cfg.ClientName,
			"maxQueryParameters": publicOverview["max_query_parameters"],
			"portalUrl":          cfg.BentoPortalUrl,
			"translated":         cfg.Translated,
		})
	})

	e.GET("/overview", func(c echo.Context) error {
		// restore from cache if present/not expired
		publicOverview, err := getKatsuPublicOverview(c, katsuCache)
		if err != nil {
			return internalServerError(err, c)
		}

		return c.JSON(http.StatusOK, JsonLike{"overview": publicOverview})
	})

	// get request handler for /katsu that relays the request to the Katsu API and returns response
	e.GET("/katsu", func(c echo.Context) error {
		// get query parameters
		q := c.QueryParams()
		// convert query parameters to a string
		qs := url.Values{}
		for k, v := range q {
			qs.Set(k, v[0])
		}

		// make a get request to the Katsu API
		return katsuRequest("/api/public", qs, c, identityJSONTransform)
	})

	e.GET("/fields", func(c echo.Context) error {
		// Query Katsu for publicly available search fields
		// TODO: formalize response type
		return katsuRequestBasic("/api/public_search_fields", c)
	})

	e.GET("/provenance", func(c echo.Context) error {
		// Query Katsu for datasets provenance
		return katsuRequestBasic("/api/public_dataset", c)
	})

	// Run
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Port)))
}

// TODO: refactor
type ErrorResponse struct {
	Message string `json:"message"`
}
