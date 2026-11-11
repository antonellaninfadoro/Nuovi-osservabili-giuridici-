# Decisioni

**2026-11-03 · Lavoro di riferimento per il laboratorio A.** Mercatali, "Chi può leggere la Costituzione?", Informatica e diritto, 1998, n. 1. Motivo: il relatore (2 novembre) chiede che ogni prototipo applichi i criteri espliciti di un lavoro di riferimento; questo articolo applica a un testo normativo struttura, rinvii, lunghezza delle frasi e leggibilità.

**2026-11-03 · Gulpease al posto di Flesch-Vacca.** Mercatali 1998 usa Flesch-Vacca; il progetto indica Gulpease, costruito per l'italiano. Adattamento dichiarato nella scheda A3.

**2026-11-03 · Solo testo copiato dalla fonte.** Dall'ambiente di lavoro Normattiva non restituiva il testo in forma letterale. La pagina analizza solo testo copiato dalla fonte da una persona, con versione e data registrate.

**2026-11-03 · Nessuna fascia di giudizio sul Gulpease.** Si mostra il valore e il confronto tra commi (uso relativo: Mercatali 1998, nota 19). Le soglie per livello di istruzione restano fuori finché non sono verificate sull'originale.

**2026-11-03 · Separazione dei file.** `analisi.js` (algoritmi, testabile in Node), `vista.js` (pagina), nessuna libreria esterna.

**2026-11-03 · Testo di lavoro.** Art. 33, testo vigente copiato da Normattiva da Antonella, salvato in `testo/dati/l104-art33-vigente.txt`. Data di vigenza da registrare.

**2026-11-03 · Correzioni dopo la prova sul testo reale.** Rubrica senza parentesi, richiami di nota tolti, rinvii anaforici ("medesima legge") come categoria a sé, "presente articolo/comma" come rinvii interni. Ogni correzione è stata verificata a mano e fissata come test.

**2026-11-03 · Carattere Avenir.** Scelta di Antonella. Avenir è commerciale: si usa quello installato nel dispositivo (Mac, iPhone) e, altrove, Nunito Sans da Google Fonts come sostituto libero.

**2026-11-03 · Sfondo sempre chiaro.** Scelta di Antonella: la pagina resta chiara anche se il dispositivo usa il tema scuro.

**2026-11-03 · Grafici di sintesi (richiesta di Antonella).** Tre grafici in `testo/grafici.js`: gauge Gulpease con fasce, gauge dei periodi con i riferimenti di Mercatali, barra dei rinvii senza polarità. Ogni polarità è presa da una fonte o dichiarata come assunzione.

**2026-11-03 · Fasce Gulpease ora visibili.** Cambia la decisione precedente ("nessuna fascia"): le fasce 40/60/80 compaiono nel gauge, marcate "da verificare sull'originale". Da confermare con il relatore.

**2026-11-03 · Il laboratorio legge l'art. 33 dal punto di vista di chi chiede i permessi.** Su indicazione di Antonella (dire qualcosa in più rispetto agli indici già calcolati da altri) e sulla nota "Health Inequality" (tutela promessa / tutela effettiva). Nuovi osservabili: rinvii fra commi (D1), atti esterni (D2), rinvio a comma abrogato (A6), requisiti di accesso (R, ricostruzione manuale). Pagina riordinata: collocazione nello schema del relatore, reperti, figure, testo, metodo.

**2026-11-03 · Tavolozza ripresa dallo schema del relatore.** Grigio-azzurro per la disposizione, salvia per le relazioni con altri atti, sabbia per gli effetti. I colori dei segni sono stati resi più saturi per passare i controlli di leggibilità per daltonici.

**2026-11-03 (sera) · Niente più Mercatali 1998.** Su indicazione di Antonella. Sostituisce le decisioni precedenti sul lavoro di riferimento e sulle tacche di confronto con la Costituzione. Fonti ora: Regole e raccomandazioni 2001 (criteri espliciti, con paragrafo), Fameli et al. 2014, Mercatali 2011, Lucisano e Piemontese 1988, Brunato e Venturi 2014. Il termine di confronto diventa interno alla legge: artt. 3 e 4.

