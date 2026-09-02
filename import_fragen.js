// Firebase Admin SDK importieren
const admin = require("firebase-admin");

// Deine Firebase-Service-Account-Datei laden
const serviceAccount = require("./dein-firebase-adminsdk-xxxxx.json");

// Firebase initialisieren
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Verbindung zu Firestore herstellen
const db = admin.firestore();


// JSON-Datei einlesen
const fragen = require("./fragen_bereinigt.json");


// Hauptfunktion für den Import
async function importFragen() {

    console.log(`Gefundene Fragen: ${fragen.length}`);

    // Firestore Batch erstellen
    let batch = db.batch();

    // Zähler für die Anzahl der Dokumente
    let batchZaehler = 0;

    // Alle Fragen durchlaufen
    for (const frage of fragen) {

        // Neues Dokument mit automatisch erzeugter ID erstellen
        const dokument = db.collection("fragen").doc();

        // Frage in das Dokument schreiben
        batch.set(dokument, frage);

        batchZaehler++;

        // Firestore erlaubt maximal 500 Schreibvorgänge pro Batch
        if (batchZaehler === 500) {

            // Batch speichern
            await batch.commit();

            console.log("500 Fragen importiert.");

            // Neuen Batch beginnen
            batch = db.batch();

            batchZaehler = 0;
        }
    }

    // Übrige Fragen speichern
    if (batchZaehler > 0) {
        await batch.commit();
    }

    console.log("Import abgeschlossen!");
}


// Import starten
importFragen().catch(fehler => {
    console.error("Fehler beim Import:", fehler);
});