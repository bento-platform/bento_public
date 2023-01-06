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

type BentoConfig struct {
	ClientName         string `envconfig:"BENTO_PUBLIC_CLIENT_NAME"`
	KatsuUrl           string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	MaxQueryParameters int    `envconfig:"BENTO_PUBLIC_MAX_QUERY_PARAMETERS"`
	BentoPortalUrl     string `envconfig:"BENTO_PUBLIC_PORTAL_URL"`
	Port               int    `envconfig:"INTERNAL_PORT" default:"8090"`
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
	var cfg BentoConfig
	err := envconfig.Process("", &cfg)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	fmt.Println(fmt.Sprintf(`Config --
		Client Name: %s
		Katsu URL: %v
		Maximum no. Query Parameters: %d
		Bento Portal Url: %s
		Port: %d
	`, cfg.ClientName, cfg.KatsuUrl, cfg.MaxQueryParameters, cfg.BentoPortalUrl, cfg.Port))

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

	// -- Data
	e.GET("/config", func(c echo.Context) error {
		// make some server-side configurations available to the front end
		return c.JSON(http.StatusOK, map[string]interface{}{
			"clientName":         cfg.ClientName,
			"maxQueryParameters": cfg.MaxQueryParameters,
			"portalUrl":          cfg.BentoPortalUrl,
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
