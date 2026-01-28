package main

import (
	"net/http"
	"log"
)


func logMiddleWare(h http.Handler) http.Handler {
	logFn := func (w http.ResponseWriter, r *http.Request)	{
		method := r.Method	
		uri := r.RequestURI
		log.Printf("Method: %s, URI: %s", method, uri )
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(logFn)
}

func rootHandler() http.Handler {
	fileServer := http.FileServer(http.Dir("./"))
	logging := logMiddleWare(fileServer)
	return logging
}

func main() {
	http.Handle("/", rootHandler())
	http.ListenAndServe(":6767", nil)
}
