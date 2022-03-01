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
	KatsuUrl           string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
	MaxQueryParameters int    `envconfig:"BENTO_PUBLIC_MAX_QUERY_PARAMETERS"`
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
		Katsu URL: %v
		Maximum no. Query Parameters: %d
	`, cfg.KatsuUrl, cfg.MaxQueryParameters))

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
			"maxQueryParameters": cfg.MaxQueryParameters,
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

	e.GET("/fields", func(c echo.Context) error {
		// Query Katsu for publicly available search fields
		resp, err := http.Get(fmt.Sprintf("%s/api/public_search_fields", cfg.KatsuUrl)) // ?extra_properties=\"age_group\":\"adult\"&extra_properties=\"smoking\":\"non-smoker\"
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

	// Katsu testing
	e.POST("/katsu", func(c echo.Context) error {
		// Retrieve query parameters JSON from POST body
		qpJson := make([]map[string]interface{}, 0)
		err := json.NewDecoder(c.Request().Body).Decode(&qpJson)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Message: err.Error(),
			})
		}
		fmt.Printf("Received %v from request body\n", qpJson)

		// Security check
		// - ensure all fields received are available
		// - reject request if any keys presenet are not available
		fmt.Println("Security check ---")
		fmt.Printf("katsuQueryConfigCache : %v\n", katsuQueryConfigCache)

		if len(qpJson) > cfg.MaxQueryParameters {
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Message: fmt.Sprintf("Too many query parameters - maximum is %d", cfg.MaxQueryParameters),
			})
		}

		for _, qp := range qpJson {
			key := qp["key"].(string)
			qpType := qp["type"].(string)

			fmt.Printf("Checking %v : %v\n", key, qpType)

			fmt.Printf("Validating %s\n", qp)

			var cachedConfigKey map[string]interface{}

			if katsuQueryConfigCache[key] == nil && katsuQueryConfigCache["extra_properties"].(map[string]interface{})[key] == nil {
				// exit
				fmt.Println("--- failed")

				return c.JSON(http.StatusBadRequest, ErrorResponse{
					Message: fmt.Sprintf("%s not available", key),
				})
			}
			if katsuQueryConfigCache[key] != nil {
				cachedConfigKey = katsuQueryConfigCache[key].(map[string]interface{})
			} else {
				cachedConfigKey = katsuQueryConfigCache["extra_properties"].(map[string]interface{})[key].(map[string]interface{})
			}

			fmt.Printf("cachedConfigKey %v\n", cachedConfigKey)
			var queryable bool
			if cachedConfigKey["queryable"] == nil {
				queryable = false
			} else {
				queryable = cachedConfigKey["queryable"].(bool)
			}
			fmt.Printf("queryable %v\n", queryable)

			if !queryable {
				// exit
				fmt.Println("--- failed")

				return c.JSON(http.StatusBadRequest, ErrorResponse{
					Message: fmt.Sprintf("%s not queryable", key),
				})
			}

			if qpType == "number" {
				// Verify range
				min := qp["rangeMin"].(float64)
				max := qp["rangeMax"].(float64)

				fmt.Printf("Checking %v : %v\n", min, max)

				threshold := cachedConfigKey["bin_size"].(float64)

				if max-min < threshold {
					fmt.Println("--- failed")

					return c.JSON(http.StatusBadRequest, ErrorResponse{
						Message: fmt.Sprintf("%f:%f range too narrow (minimum: %f)", min, max, threshold),
					})
				}
			}
		}
		fmt.Println("--- done")

		// Prepare query parameters JSON for Katsu as GET query parameters
		queryString := "?"
		extraPropertiesQStrPortion := ""
		for _, qp := range qpJson {
			fmt.Printf("%v\n", qp)
			// check if it is an extra property
			if qp["is_extra_property_key"] == true {
				if extraPropertiesQStrPortion == "" {
					// prepend json opening list bracket
					extraPropertiesQStrPortion = "["
				} else {
					// append a tailing comma on each other interation
					extraPropertiesQStrPortion += ","
				}

				if qp["type"] == "number" {
					extraPropertiesQStrPortion += fmt.Sprintf("{\"%s\":{\"rangeMin\":%f,\"rangeMax\":%f}}", qp["key"], qp["rangeMin"].(float64), qp["rangeMax"].(float64))
				} else {
					extraPropertiesQStrPortion += fmt.Sprintf("{\"%s\":\"%s\"}", qp["key"], qp["value"])
				}
			} else {
				if qp["type"] == "number" {
					queryString += fmt.Sprintf("%s=%s&", qp["key"], url.QueryEscape(fmt.Sprintf("{\"rangeMin\":%f,\"rangeMax\":%f}", qp["rangeMin"].(float64), qp["rangeMax"].(float64))))
				} else {
					queryString += fmt.Sprintf("%s=%s&", qp["key"], url.QueryEscape(qp["value"].(string)))
				}
			}
		}
		if extraPropertiesQStrPortion != "" {
			extraPropertiesQStrPortion += "]"

			queryString += ("extra_properties=" + url.QueryEscape(extraPropertiesQStrPortion))
		}

		fmt.Printf("Using %v extra_properties query string \n", extraPropertiesQStrPortion)
		fmt.Printf("Using %v query string\n", queryString)

		// Query Katsu
		resp, err := http.Get(fmt.Sprintf("%s/api/public%s", cfg.KatsuUrl, queryString))
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Message: err.Error(),
			})
		}
		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)

			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Message: err.Error(),
			})
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		// TODO: formalize response type
		return c.JSON(http.StatusOK, jsonLike)
	})

	// Run
	e.Logger.Fatal(e.Start(":8090"))
}

// TODO: refactor
type ErrorResponse struct {
	Message string `json:"message"`
}
