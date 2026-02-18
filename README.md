# Deadline-Visualisierung – Eine kritische Reflexion
#### Author1: Mykhailo Karasov 2197837
#### Video: https://youtu.be/XReJbvYaBxY
#### Description:

### Projektüberblick
Das "Deadline Dashboard" ist eine Webanwendung, die speziell für Studierende entwickelt wurde, um den Überblick über akademische Fristen, Klausuren und Projekte zu behalten. Im Gegensatz zu herkömmlichen Kalenderanwendungen oder To-Do-Listen visualisiert dieses Projekt die Zeit als kontinuierlichen Strahl (Timeline), auf dem Aufgaben als interaktive Kreise dargestellt werden. Die Größe und Farbe der Kreise repräsentieren dabei die Wichtigkeit und Art der Aufgabe. Ziel des Projekts ist es, durch intuitive Visualisierung das Zeitmanagement zu verbessern und Stress durch bessere Planung zu reduzieren.

Die Anwendung ermöglicht es Benutzern, ihre bestehenden Kalenderdaten (im .ics-Format) hochzuladen. Das System analysiert diese Daten automatisch, kategorisiert sie (z. B. in "Klausur", "Projekt" oder "Übung") und weist ihnen eine Priorität zu. Zusätzlich bietet die Anwendung eine Profilseite mit statistischen Auswertungen über die Arbeitsbelastung im Semester.

---

### Back-End Setup

**Voraussetzungen:**
* Node.js installiert
* PostgreSQL installiert und aktiv

**Schritt 1: Abhängigkeiten installieren**
Navigieren Sie in das `back-end` Verzeichnis und führen Sie den folgenden Befehl aus. Der Befehl `npm install` liest die `package.json`-Datei und installiert automatisch alle für das Projekt benötigten Abhängigkeiten (wie `express`, `sequelize`, `pg`, `bcrypt` usw.):

```bash
cd back-end
npm install
```

**Schritt 2: Umgebungsvariablen (.env) konfigurieren**
Erstellen Sie eine Datei namens `.env` im Verzeichnis `back-end` und fügen Sie die folgenden Variablen ein. Tragen Sie dort Ihre eigenen lokalen Datenbank- und Serverdaten ein:

```env
PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
JWT_SECRET_KEY=
```

*Hinweis: Stellen Sie sicher, dass in Ihrer lokalen PostgreSQL-Instanz eine Datenbank mit dem bei `DB_NAME` angegebenen Namen existiert. Die benötigten Tabellen werden beim ersten Start des Servers durch Sequelize automatisch erstellt.*

**Schritt 3: Server starten**
Starten Sie den Server. Für die Entwicklung wird das Skript `npm run dev` empfohlen, welches `nodemon` nutzt, um den Server bei Code-Änderungen automatisch neu zu starten:

```bash
npm run dev
```
*(Alternativ ohne nodemon: `node app.js`)*

### Front-End Setup

**Voraussetzungen:**
* Das Back-End sollte idealerweise bereits laufen (siehe oben), damit die API-Anfragen des Frontends verarbeitet werden können.

**Schritt 1: Abhängigkeiten installieren**
Öffnen Sie ein neues Terminal-Fenster, navigieren Sie in das `front-end` Verzeichnis und führen Sie den folgenden Befehl aus. Dieser installiert alle in der `package.json` definierten Frontend-Bibliotheken (wie `react`, `react-p5`, `axios` und `react-router-dom`):

```bash
cd front-end
npm install
```

**Schritt 2: Umgebungsvariablen (Optional)**
Standardmäßig ist das Frontend so konfiguriert, dass es Anfragen an `http://localhost:7000/api/` sendet. Falls Ihr Backend auf einem anderen Port läuft, können Sie eine `.env` Datei im `front-end` Verzeichnis anlegen und die URL entsprechend anpassen. Wenn Sie die Standard-Ports nutzen, können Sie diesen Schritt überspringen.

**Schritt 3: Frontend-Server starten**
Starten Sie die React-Entwicklungsumgebung mit dem folgenden Befehl:

```bash
npm start
```

