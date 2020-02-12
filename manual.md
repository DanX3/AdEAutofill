# Manuale

Questa infrastruttura permette una navigazione accelerata del sito Agenzia delle Entrate per dichiarare le ricevute fiscali.
Il sistema e' composto da:
* Un plugin Firefox che manipola la pagina web
* Un lettore di file che rende disponibile al plugin i dati emessi dal gestionale in formato JSON.


# Setup Lettore file

Questo rappresenta la parte forse piu' complessa del setup

> Approfondimento: per ragioni di sicurezza, le estensioni browser non possono leggere il file system della macchina su cui vengono lanciati. Per questo e' necessario rendere disponibile attivamente il file con i dati in formato JSON. Questo componente fa esattamente questo, permettendo una minima interazione con i file della macchina ospite


1. Il programma deve essere lanciato usando NodeJS. Se non e' gia installato, scaricarlo alla pagina [nodejs.org](https://nodejs.org/en/download). E' bene preferire la **versione LTS** per un migliore supporto a lungo termine.

2. Installarlo annotandosi il percorso di installazione, ci servira' allo step successivo

3. Estrarre l'archivio *filereader.zip*

4. Scegliere di aprire il file *server.json* con NodeJS di default. Se non appare tra le scelte predefinite di **Apri con**, cercare il percorso segnato allo step 2. e selezionare l'eseguibile, un file simile a **NodeJs.exe**. Se l'operazione ha successo, l'icona di server.js dovrebbe assumere il logo di NodeJS: un esagono verde.

5. **IMPORTANTE**: ora bisogna dire a server.js la posizione del file da rendere disponibile online. Aprire *server.js* con un editor di testo come Notepad. Una volta aperto, la prima riga di server.js sara' simile a  `const filepath = "";`. Qua va inserito il percorso al JSON.

6. Supponiamo di avere il file chiamato *data.json* nella cartella *Documenti*. Aprire le proprieta' del file e trovare il percorso. Dovrebbe essere simile a *C:\\Users\\myname\\Documents*. Copiare questo percorso nei doppi apici della prima riga del server.json, aggiungendo anche il nome del file separato da backslash. Dopo questo passaggio, la prima riga dovrebbe essere simile a  

`const filepath = "C:\Users\myname\Documents\data.json";`

7. Per rendere il percorso valido, bisogna duplicare i backslash, in modo da ottenere la seguente riga. A questo punto possiamo verificare se il file e' collegato correttamente

`const filepath = "C:\\Users\\myname\\Documents\\data.json";`

8. Aprire server.json con doppio click se il programma predefinito di apertura e' NodeJS o scegliere NodeJS tra le varie opzioni. Il programma apre un terminale con scritto l'esito del collegamento. Se ha trovato un file valido, scrivera' un messaggio di successo, altrimenti uno di errore. In questo ultimo caso procediamo al troubleshooting.

9. Per verificare che NodeJS riesca a comunicare con l'interfaccia di rete locale, aprire un browser all'indirizzo [http://localhost:3000](http://localhost:3000) per verificare il corretto funzionamento del componente. All'indirizzo [http://localhost:3000/api/readjson](http://localhost:3000/api/readjson) si dovrebbe poter leggere il file collegato

### Avvio automatico di Server.js (Opzionale)

Questa componente deve essere lanciata ogni volta prima di utilizzare l'estensione di Firefox. Ogni volta che si avvia il PC si dovrebbe avviare il server.js, ma e' possibile automatizzarlo in questo modo

1. Premere il tasto Windows e cercare **Run**
2. Selezionarlo e scrivere **shell:startup**. Verra' aperta una cartella
3. In questa cartella aperta, mettere un collegamento al server.js. E' necessario che il programma di default per aprire il file sia NodeJS. Se non e' cosi', rieseguire il punto 4.
4. Al prossimo avvio, dopo qualche secondo dovrebbe partire automaticamente il server.js come terminale.


### Troubleshooting

* Accertarsi che il percorso sia perfettamente corretto: un solo punto in piu' potrebbe rendere il percorso invalido. Leggere il percorso nelle proprieta' del file e copiarlo senza trascriverlo per evitare errori di battitura


* Il percorso ha solo singoli backslash: ripetere il punto 7. Il percorso mostrato dal server.json nel terminale non dovrebbbe mostrare alcun backslash in questo caso

* Il file *data.json* potrebbe nascondere una estensione diversa. Windows potrebbe omettere l'estensione se non diversamente specificato. Controllare quindi nelle proprieta' del file, nei Dettagli, che il nome del file sia cio' che vi aspettate (data.json nel caso d'esempio) e non qualcosa come *data.json.txt*


# Setup Plugin Firefox
Dopo aver garantito il corretto funzionamento del filereader, bisogna installare l'estensione firefox.

1. E' necessaria l'installazione da file del plugin quindi bisogna andare in Firefox > Adds-On > Click sull'ingranaggio di 'Gestisci le tue Estensioni' > Installa da file e selezionare il file fornito in formato *.xpi*

2. Andare su [google.com](www.google.com). 
> Il plugin non ha un corretto funzionamento se si trova in pagine particolari come la nuova scheda. Su qualsiasi altro sito come google questo problema non si pone.

3. Cliccare sull'icona del plugin in alto a destra e completare le credenziali dell'Agenzia delle Entrate. Fate attenzione a scrivere correttamente questi dati altrimenti non avverra' un login corretto. I dati vengono salvati nella memoria del browser in modo sicuro. Ogni volta successiva non sara' necessario inserire queste credenziali.

4. Se tutto e' funzionato correttamente, e' a questo punto possibile navigare in modo accelerato sul sito dell'AdE

Le azioni possibili da poter eseguire sono:

**Accedi**: apre la home dell'AdE se non e' gia' aperta ed effetua il login

**Form:Vai** naviga fino al form di generazione del documento commerciale senza riempirlo

**Form:Vai e Compila**: naviga fino al form compilandolo in base al file JSON