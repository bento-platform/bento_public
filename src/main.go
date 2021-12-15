package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	// TODO: migrate to using Echo
	myhttp := http.NewServeMux()
	fs := http.FileServer(http.Dir("./www/"))
	myhttp.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		// return dummy data
		// TODO : formalize data structure
		fmt.Fprintf(w, `[{"id": 2, "sampleId": "HG0102", "age": 20}]`)
	})
	myhttp.Handle("/", http.StripPrefix("", fs))

	// TODO: parameterize port
	port := "8090"
	log.Println("http://localhost:" + port)
	http.ListenAndServe(":"+port, myhttp)
}