Der Server wird gestartet und die Anwendung öffnet sich normalerweise automatisch in Ihrem Standard-Browser unter der Adresse `http://localhost:3000`.

### Architektur und Dateistruktur

Das Projekt folgt einer Client-Server-Architektur. Im Folgenden wird die Funktion der einzelnen, selbst geschriebenen Dateien detailliert beschrieben, unterteilt in Backend und Frontend.

#### 1. Back-End (Server & Logik)
Das Backend wurde mit **Node.js** und **Express** entwickelt und verwendet eine **PostgreSQL**-Datenbank (via Sequelize).

* **`back-end/app.js`**
  Dies ist der zentrale Einstiegspunkt der Serveranwendung. Die Datei übernimmt folgende Aufgaben:
  * **Initialisierung:** Startet die Express-App und lädt Umgebungsvariablen (`dotenv`).
  * **Datenbankverbindung:** Authentifiziert sich bei der PostgreSQL-Datenbank mittels `Sequelize` und synchronisiert die Modelle (`sequelize.sync()`), um sicherzustellen, dass die Tabellen und Beziehungen in der Datenbank existieren.
  * **Middleware-Konfiguration:**
    * `cors`: Erlaubt Anfragen vom Frontend (Cross-Origin Resource Sharing).
    * `express.json`: Ermöglicht das Parsen von eingehenden JSON-Daten.
    * `express-fileupload`: Aktiviert den Upload von Dateien (wichtig für den Import der .ics-Kalenderdateien).
    * `ErrorHandlingMiddleware`: Fängt Fehler global ab und sendet saubere, strukturierte Fehlermeldungen an den Client zurück.
  * **Routing:** Bindet den Haupt-Router unter dem Pfad `/api` ein.
  * **Server-Start:** Startet den Server und lauscht auf dem konfigurierten Port (Standard: 5000).

* **`back-end/db.js`**
  Initialisiert die Verbindung zur **PostgreSQL**-Datenbank mithilfe des **Sequelize ORM**.
  * Die sensiblen Verbindungsdaten (Datenbankname, Benutzer, Passwort, Host, Port) werden sicher aus den Umgebungsvariablen (`process.env`) geladen, anstatt fest im Code zu stehen.
  * Das SQL-Logging wird deaktiviert (`logging: false`), um die Konsole übersichtlich zu halten.

* **`back-end/classes/ApiError.js`**
  Definiert eine benutzerdefinierte Fehlerklasse, die von der Standard-JavaScript-`Error`-Klasse erbt.
  * Sie ermöglicht die Erstellung von Fehlerobjekten mit spezifischen **HTTP-Statuscodes** und Nachrichten.
  * Enthält statische Hilfsmethoden (`badRequest`, `internal`, `unauthorized`), um im Code schnell und lesbar Standardfehler (wie 404 oder 500) zu werfen.
  * Diese Klasse arbeitet eng mit der `ErrorHandlingMiddleware` zusammen, um dem Client strukturierte Fehlermeldungen zu senden.

* **`back-end/classes/JWT.js`**
  Eine Wrapper-Klasse für die `jsonwebtoken`-Bibliothek zur Handhabung der Authentifizierung.
  * **`generateJWT`**: Erstellt einen signierten Token, der die Benutzer-ID und E-Mail enthält. Der Token ist 24 Stunden gültig und wird mit einem geheimen Schlüssel (`JWT_SECRET_KEY`) signiert.
  * **`verifyJWT`**: Überprüft die Gültigkeit und Integrität eines übergebenen Tokens, um sicherzustellen, dass der Benutzer authentifiziert ist.

* **`back-end/controllers/DeadlineController.js`**
  Enthält die Steuerungslogik für alle Deadline-bezogenen Operationen.
  * **`upload`**: Empfängt eine hochgeladene `.ics`-Datei, parst sie und iteriert durch alle Events. Dabei wird für jedes Event mithilfe von `calculateMetadata` automatisch eine Priorität und ein Typ bestimmt. Neue Events werden in der Datenbank gespeichert, wobei Duplikate durch einen Hash (`uid_hash`) vermieden werden.
  * **`getByUserId`**: Ruft alle gespeicherten Deadlines eines Benutzers ab, sortiert nach Datum, um sie auf dem Dashboard anzuzeigen.
  * **`getStatisticByUserId`**: Lädt alle Deadlines eines Benutzers und übergibt sie an den `statisticCalculator`, um aggregierte Daten für die Profilseite zu generieren.
  * **`deleteByUserId`**: Löscht alle Deadlines eines Benutzers, um einen Reset des Dashboards zu ermöglichen.

