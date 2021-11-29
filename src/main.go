package main

import (
	"log"
	"net/http"
)

func main() {
	myhttp := http.NewServeMux()
	fs := http.FileServer(http.Dir("./www/"))
	myhttp.Handle("/", http.StripPrefix("", fs))

	port := "8090"
	log.Println("http://localhost:" + port)
	http.ListenAndServe(":"+port, myhttp)
}
