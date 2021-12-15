package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	myhttp := http.NewServeMux()
	fs := http.FileServer(http.Dir("./www/"))
	myhttp.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		//notice how this function takes two parameters
		//the first parameter is a ResponseWriter writer and
		//this is where we write the response we want to send back to the user
		//in this case Hello world
		//the second parameter is a pointer of type  http.Request this holds
		//all information of the request sent by the user
		//this may include query parameters,path parameters and many more
		fmt.Fprintf(w, `[{"book_id": 10, "title": "dummy", "author": "test", "year": 2000}]`)
	})
	myhttp.Handle("/", http.StripPrefix("", fs))

	port := "8090"
	log.Println("http://localhost:" + port)
	http.ListenAndServe(":"+port, myhttp)
}