* **`back-end/controllers/UserController.js`**
  Verwaltet die Benutzerauthentifizierung und -registrierung.
  * **`registration`**: Erstellt ein neues Benutzerkonto. Dabei wird das Passwort aus Sicherheitsgründen mit `bcrypt` gehasht, bevor es in der Datenbank gespeichert wird. Nach erfolgreicher Registrierung wird ein JWT (JSON Web Token) zurückgegeben.
  * **`login`**: Überprüft die Anmeldedaten. Vergleicht das eingegebene Passwort mit dem gespeicherten Hash und stellt bei Erfolg einen JWT aus.
  * **`check`**: Dient der Überprüfung und Erneuerung des Authentifizierungs-Tokens (wichtig für persistente Anmeldungen beim Neuladen der Seite).
  * **`getUserInfo`**: Ruft die Daten des aktuell eingeloggten Benutzers anhand der ID aus dem Token ab.

* **`back-end/middlewares/AuthorizationMiddleware.js`**
  Eine Middleware-Funktion zum Schutz privater API-Routen.
  * Sie prüft bei jeder eingehenden Anfrage, ob ein gültiges **JWT** (JSON Web Token) im `Authorization`-Header vorhanden ist.
  * Das Token wird verifiziert und entschlüsselt.
  * Bei Erfolg werden die Benutzerdaten (wie ID und E-Mail) an das `req`-Objekt angehängt (`req.user`), damit nachfolgende Controller wissen, welcher Nutzer die Anfrage stellt.
  * Ist das Token ungültig oder fehlt, wird der Zugriff sofort mit einem 401-Fehler (Unauthorized) blockiert.

* **`back-end/middlewares/ErrorHandlingMiddleware.js`**
  Eine zentrale Middleware zur globalen Fehlerbehandlung in der Express-App.
  * Sie fängt alle Fehler ab, die in den Routen oder anderen Middlewares auftreten (`next(error)`).
  * Unterscheidet zwischen erwarteten **`ApiError`**-Instanzen (z. B. "Benutzer nicht gefunden") und unerwarteten Systemfehlern.
  * Sendet eine strukturierte JSON-Antwort mit dem entsprechenden HTTP-Statuscode an den Client zurück, anstatt den Server abstürzen zu lassen oder einen HTML-Stacktrace anzuzeigen.

* **`back-end/models/models.js`**
  Definiert das Datenbankschema und die Tabellenstruktur mithilfe von **Sequelize**.
  * **`User`**: Modell für die Benutzerdaten (E-Mail, Passwort-Hash).
  * **`Deadline`**: Modell für die Aufgaben (Titel, Kursname, Datum, Typ, Gewichtung).
  * Legt die **Assoziationen** (Beziehungen) zwischen den Modellen fest: Ein Benutzer hat viele Deadlines (`User.hasMany(Deadline)`), und jede Deadline gehört zu genau einem Benutzer. Dies ermöglicht es, Daten benutzerspezifisch zu speichern und abzurufen.

* **`back-end/routes/deadlineRouter.js`**
  Definiert die API-Endpunkte für das Deadline-Management.
  * Verbindet spezifische URL-Pfade (wie `/upload` oder `/statistic`) mit den entsprechenden Funktionen im `DeadlineController`.
  * Bindet die **AuthorizationMiddleware** in jede Route ein, um sicherzustellen, dass nur authentifizierte Benutzer Dateien hochladen, löschen oder Statistiken abrufen können (geschützte Routen).

* **`back-end/routes/router.js`**
  Der Haupt-Router der API.
  * Er dient als **zentraler Verteiler** und bündelt die verschiedenen Unter-Router (`userRouter` und `deadlineRouter`).
  * Eingehende Anfragen werden basierend auf ihrem URL-Pfad (z. B. `/user/...` oder `/deadline/...`) an den entsprechenden Zuständigkeitsbereich weitergeleitet. Dies sorgt für eine modulare und übersichtliche Struktur der API-Endpunkte.

