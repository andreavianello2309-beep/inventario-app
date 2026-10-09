# Magazzino & Giacenze - App Android Offline (.APK)

Applicazione Android creata per gestire l'inventario e le scorte del magazzino **100% in locale senza connessione internet**.

---

## Dati Precaricati nel Progetto
L'app include già tutti i dati del tuo file Excel suddivisi per ubicazione e riepilogo:
* **SALE** (Armadio D1)
* **FARINA TIPO 00 - 25KG** (Armadio D2)
* **MOZZARELLA FIORDILATTE 1KG** (Armadio D3, Armadio D4)
* **PELATI SAN MARZANO DOP 400G** (Casetta 1)
* **ACQUA NATURALE 1L - 12PZ** (Animazione)
* **CHIANTI CLASSICO DOCG** (Magazzino D3, Magazzino D4)
* **PATATE** (Armadio D2, Animazione)
* **FORCHETTE** (Magazzino D3)

---

## Funzionalità dell'App su Smartphone
1. **100% Offline**: Funziona sempre senza connessione WiFi o dati mobili.
2. **Scheda "Giacenze"**:
   - Filtro rapido con pulsanti per Ubicazione (*Armadio D1, Armadio D2, Casetta 1, Animazione, ecc.*).
   - Ricerca istantanea testuale.
   - Grandi pulsanti touch `+` e `-` per incrementare/decrementare **Cartoni (CT)** e **Pezzi (PZ)** in tempo reale.
   - Calcolo automatico immediato del **Totale Pezzi**.
3. **Scheda "Totali Articoli"**:
   - Tabella riassuntiva che calcola la somma totale di ciascun prodotto distribuito nei vari armadi.
4. **Scheda "Dati & Excel"**:
   - **Esporta in CSV**: scarica un file apribile con Excel con le giacenze aggiornate.
   - **Carica File CSV**: permette di caricare un nuovo foglio dati aggiornato dal PC in qualsiasi momento senza dover reinstallare l'app.
   - **Ripristina Iniziali**: reset rapido ai valori del foglio originale.

---

## Come ottenere il file APK con Compilazione Cloud Automatica (GitHub)

La cartella è già configurata con **GitHub Actions** (`.github/workflows/build-apk.yml`).

### Procedura in 4 semplici passaggi:

1. **Accedi a GitHub**:
   - Vai su [github.com](https://github.com) e accedi (o registrati gratuitamente).
2. **Crea un nuovo Repository**:
   - Clicca sul pulsante verde **"New"** (Nuovo repository).
   - Nome repository: es. `inventario-magazzino`.
   - Impostalo su **Public** o **Private** e clicca su **Create repository**.
3. **Carica i file di questa cartella**:
   - Puoi caricare tutti i file della cartella `inventario-app` trascinandoli nella pagina di GitHub (cliccando su *"uploading an existing file"*), oppure tramite comando `git`:
     ```bash
     cd inventario-app
     git init
     git add .
     git commit -m "Prima versione app magazzino"
     git branch -M main
     git remote add origin https://github.com/TUO-USERNAME/inventario-magazzino.git
     git push -u origin main
     ```
4. **Scarica l'APK compilato**:
   - Appena caricati i file, vai nella scheda **Actions** del tuo repository su GitHub.
   - Vedrai il processo **Compilazione Automatica APK** in esecuzione (impiega circa 1-2 minuti).
   - A fine compilazione:
     - Nella sezione **Artifacts** troverai `Inventario-Magazzino-APK` da scaricare con 1 click.
     - Nella sezione **Releases** a destra della schermata troverai il file `.apk` direttamente scaricabile dal browser del tuo smartphone!
