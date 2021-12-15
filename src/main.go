package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/kelseyhightower/envconfig"
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

	// TODO: migrate to using Echo
	myhttp := http.NewServeMux()
	fs := http.FileServer(http.Dir("./www/"))

	myhttp.Handle("/", http.StripPrefix("", fs))
	myhttp.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		// return dummy data
		// TODO : formalize data structure
		fmt.Fprintf(w, `[
			{"id": 0, "sampleId": "HG0100", "age": 45},
			{"id": 1, "sampleId": "HG0101", "age": 60},
			{"id": 2, "sampleId": "HG0102", "age": 20}
		]`)
	})

	// TODO: parameterize port
	port := "8090"
	log.Println("http://localhost:" + port)
	http.ListenAndServe(":"+port, myhttp)
}