* **`back-end/routes/userRouter.js`**
  Definiert die API-Endpunkte für die Benutzerverwaltung.
  * **Öffentliche Routen:** `/registration` und `/login` sind für jeden zugänglich, um neue Konten zu erstellen oder sich anzumelden.
  * **Geschützte Routen:** `/check` und der Basis-Pfad `/` (für User-Info) verwenden die **AuthorizationMiddleware**. Nur angemeldete Nutzer mit gültigem Token können diese Endpunkte aufrufen, um ihren Login-Status zu prüfen oder Profilinformationen abzurufen.

* **`back-end/utils/generateUidHash.js`**
  Eine Hilfsfunktion zur Generierung eines eindeutigen Identifikators (Hash) für jedes Kalender-Event.
  * Kombiniert die ursprüngliche UID aus der .ics-Datei mit der internen Benutzer-ID und hasht diese mittels **MD5**.
  * Dieser Hash dient dazu, Duplikate in der Datenbank zu vermeiden: Wenn ein Nutzer dieselbe Datei erneut hochlädt, erkennt das System anhand des Hashes, dass das Event bereits existiert.

* **`back-end/utils/metadataCalculator.js`**
  Implementiert die Heuristik zur automatischen Klassifizierung von Terminen.
  * Analysiert den Titel eines Events auf Schlüsselwörter (z. B. "Klausur", "Abgabe", "Projekt").
  * Weist jedem Termin basierend auf dem Treffer einen **Typ** (z. B. `exam`) und ein numerisches **Gewicht** (`weight` zwischen 0.2 und 1.0) zu.
  * Diese Werte steuern direkt die visuelle Darstellung im Frontend: Ein höheres Gewicht führt zu größeren und farblich markanteren Kreisen auf der Timeline.

* **`back-end/utils/statisticCalculator.js`**
  Eine Utility-Funktion, die Rohdaten in aussagekräftige Statistiken für die Profilseite umwandelt.
  * Iteriert über alle Deadlines und berechnet Schlüsselmetriken wie den **stressigsten Tag** (Datum mit den meisten Events), den **intensivsten Kurs** und die durchschnittliche Anzahl an Aufgaben pro aktivem Tag.
  * Diese Auslagerung der Rechenlogik sorgt dafür, dass der `DeadlineController` schlank und übersichtlich bleibt.

#### 2. Front-End (Benutzeroberfläche)
Das Frontend basiert auf **React** und nutzt **p5.js** für die grafische Darstellung.

* **`front-end/public/index.html`**
  Die Basis-HTML-Datei der Single Page Application (SPA).
  * Sie enthält das zentrale `div`-Element mit der ID `root`.
  * Die gesamte React-Anwendung wird zur Laufzeit dynamisch in dieses Element "montiert" (injiziert), weshalb der `body` dieser Datei ansonsten leer bleibt.

* **`front-end/src/components/ConfirmModal.jsx`**
  Eine wiederverwendbare Komponente für Bestätigungsdialoge.
  * Wird verwendet, um vor kritischen Aktionen (wie dem unwiderruflichen Löschen aller Daten) eine explizite Zustimmung des Nutzers einzuholen.
  * Implementiert einen "Backdrop"-Klick-Handler, um das Modal benutzerfreundlich zu schließen, wenn man daneben klickt, und verhindert gleichzeitig durch `e.stopPropagation()`, dass Klicks innerhalb des Fensters das Modal schließen.

* **`front-end/src/components/DeadlineModal.jsx`**
  Eine Komponente zur detaillierten Anzeige von Terminen.
  * **Funktion:** Öffnet sich, wenn der Benutzer auf einen Kreis (Event-Gruppe) in der Timeline klickt.
  * **Darstellung:** Listet alle Deadlines, die auf diesen spezifischen Tag fallen, untereinander auf.
  * **Visuelles Feedback:** Verwendet eine Farbcodierung (`getColor`-Funktion), um die Dringlichkeit jeder Aufgabe visuell hervorzuheben (Rot für hohe Priorität/Klausuren, Gelb für mittlere, Blau für normale Aufgaben).
  * **Interaktion:** Schließt sich beim Klick auf den Hintergrund (`overlay`) oder den Schließen-Button.

