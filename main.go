package main

import (
	"encoding/json"
	"errors"
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
