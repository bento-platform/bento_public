package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type BentoConfig struct {
	KatsuUrl string `envconfig:"BENTO_PUBLIC_KATSU_URL"`
}

var queryableFields = []string{"sex"}
var queryableFieldValues = map[string][]string{
	"sex": []string{"male", "female"},
}

var katsuQueryConfig = make(map[string]interface{})

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

	// Load katsu query configuration
	// TODO: refactor to fetch this config from a Katsu REST endpoint
	content, err := ioutil.ReadFile("./katsu.config.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}

	// Now let's unmarshall the data into `payload`
	err = json.Unmarshal(content, &katsuQueryConfig)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}

	//fmt.Println(katsuQueryConfig)

	// Begin Echo

	// Instantiate Server
	e := echo.New()

	// Service Connections:
	// -- TODO: Katsu Service?

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
	// TODO: Remove dummy data
	e.GET("/fields", func(c echo.Context) error {
		return c.JSON(http.StatusOK, katsuQueryConfig)
	})

	// Katsu testing
	e.GET("/katsu", func(c echo.Context) error {
		jsonLike := make(map[string]map[string]interface{})

		for _, qf := range queryableFields {
			jsonLike[qf] = make(map[string]interface{})

			for _, qv := range queryableFieldValues[qf] {
				resp, err := http.Get(fmt.Sprintf("%s/api/public?%s=%s", cfg.KatsuUrl, qf, qv)) // ?extra_properties=\"age_group\":\"adult\"&extra_properties=\"smoking\":\"non-smoker\"
				if err != nil {
					fmt.Println(err)
					return c.JSON(http.StatusInternalServerError, err)
				}
				defer resp.Body.Close()

				// Read response body and conver to a generic JSON-like datastructure
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					fmt.Println(err)
					return c.JSON(http.StatusInternalServerError, err)
				}

				tmpJsonLike := make(map[string]interface{})
				json.Unmarshal(body, &tmpJsonLike)

				jsonLike[qf][qv] = tmpJsonLike
			}
		}
		// Fetch Overview

		return c.JSON(http.StatusOK, jsonLike)
	})

	// Run
	e.Logger.Fatal(e.Start(":8090"))
}
