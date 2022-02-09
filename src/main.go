package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
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
	e.POST("/katsu", func(c echo.Context) error {
		// Retrieve query parameters JSON from POST body
		qpJson := make([]map[string]interface{}, 0)
		err := json.NewDecoder(c.Request().Body).Decode(&qpJson)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}
		fmt.Printf("Received %v from request body\n", qpJson)

		// Prepare query parameters JSON for Katsu as GET query parameters
		queryString := "?"
		extraPropertiesQStrPortion := "" //"extra_properties="age_group":"adult", "smoking":"non-smoker""
		for _, qp := range qpJson {
			fmt.Printf("%v\n", qp)
			// check if it is an extra property
			if qp["is_extra_property_key"] == true {
				if extraPropertiesQStrPortion == "" {
					// prepend query parameter key to the string on first iteration
					extraPropertiesQStrPortion = "extra_properties="
				} else {
					// append a tailing comma on each other interation
					extraPropertiesQStrPortion += ", "
				}

				extraPropertiesQStrPortion += fmt.Sprintf("\"%s\":\"%s\"", qp["key"], qp["value"])
			} else {
				queryString += fmt.Sprintf("%s=%s&", qp["key"], qp["value"])
			}
		}
		queryString += url.QueryEscape(extraPropertiesQStrPortion)

		fmt.Printf("Using %v extra_properties query string \n", extraPropertiesQStrPortion)
		fmt.Printf("Using %v query string\n", queryString)

		// Query Katsu
		resp, err := http.Get(fmt.Sprintf("%s/api/public%s", cfg.KatsuUrl, queryString)) // ?extra_properties=\"age_group\":\"adult\"&extra_properties=\"smoking\":\"non-smoker\"
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, err)
		}
		defer resp.Body.Close()

		// Read response body and convert to a generic JSON-like datastructure
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, err)
		}

		jsonLike := make(map[string]interface{})
		json.Unmarshal(body, &jsonLike)

		return c.JSON(http.StatusOK, jsonLike)
	})

	// Run
	e.Logger.Fatal(e.Start(":8090"))
}
