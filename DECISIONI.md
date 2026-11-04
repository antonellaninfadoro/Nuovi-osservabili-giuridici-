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
