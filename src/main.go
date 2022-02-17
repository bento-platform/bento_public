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
	KatsuUrl string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
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
	`, cfg.KatsuUrl))

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

	e.GET("/overview", func(c echo.Context) error {
		// TEMP: simulation
		return c.JSON(http.StatusOK, map[string]interface{}{
			"overview": map[string]interface{}{
				"sex": map[string]interface{}{
					"male": map[string]interface{}{
						"count": 10,
					},
					"female": map[string]interface{}{
						"count": 12,
					},
				},
				"diseases": map[string]interface{}{
					"myocarditis": map[string]interface{}{
						"count": 2,
					},
					"blood clots": map[string]interface{}{
						"count": 4,
					},
					"cancer": map[string]interface{}{
						"count": 6,
					},
				},
				"experiments": map[string]interface{}{
					"RT-PCR": map[string]interface{}{
						"count": 7,
					},
					"RT-qPCR": map[string]interface{}{
						"count": 3,
					},
				},
				"age": map[string]interface{}{
					"50": map[string]interface{}{
						"count": 6,
					},
					"60": map[string]interface{}{
						"count": 4,
					},
					"70": map[string]interface{}{
						"count": 1,
					},
				},
				"mobility": map[string]interface{}{
					"functioning": map[string]interface{}{
						"count": 12,
					},
					"non-mobile": map[string]interface{}{
						"count": 8,
					},
					"sometimes mobile": map[string]interface{}{
						"count": 2,
					},
				},
			},
		})

		// TODO: implement

		// // Query Katsu for publicly available overview
		// resp, err := http.Get(fmt.Sprintf("%s/api/public_overview", cfg.KatsuUrl))
		// if err != nil {
		// 	fmt.Println(err)

		// 	return c.JSON(http.StatusInternalServerError, ErrorResponse{
		// 		Message: err.Error(),
		// 	})
		// }
		// defer resp.Body.Close()

		// // Read response body and convert to a generic JSON-like datastructure
		// body, err := ioutil.ReadAll(resp.Body)
		// if err != nil {
		// 	fmt.Println(err)

		// 	return c.JSON(http.StatusInternalServerError, ErrorResponse{
		// 		Message: err.Error(),
		// 	})
		// }

		// jsonLike := make(map[string]interface{})
		// json.Unmarshal(body, &jsonLike)

		// katsuQueryConfigCache = jsonLike

		// // TODO: formalize response type
		// return c.JSON(http.StatusOK, jsonLike)
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

		for _, qp := range qpJson {
			key := qp["key"].(string)

			fmt.Printf("Validating %s\n", qp)
			if katsuQueryConfigCache[key] == nil && katsuQueryConfigCache["extra_properties"].(map[string]interface{})[key] == nil {
				fmt.Println("--- failed")

				return c.JSON(http.StatusBadRequest, ErrorResponse{
					Message: fmt.Sprintf("%s not available", key),
				})
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

				if qp["type"] == "range" {
					extraPropertiesQStrPortion += fmt.Sprintf("{\"%s\":{\"range_min\":\"%s\",\"range_max\":\"%s\"}}", qp["key"], qp["rangeMin"], qp["rangeMax"])
				} else {
					extraPropertiesQStrPortion += fmt.Sprintf("{\"%s\":\"%s\"}", qp["key"], qp["value"])
				}
			} else {
				if qp["type"] == "range" {
					queryString += fmt.Sprintf("%s=%s&", qp["key"], url.QueryEscape(fmt.Sprintf("{\"range_min\":\"%s\",\"range_max\":\"%s\"}", qp["rangeMin"], qp["rangeMax"])))
				} else {
					queryString += fmt.Sprintf("%s=%s&", qp["key"], qp["value"])
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