**2026-11-03 (sera) · Copertura della griglia.** Aggiunti terminologia (T1), controlli di tecnica legislativa (R1) e formule ricorrenti (F1). La pagina dichiara, osservabile per osservabile, che cosa è misurato e che cosa no.

**2026-11-03 (sera) · Apertura sul framework.** La pagina si apre con il framework del cap. IV: tre prototipi per quattro livelli, questo è il primo.

**2026-11-04 · Sito completo a quattro pagine.** Scelta di Antonella: pagina del framework con racconto a scorrimento, più una pagina per prototipo (testo/, relazioni/, effetti/), con navigazione comune. Base grafica condivisa in assets/base.css per le pagine nuove; il primo prototipo resta indipendente.

**2026-11-04 · Terzo prototipo: dati reali e simulazione.** Scelta di Antonella. Livello 3 con i dati INPS citati nella tesi; livello 4 con una microsimulazione illustrativa, separata e marcata come ipotetica.

**2026-11-04 · Secondo prototipo: attesa dei testi.** Scelta di Antonella. Definiti nodi, archi, perimetro e corpus (17 righe); nessuna rete disegnata finché i testi non sono copiati e i collegamenti verificati.

**2026-11-04 · Artt. 3 e 4 nel corpus.** Testi inviati da Antonella, salvati in testo/dati/ e verificati a mano su un comma ciascuno.

**2026-11-04 · Ritorno al perimetro della v1.** Su richiesta di Antonella, secondo il documento di progetto: sito a tre pagine (index, testo/, relazioni/); livelli 3 e 4 solo come racconto nello scrollytelling. La pagina effetti/ e la simulazione sono spostate in fasi-successive/simulazione/, fuori dal sito, come proposta per il relatore. Sostituisce le due decisioni del 4 novembre sul sito a quattro pagine e sul terzo prototipo.

**2026-11-04 · Ordine di lavoro.** Fase 0: repository GitHub e tre pagine online. Fase 1: schede di A e B approvate dal relatore. Poi completamento di B con i testi copiati da Normattiva. Infine traduzione inglese e rifinitura.

**2026-11-04 · Due correzioni al primo prototipo.** Emerse analizzando il testo 2000 dell'art. 33 (nota all'art. 19, l. 53/2000): anno dell'atto letto dalla data o da "del", non dal numero; aggiunta al dizionario T1 la forma "con handicap in situazione di gravità". Risultati sull'art. 33 vigente invariati; 54 test superati.

**2026-11-04 · Corpus del secondo prototipo completo al raggio 1.** Tutte le 20 righe della tabella hanno il testo, copiato da Antonella. Nove tipi di controllo automatico sui testi (coincidenza con le note di Normattiva, confronto fra versioni) documentati in relazioni/dati/LEGGIMI.md, osservazioni 1-16. Restano da copiare solo testi del raggio 2. La rete non è ancora disegnata: si attende l'approvazione delle schede di B (fase 1).

**2026-11-04 · Simulazione nel repository.** Su richiesta di Antonella, la cartella fasi-successive/simulazione/ entra nel repository pubblico come pagina di prova. Non è collegata dalle tre pagine del sito e porta l'avviso "fase successiva, fuori dalla versione 1".

**2026-11-04 · Fase 0: sito pubblicato.** Repository antonellaninfadoro/Nuovi-osservabili-giuridici-, GitHub Pages dal ramo main, cartella principale. Tre pagine: https://antonellaninfadoro.github.io/Nuovi-osservabili-giuridici-/ (framework), testo/, relazioni/. Collegamenti e assenza di errori verificati riproducendo la stessa struttura di indirizzi, su schermo desktop e mobile. Da qui in poi GitHub è la fonte ufficiale del codice.