* **`front-end/src/components/Header.jsx`**
  Die globale Navigationsleiste der Anwendung.
  * **Conditional Rendering:** Die Komponente prüft vor dem Rendern, ob ein Authentifizierungs-Token im `localStorage` vorhanden ist. Falls nicht (z. B. auf der Login-Seite), wird der Header komplett ausgeblendet (`return null`).
  * **Navigation:** Ermöglicht den schnellen Zugriff auf das Dashboard (Klick auf das Logo) und das Benutzerprofil.
  * **Session-Management:** Enthält die `logout`-Funktion, die das Token und die E-Mail aus dem lokalen Speicher entfernt und den Nutzer zur Anmeldeseite umleitet.
  * **User Interface:** Zeigt ein Dropdown-Menü an, das durch Klick auf den Benutzer-Avatar (initialer Buchstabe der E-Mail) geöffnet wird.

* **`front-end/src/http/index.js`**
  Konfiguriert den HTTP-Client (**Axios**) für die Kommunikation zwischen Frontend und Backend.
  * **Zwei Instanzen:** Erstellt `$host` für öffentliche Anfragen (z. B. Login/Registrierung) und `$authHost` für geschützte API-Endpunkte.
  * **Auth-Interceptor:** Implementiert einen Request-Interceptor für `$authHost`. Dieser liest vor jeder Anfrage automatisch das JWT-Token aus dem `localStorage` und fügt es als `Authorization: Bearer ...` Header hinzu. Dies stellt sicher, dass der Server den Benutzer authentifizieren kann, ohne dass das Token bei jedem Aufruf manuell übergeben werden muss.
  * **Umgebungsvariablen:** Nutzt `import.meta.env.VITE_API_URL`, um die API-Adresse flexibel zu konfigurieren (wichtig für den Wechsel zwischen Entwicklung und Produktion).

* **`front-end/src/pages/Auth.jsx`**
  Kombiniert die Anmelde- und Registrierungsformulare in einer einzigen, umschaltbaren Komponente.
  * **Toggle-Logik:** Über einen internen State (`isLogin`) wechselt die Ansicht dynamisch zwischen Login und Registrierung, ohne die Seite neu zu laden.
  * **Authentifizierung:** Sendet die Benutzerdaten an das Backend. Bei Erfolg wird das empfangene JWT-Token sowie die E-Mail im `localStorage` gespeichert, was für die Sitzungsverwaltung essenziell ist.
  * **Fehlerbehandlung:** Fängt API-Fehler (z. B. "falsches Passwort") ab und zeigt dem Benutzer direktes visuelles Feedback im Formular an.

* **`front-end/src/pages/Dashboard.jsx`**
  Die Hauptkomponente der Anwendung, die das interaktive Zeitstrahl-Dashboard realisiert.
  * **Datenverwaltung:** Nutzt `useEffect`, um beim Laden der Seite alle Deadlines des Nutzers vom Backend abzurufen. Verwaltet Zustände für Dateiuploads, Modals und die aktuell ausgewählten Event-Gruppen.
  * **p5.js Integration (`react-p5`):** * **Visualisierungs-Logik (`draw`):** Zeichnet einen dynamischen Zeitstrahl. Das Datum jedes Events wird mathematisch auf die X-Achse des Canvas projiziert (`p5.map`).
    * **Interaktive Kreise:** Aufgaben werden als Kreise dargestellt. Die **Größe** signalisiert die Wichtigkeit (`weight`) und die **Farbe** den Typ (Rot für Klausuren, Orange für Projekte, Türkis für Aufgaben). 
    * **Gruppierung:** Termine am selben Tag werden automatisch gruppiert. Ein kleiner weißer Punkt im Zentrum signalisiert, dass sich hinter einem Kreis mehrere Ereignisse verbergen.
    * **Heute-Marker:** Eine grüne gestrichelte Linie markiert das aktuelle Datum auf dem Zeitstrahl.
  * **Interaktion:**
    * **Hover-Effekt:** Beim Überfahren eines Kreises mit der Maus erscheint ein dynamischer Tooltip (p5-basiert) mit einer Kurzübersicht der Termine.
    * **Detailansicht:** Ein Klick auf einen Kreis öffnet das `DeadlineModal` für eine detaillierte Auflistung.
  * **UI-Features:**
    * **"Nächste Deadline"-Karte:** Berechnet automatisch den zeitlich am nächsten liegenden Termin und zeigt einen Countdown ("Noch X Tage") an.
    * **Datei-Management:** Enthält die Logik für den Upload von `.ics`-Kalendern und eine Reset-Funktion zum Löschen aller Daten (gesichert durch ein Bestätigungs-Modal).

