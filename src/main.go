package main

import (
	"fmt"
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
	// TODO: Katsu integration
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

	// Run
	e.Logger.Fatal(e.Start(":8090"))
}
