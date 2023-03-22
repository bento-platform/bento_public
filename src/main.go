package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	Client Name: %s
	Katsu URL: %v
	Maximum no. Query Parameters: %d
	Bento Portal Url: %s
	Port: %d
	Translated: %t
	Beacon URL: %s
`

type BentoConfig struct {
	ServiceId          string `envconfig:"BENTO_PUBLIC_SERVICE_ID"`
	PackageJsonPath    string `envconfig:"BENTO_PUBLIC_PACKAGE_JSON_PATH" default:"../package.json"`
	ClientName         string `envconfig:"BENTO_PUBLIC_CLIENT_NAME"`
	KatsuUrl           string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	MaxQueryParameters int    `envconfig:"BENTO_PUBLIC_MAX_QUERY_PARAMETERS"`
	BentoPortalUrl     string `envconfig:"BENTO_PUBLIC_PORTAL_URL"`
	Port               int    `envconfig:"INTERNAL_PORT" default:"8090"`
	Translated         bool   `envconfig:"BENTO_PUBLIC_TRANSLATED" default:"true"`
	BeaconUrl          string `envconfig:"BEACON_URL"`
}

type QueryParameter struct {
	IsExtraPropertyKey bool    `json:"is_extra_property_key"`
	RangeMin           float64 `json:"rangeMin"`
	RangeMax           float64 `json:"rangeMax"`
	DateAfter          string  `json:"dateAfter"`
	DateBefore         string  `json:"dateBefore"`
	Value              string  `json:"value"`
	Key                string  `json:"key"`
	Type               string  `json:"type"`
}

var katsuQueryConfigCache = make(map[string]interface{})

func main() {
	// Initialize configuration from environment variables
	var cfg BentoConfig
	err := envconfig.Process("", &cfg)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	// Load JS package.json to extract version number
	packageJson, err := ioutil.ReadFile(cfg.PackageJsonPath)
	if err != nil {
		fmt.Println("Error reading package.json")
		os.Exit(1)
	}

	var packageJsonContents map[string]interface{}
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
		cfg.ClientName,
		cfg.KatsuUrl,
		cfg.MaxQueryParameters,
		cfg.BentoPortalUrl,
		cfg.Port,
		cfg.Translated,
		cfg.BeaconUrl,
	)

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
	e.Use(middleware.Static("./www"))

	// -- GA4GH-compatible service information response
	e.GET("/service-info", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"id":      cfg.ServiceId,
			"name":    "Bento Public",
			"version": version,
			"type": map[string]interface{}{
				"group":    "ca.c3g.bento",
				"artifact": "public",
				"version":  version,
			},
			"organization": map[string]interface{}{
				"name": "C3G",
				"url":  "https://www.computationalgenomics.ca",
			},
			"contactUrl": "mailto:info@c3g.ca",
			"bento": map[string]interface{}{
				"serviceKind": "bento",
			},
		})
	})

	// -- Data
	e.GET("/config", func(c echo.Context) error {
		// make some server-side configurations available to the front end
		return c.JSON(http.StatusOK, map[string]interface{}{
			"clientName":         cfg.ClientName,
			"maxQueryParameters": cfg.MaxQueryParameters,
			"portalUrl":          cfg.BentoPortalUrl,
			"translated":         cfg.Translated,
			"beaconUrl":		  cfg.BeaconUrl,
		})
	})

	e.GET("/overview", func(c echo.Context) error {

		// Query Katsu for publicly available overview
		resp, err := http.Get(fmt.Sprintf("%s/api/public_overview", cfg.KatsuUrl))
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}
		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		// TODO: formalize response type
		return c.JSON(http.StatusOK, map[string]interface{}{
			"overview": jsonLike,
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
		resp, err := http.Get(fmt.Sprintf("%s/api/public?%s", cfg.KatsuUrl, qs.Encode()))
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}
		defer resp.Body.Close()
		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		katsuQueryConfigCache = jsonLike

		// TODO: formalize response type
		return c.JSON(http.StatusOK, jsonLike)
	})

	e.GET("/fields", func(c echo.Context) error {
		// Query Katsu for publicly available search fields
		resp, err := http.Get(fmt.Sprintf("%s/api/public_search_fields", cfg.KatsuUrl))
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}
		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		katsuQueryConfigCache = jsonLike

		// TODO: formalize response type
		return c.JSON(http.StatusOK, jsonLike)
	})

	e.GET("/provenance", func(c echo.Context) error {
		// Query Katsu for datasets provenance
		resp, err := http.Get(fmt.Sprintf("%s/api/public_dataset", cfg.KatsuUrl))
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}
		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Message: err.Error(),
			})
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		katsuQueryConfigCache = jsonLike

		// TODO: formalize response type
		return c.JSON(http.StatusOK, jsonLike)
	})

	// Run
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Port)))
}

// TODO: refactor
type ErrorResponse struct {
	Message string `json:"message"`
}