* **`front-end/src/pages/Profile.jsx`**
  Repräsentiert die Profilseite, die dem Benutzer eine analytische Zusammenfassung seiner akademischen Arbeitslast bietet.
  * **Datenabruf:** Nutzt beim Laden der Seite den `$authHost`, um aggregierte Statistikdaten vom Backend-Endpunkt `/deadline/statistic` abzurufen.
  * **Zustandsmanagement:** Verarbeitet verschiedene UI-Zustände wie "Laden", "Fehler" (falls die API nicht erreichbar ist) und den "Empty State" (falls der Benutzer zwar registriert ist, aber noch keinen Kalender hochgeladen hat).
  * **Statistik-Dashboard:** Visualisiert die vom Backend berechneten Daten in einem Grid-Layout aus Info-Karten:
    * **Gesamtanzahl:** Zeigt die Summe aller importierten Termine.
    * **Intensivster Kurs:** Identifiziert das Modul mit den meisten Abgaben/Prüfungen.
    * **Stressigster Tag:** Hebt das Datum mit der höchsten Dichte an Deadlines hervor.
    * **Durchschnitt:** Berechnet die durchschnittliche Anzahl an Aufgaben pro aktivem Tag.
  * **Benutzerführung:** Bietet eine Logout-Funktion, die die lokale Sitzung löscht, sowie eine einfache Navigation zurück zum Dashboard.

* **`front-end/src/App.js`**
  Die zentrale Komponente, die das Routing und die Grundstruktur der Frontend-Anwendung festlegt.
  * **Routing-Management:** Nutzt `react-router-dom`, um die Navigation zwischen den verschiedenen Seiten (Login, Dashboard, Profil) zu steuern.
  * **Authentifizierungsschutz (Protected Routes):** Implementiert eine Sicherheitslogik, die den Zugriff auf das Dashboard und das Profil nur erlaubt, wenn ein gültiges Token im `localStorage` gefunden wird. Nicht authentifizierte Benutzer werden automatisch zur Login-Seite umgeleitet.
  * **Bedingte UI-Anzeige:** Über den `AppWrapper` wird gesteuert, dass die Kopfzeile (`Header`) auf der Login-Seite ausgeblendet bleibt, um eine ablenkungsfreie Anmeldung zu ermöglichen, während sie auf allen anderen Seiten als zentrales Navigationselement dient.
  * **Navigations-Kontext:** Initialisiert den `BrowserRouter`, der den Verlauf (History) der Anwendung verwaltet und die dynamische URL-Manipulation ermöglicht.

* **`front-end/src/index.js`**
  Der Haupteinstiegspunkt für die React-Anwendung auf der Client-Seite.
  * **Mounting:** Nutzt `ReactDOM.createRoot`, um die gesamte React-Komponentenhierarchie in das `div`-Element mit der ID `root` der `public/index.html` zu injizieren.
  * **React StrictMode:** Umschließt die Anwendung mit einem Wrapper-Tool, das während der Entwicklung potenzielle Probleme im Code aufdeckt (z. B. veraltete Lebenszyklus-Methoden oder Seiteneffekte).
  * **Globale Styles:** Importiert die `index.css`, in der projektweite Formatierungen (wie Schriftarten, CSS-Variablen für Farben und das CSS-Reset) definiert sind.
