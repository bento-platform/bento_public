package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

const ConfigLogTemplate = `Config --
	Service ID: %s
	package.json: %s
	Static Files: %s
	Client Name: %s
	Katsu URL: %v
	Maximum no. Query Parameters: %d
	Bento Portal Url: %s
	Port: %d
	Translated: %t
	Beacon URL: %s
	Beacon enabled: %t
`

type BentoConfig struct {
	ServiceId          string `envconfig:"BENTO_PUBLIC_SERVICE_ID"`
	PackageJsonPath    string `envconfig:"BENTO_PUBLIC_PACKAGE_JSON_PATH" default:"./package.json"`
	StaticFilesPath    string `envconfig:"BENTO_PUBLIC_STATIC_FILES_PATH" default:"./www"`
	ClientName         string `envconfig:"BENTO_PUBLIC_CLIENT_NAME"`
	KatsuUrl           string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	MaxQueryParameters int    `envconfig:"BENTO_PUBLIC_MAX_QUERY_PARAMETERS"`
	BentoPortalUrl     string `envconfig:"BENTO_PUBLIC_PORTAL_URL"`
	Port               int    `envconfig:"INTERNAL_PORT" default:"8090"`
	Translated         bool   `envconfig:"BENTO_PUBLIC_TRANSLATED" default:"true"`
	BeaconUrl          string `envconfig:"BEACON_URL"`
	BeaconEnabled	   bool   `envconfig:"BENTO_BEACON_ENABLED"`
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
		cfg.MaxQueryParameters,
		cfg.BentoPortalUrl,
		cfg.Port,
		cfg.Translated,
		cfg.BeaconUrl,
		cfg.BeaconEnabled,
	)

	// Set up HTTP client
	client := &http.Client{}

	// Create Katsu request helper closure
	type responseFormatter func(JsonLike) JsonLike
	katsuRequest := func(path string, qs url.Values, c echo.Context, rf responseFormatter) error {
		var req *http.Request
		var err error

		if qs != nil {
			req, err = http.NewRequest(
				"GET", fmt.Sprintf("%s%s?%s", cfg.KatsuUrl, path, qs.Encode()), nil)
			if err != nil {
				return internalServerError(err, c)
			}
		} else {
			req, err = http.NewRequest("GET", fmt.Sprintf("%s%s", cfg.KatsuUrl, path), nil)
			if err != nil {
				return internalServerError(err, c)
			}
		}

		// We are inside a container context, so set the 'internal' flag
		req.Header.Add("X-CHORD-Internal", "1")

		resp, err := client.Do(req)
		if err != nil {
			return internalServerError(err, c)
		}

		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like data structure

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return internalServerError(err, c)
		}

		jsonLike := make(JsonLike)
		err = json.Unmarshal(body, &jsonLike)
		if err != nil {
			return internalServerError(err, c)
		}

		return c.JSON(http.StatusOK, rf(jsonLike))
	}
	katsuRequestBasic := func(path string, c echo.Context) error {
		return katsuRequest(path, nil, c, identityJSONTransform)
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
	e.GET("/config", func(c echo.Context) error {
		// make some server-side configurations available to the front end
		return c.JSON(http.StatusOK, JsonLike{
			"clientName":         cfg.ClientName,
			"maxQueryParameters": cfg.MaxQueryParameters,
			"portalUrl":          cfg.BentoPortalUrl,
			"translated":         cfg.Translated,
			"beaconUrl":		  cfg.BeaconUrl,
			"beaconEnabled":	  cfg.BeaconEnabled,
		})
	})

	e.GET("/overview", func(c echo.Context) error {
		// TODO: formalize response type
		return katsuRequest("/api/public_overview", nil, c, func(j JsonLike) JsonLike {
			// Wrap the response from Katsu in {overview: ...} (for some reason)
			return JsonLike{"overview": j}
		})
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