**2026-11-04 · Leggibilità per lettori esterni, pagina del framework.** Indicazione del relatore. Ogni passo si apre con una sola affermazione in evidenza, cifre in grande e uno schema; il testo esteso resta tutto sotto "Approfondisci" (controllo automatico: 102 frasi su 102 presenti). Testo più scuro (grigio #44494a invece di #646a6b), enfasi in grassetto. Algoritmi, dati e risultati invariati. Le pagine testo/ e relazioni/ seguiranno, una alla volta.

**2026-11-04 · Immagine della testata.** Richiesta di Antonella: illustrazione dalla forma alla sostanza (linee intrecciate che convergono e si aprono in un ventaglio, colori dei quattro livelli). È decorativa e lo dichiara nel testo alternativo: non rappresenta dati. Una versione piccola fa da icona delle tre pagine.

**2026-11-04 · Leggibilità estesa ai due prototipi.** Stesso metodo della pagina del framework: affermazione in evidenza, conteggi in etichette, spiegazioni e tabelle sotto voci da aprire. Controllo automatico: testo/ 491 frasi su 491, relazioni/ 224 su 224. I 54 test del primo prototipo restano superati; algoritmi e dati invariati.

**2026-11-04 · Sezioni "Di che cosa parliamo" e "Fonti" nella pagina del framework.** Richiesta di Antonella. Il contenuto viene dalla tesi (versione in corso, pagine citate) e dalle fonti già usate nelle schede; i punti da verificare restano marcati. Gli osservabili nuovi dell'art. 33 sono dichiarati proposta originale [P].

**2026-11-04 · Obiettivo, dimostrazioni e terzo prototipo collegato.** Su richiesta di Antonella: in apertura della pagina del framework l'obiettivo della tesi e una tabella "che cosa dimostrano / che cosa non dimostrano" i tre prototipi. La simulazione (fasi-successive/simulazione/) è ora collegata da tutte le pagine come "terzo prototipo · prova, da approvare", con un riquadro "che cosa se ne ricava" (numeri del modello, seme 104, dichiarati ipotetici). Deroga al perimetro v1 (livelli 3-4 solo come racconto): da confermare con il relatore; si annulla togliendo i collegamenti. Aggiornate le frasi che dicevano "solo racconto".

**2026-11-05 · Apertura riordinata e titolo.** Su indicazione di Antonella: titolo "Costruire osservabili giuridici. Dalla bellezza alla giustizia", sopratitolo "Framework per la costruzione computazionale degli osservabili giuridici". L'apertura segue l'ordine legge 104 → art. 33 → obiettivo (costruzione di osservabili giuridici; distanza fra riconoscimento formale e possibilità concreta; transizione qualità formale → sostanziale → giustizia). Le descrizioni dei tre strumenti riprendono il documento di progetto del relatore, con la clausola di rigore sulla simulazione.

**2026-11-05 · Versione inglese, primo passo.** Pagina del framework tradotta in en/index.html (traduzione editoriale, con avviso), collegata con "English" / "Italiano". Le pagine dei prototipi restano in italiano e sono segnate "(IT)": il loro testo è in parte generato dal codice e va tradotto a parte. Titoli delle opere italiane lasciati in originale.

**2026-11-05 · Date dei testi della legge 104.** Artt. 3, 4 e 33: vigenti al 5 novembre 2026, consultati il 5 novembre 2026 (indicazione di Antonella). La data "in vigore dal" di ciascun articolo resta da leggere su Normattiva.

**2026-11-05 · Introduzione "La tesi in sintesi".** Su richiesta di Antonella, in testa alla pagina del framework (IT e EN): il sito accompagna la tesi; di che cosa parla e perché (dall'abstract, p. 10); il percorso dei capitoli I-III (quadro teorico) verso il cap. IV (la prova su un caso concreto). La sezione successiva diventa "Tre concetti chiave".

**2026-11-11 · Terzo prototipo come esperimento illustrativo svolto.** Scelta di Antonella, in linea con la tesi (cap. IV, § 2, c). La simulazione passa da fasi-successive/simulazione/ a effetti/ ed è collegata da tutte le pagine come terzo prototipo, senza l'avviso "prova, da approvare". I numeri sono ora medie di 100 esecuzioni (semi 1-100) con minimo e massimo, come nelle tabelle 5 e 6 della tesi; le figure 3 e 5 mostrano una sola esecuzione (seme 104). Aggiunti gli scenari "tre mesi in entrambi i territori" (termine di 90 giorni del d.l. 324/1993 usato come media) e "tutti gli interventi insieme". Analisi di sensibilità su 100 esecuzioni per punto. Test: 13 superati. Sostituisce le decisioni del 4 novembre sul perimetro della v1 per i livelli 3 e 4. Versione 0.2 del sito.
