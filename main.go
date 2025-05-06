package main

import (
	"log"
	"net/http"
)

func main() {
	// Répertoire des fichiers statiques (modifiable)
	staticDir := "./"
	port := ":8080" // Port d'écoute (par défaut 8080)

	// Configuration du FileServer
	fs := http.FileServer(http.Dir(staticDir))

	// Gestionnaire pour servir les fichiers
	http.Handle("/", fs)

	// Démarrage du serveur
	log.Printf("Serveur en écoute sur http://localhost%s (servant les fichiers depuis %s)", port, staticDir)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal("Erreur du serveur : ", err)
	}
}