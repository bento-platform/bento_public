package main

import (
	"encoding/json"
	"errors"
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
	Katsu URL: %v
	Gohan URL: %v
	Port: %d
`

type BentoConfig struct {
	// App configs
	ServiceId       string `envconfig:"BENTO_PUBLIC_SERVICE_ID"`
	PackageJsonPath string `envconfig:"BENTO_PUBLIC_PACKAGE_JSON_PATH" default:"./package.json"`
	StaticFilesPath string `envconfig:"BENTO_PUBLIC_STATIC_FILES_PATH" default:"./www"`
	ClientName      string `envconfig:"BENTO_PUBLIC_CLIENT_NAME"`
	KatsuUrl        string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	GohanUrl        string `envconfig:"BENTO_PUBLIC_GOHAN_URL"`
	BentoPortalUrl  string `envconfig:"BENTO_PUBLIC_PORTAL_URL"`
	Port            int    `envconfig:"INTERNAL_PORT" default:"8090"`
}

type JsonLike map[string]interface{}

func internalServerError(err error, c echo.Context) error {
	fmt.Println(err)
	return c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err.Error()})
}

// This function assumes JSON to be an object or an array of objects.
func jsonDeserialize(body []byte) (interface{}, error) {
	var i interface{}
	err := json.Unmarshal(body, &i)
	if err != nil {
		return nil, err
	}

	switch v := i.(type) {
	case []interface{}:
		// JSON array
		jsonArray := make([]JsonLike, len(v))
		for i, item := range v {
			m, ok := item.(map[string]interface{})
			if !ok {
				// Error occurs if array elements are not JSON objects
				return nil, errors.New("invalid JSON array element")
			}
			jsonArray[i] = JsonLike(m)
		}
		return jsonArray, nil
	case map[string]interface{}:
		// JSON object
		return JsonLike(v), nil
	default:
		return nil, errors.New("invalid JSON: not an object or an array")
	}
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
		cfg.KatsuUrl,
		cfg.GohanUrl,
		cfg.Port,
	)

	// Set up HTTP client
	client := &http.Client{}

	// Create request helper closure
	type responseFormatterFunc func([]byte) (interface{}, error)
	genericRequestJsonOnly := func(url string, qs url.Values, c echo.Context, rf responseFormatterFunc) (interface{}, error) {
		var req *http.Request
		var err error

		if qs != nil {
			req, err = http.NewRequest("GET", fmt.Sprintf("%s?%s", url, qs.Encode()), nil)
			if err != nil {
				return nil, internalServerError(err, c)
			}
		} else {
			req, err = http.NewRequest("GET", url, nil)
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

		// Read response body
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, internalServerError(err, c)
		}

		// Apply the response formatter function to convert the body to the desired format
		result, err := rf(body)
		if err != nil {
			return nil, internalServerError(err, c)
		}

		return result, nil
	}

	katsuRequest := func(path string, qs url.Values, c echo.Context, rf responseFormatterFunc) error {
		result, err := genericRequestJsonOnly(fmt.Sprintf("%s%s", cfg.KatsuUrl, path), qs, c, rf)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, result)
	}

	katsuRequestBasic := func(path string, c echo.Context) error {
		return katsuRequest(path, nil, c, jsonDeserialize)
	}

	katsuRequestFormattedData := func(path string, c echo.Context) ([]byte, error) {
		result, err := genericRequestJsonOnly(fmt.Sprintf("%s%s", cfg.KatsuUrl, path), nil, c, jsonDeserialize)
		if err != nil {
			return nil, err
		}
		// Convert the result data to formatted JSON
		jsonFormattedData, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return nil, fmt.Errorf("error formatting JSON: %w", err)
		}
		return jsonFormattedData, nil
	}

	dataTypesEndpointHandler := func(baseUrl string) echo.HandlerFunc {
		return func(c echo.Context) error {
			fullPath := fmt.Sprintf("%s/data-types", baseUrl)
			result, err := genericRequestJsonOnly(fullPath, nil, c, jsonDeserialize)
			if err != nil {
				return err
			}

			resultSlice, ok := result.([]JsonLike)
			if !ok {
				return fmt.Errorf("result is not of type []JsonLike")
			}

			var modifiedResult []JsonLike
			// Update the "count" value
			for _, item := range resultSlice {
				item["count"] = nil
				modifiedResult = append(modifiedResult, item)
			}

			return c.JSON(http.StatusOK, modifiedResult)
		}
	}

	fetchAndSetKatsuPublic := func(c echo.Context, katsuCache *cache.Cache) (JsonLike, error) {
		fmt.Println("'publicOverview' not found or expired in 'katsuCache' - fetching")
		publicOverviewInterface, err := genericRequestJsonOnly(
			fmt.Sprintf("%s%s", cfg.KatsuUrl, "/api/public_overview"),
			nil,
			c,
			jsonDeserialize,
		)
		if err != nil {
			fmt.Println("something went wrong fetching 'publicOverview' for 'katsuCache': ", err)
			return nil, err
		}

		publicOverview, ok := publicOverviewInterface.(JsonLike)
		if !ok {
			return nil, fmt.Errorf("failed to assert 'publicOverview' as JsonLike")
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
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root: cfg.StaticFilesPath,
		// Enable HTML5 mode by forwarding all not-found requests to root so that
		// SPA (single-page application) can handle the routing.
		// Required for react-router BrowserRouter fallback
		HTML5: true,
	}))

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

	// TODO: rm
	e.GET("/config", func(c echo.Context) error {
		// restore from cache if present/not expired
		publicOverview, err := getKatsuPublicOverview(c, katsuCache)
		if err != nil {
			return internalServerError(err, c)
		}

		return c.JSON(http.StatusOK, JsonLike{
			"maxQueryParameters": publicOverview["max_query_parameters"],
		})
	})

	// TODO: rm
	e.GET("/overview", func(c echo.Context) error {
		// restore from cache if present/not expired
		publicOverview, err := getKatsuPublicOverview(c, katsuCache)
		if err != nil {
			return internalServerError(err, c)
		}

		return c.JSON(http.StatusOK, JsonLike{"overview": publicOverview})
	})

	// TODO: rm
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
		return katsuRequest("/api/public", qs, c, jsonDeserialize)
	})

	// TODO: rm
	e.GET("/fields", func(c echo.Context) error {
		// Query Katsu for publicly available search fields
		// TODO: formalize response type
		return katsuRequestBasic("/api/public_search_fields", c)
	})

	// TODO: rm
	e.GET("/provenance", func(c echo.Context) error {
		// Query Katsu for datasets provenance
		return katsuRequestBasic("/api/public_dataset", c)
	})

	e.GET("/datasets/:id/dats", func(c echo.Context) error {
		id := c.Param("id")
		relativeUrl := fmt.Sprintf("/api/datasets/%s/dats", id)

		data, err := katsuRequestFormattedData(relativeUrl, c)
		if err != nil {
			return err
		}

		// Set the content type and disposition for download
		c.Response().Header().Set("Content-Disposition", `attachment; filename="DATS.json"`)
		c.Response().Header().Set("Content-Type", "application/json")

		return c.String(http.StatusOK, string(data))
	})

	e.GET("/gohan/data-types", dataTypesEndpointHandler(cfg.GohanUrl))

	e.GET("/katsu/data-types", dataTypesEndpointHandler(cfg.KatsuUrl))

	// Run
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Port)))
}

// TODO: refactor
type ErrorResponse struct {
	Message string `json:"message"`
}
