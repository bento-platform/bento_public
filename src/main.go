package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type BentoConfig struct {
	KatsuUrl string `envconfig:"KATSU_URL"`
}

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
	e.GET("/data", func(c echo.Context) error {
		data := []map[string]interface{}{
			{
				"id":       0,
				"sampleId": "HG0100",
				"age":      45,
			},
			{
				"id":       1,
				"sampleId": "HG0101",
				"age":      60,
			},
			{
				"id":       2,
				"sampleId": "HG0102",
				"age":      20,
			},
		}

		return c.JSON(http.StatusOK, data)
	})

	// Katsu testing
	e.GET("/katsu", func(c echo.Context) error {
		// Fetch Overview
		// (TODO: refactor to use Katsu's "public" overview, rather than the "private" one)
		resp, err := http.Get(fmt.Sprintf("%s/api/overview", cfg.KatsuUrl))
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

		var jsonLike map[string]interface{}
		json.Unmarshal(body, &jsonLike)

		return c.JSON(http.StatusOK, jsonLike)
	})

	// Run
	e.Logger.Fatal(e.Start(":8090"))
}
