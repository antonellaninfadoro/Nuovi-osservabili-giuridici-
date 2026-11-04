# Primo prototipo · Schede metodologiche (bozza v0.3, 3 novembre 2026)

Stato: **da approvare dal relatore**. Nessun risultato è validato: le procedure sono controllate a mano su un piccolo campione (art. 33).

Collocazione: primo livello di indagine (testo / disposizione), operazione conoscitiva "descrizione e misurazione". Il prototipo fa parte del framework per la costruzione computazionale degli osservabili giuridici (tesi, cap. IV, § 2): tre prototipi per quattro livelli.

Legenda: **[F]** fonte documentata · **[A]** adattamento · **[P]** proposta originale · **[V]** da verificare

## Fonti

- **Regole 2001**: Presidenza del Consiglio dei ministri, Camera dei deputati, Senato della Repubblica, *Regole e raccomandazioni per la formulazione tecnica dei testi legislativi*, lettera circolare 20 aprile 2001, n. 1.1.26/10888/9.92. [V] Paragrafi letti su una copia non istituzionale (amministrazioneincammino.luiss.it): confrontare con il testo ufficiale.
- **Fameli et al. 2014**: E. Fameli, P. Mercatali, M. Ragona, D. Tiscornia, in G. Peruginelli, M. Ragona (a cura di), *L'informatica giuridica in Italia*, ESI, 2014, §§ 10-11.
- **Mercatali 2011**: P. Mercatali, "Legimatica: definizione, classificazione, àmbiti di applicazione", in S. Faro, N. Lettieri, A. Tartaglia Polcini (a cura di), *Diritto e tecnologie*, ESI, 2011, pp. 41-52 (pagine come citate nella tesi, cap. III, note 432 e 436).
- **Lucisano, Piemontese 1988**: "GULPEASE: una formula per la predizione della difficoltà dei testi in lingua italiana", *Scuola e città*, 1988, n. 3. [V] pagine: 110-124 (tesi, nota 439) o 57-68 (Brunato e Venturi 2014, nota 18).
- **Brunato, Venturi 2014**: "Le tecnologie linguistico-computazionali nella misura della leggibilità di testi giuridici", *Informatica e diritto*, 2014, n. 1, pp. 111-142.

Non è più citato: P. Mercatali, "Chi può leggere la Costituzione?", 1998 (decisione del 3 novembre 2026, sera).

## Dati

- Atto: Legge 5 febbraio 1992, n. 104, GU n. 39 del 17-02-1992, Suppl. Ord. n. 30.
- `testo/dati/l104-art33-vigente.txt`: art. 33 ("Agevolazioni"), testo vigente copiato da Normattiva il 3 novembre 2026. [V] data "vigente al" e URL da registrare.
- Articoli di confronto (testi inviati da Antonella il 4 novembre 2026; [V] data "vigente al" da registrare):
  - `l104-art3-vigente.txt`, art. 3: definisce la situazione di gravità, formula che ricorre 8 volte nell'art. 33 (F1). Comma 2 verificato a mano: 31 parole, 198 lettere, 1 periodo, Gulpease 34,81.
  - `l104-art4-vigente.txt`, art. 4: accertamento, richiamato dall'art. 33, comma 2 (D2). Verificato a mano: 1 periodo di 68 parole, Gulpease 38,12.
- Confronto: l'art. 3 ha periodi più brevi dell'art. 33 (27,3 contro 52,7 parole) ma un Gulpease più basso (38,8 contro 45,3), per via di parole più lunghe.

## Copertura degli osservabili della griglia (tesi, cap. III)

| Osservabile | Stato | Nel prototipo |
|---|---|---|
| Leggibilità | misurato | A3 |
| Complessità sintattica | in parte | A2 (lunghezza dei periodi); subordinate non misurate |
| Complessità lessicale | non misurato | servono Nuovo vocabolario di base o READ-IT |
| Chiarezza | in parte | indicatori indiretti (A3, T1, A4) |
| Ambiguità | in parte | solo "e/o" (R1) |
| Struttura e partizioni | misurato | A1 |
| Terminologia | misurato | T1, F1 |
| Rinvii interni | misurato | A4, D1 (D2 come ponte al secondo livello) |
| Regolarità formale | misurato | R1, A6 |
| Marcatura XML | non fatto | fuori dalla v1 |
| Confronto fra atti e versioni | in parte | confronto fra articoli; versioni storiche da acquisire |

---

## A1 · Struttura (descrittiva)
| Voce | Contenuto |
|---|---|
| Domanda | Come è articolata la disposizione? |
| Fonte | [F] Regole 2001, par. 7, lett. b); par. 10, lett. b). [F] Legimatica analitica: Mercatali 2011, pp. 46-47; Fameli et al. 2014, § 11.3.2. |
| Definizione | [A] Comma = riga con numero e punto ("3-bis." compreso); lettera = riga con "a)"; rubrica = riga dopo "Art. N", con o senza parentesi; comma modificato = racchiuso da Normattiva tra (( )). |
| Limiti | Dipende dall'impaginazione di Normattiva. |
| Verifica | Art. 33: rubrica "Agevolazioni", 11 commi, comma 1 abrogato, commi modificati 2, 3, 4, 6-bis, 7-ter. Test. |

## A2 · Periodi (descrittiva)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Regole 2001, par. 7, lett. e) (periodo = frase sintatticamente completa che termina con il punto). [F] Fameli et al. 2014, § 10.4, p. 208. |
| Adattamento | [A] Abbreviazioni e punto seguito da minuscola o cifra non chiudono il periodo; il punto e virgola non lo chiude. |
| Limiti | Lunghezza, non complessità sintattica. |
| Verifica | Comma 3: 4 periodi. Test. |

## A3 · Gulpease (descrittiva)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Lucisano, Piemontese 1988; formula e soglie come nella tesi, cap. III, note 439-441. [F] Brunato, Venturi 2014, pp. 116-117; p. 127, nota 55. |
| Adattamento | [A] Parola = sequenza di lettere o cifre; apostrofo separa. |
| Limiti | Solo lunghezza di parole e frasi. Uso relativo: Fameli et al. 2014, p. 210, nota 132. |
| Verifica | Comma 5: 37 parole, 165 lettere, 1 periodo → 52,51. Comma 7: 24, 104, 1 → 58,17. Test. |

## A4 · Rinvii espliciti (segnalazione)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Tesi, cap. III, § 2.1, a); Mercatali 2011, pp. 46-47; Fameli et al. 2014, § 11.3.3, p. 220. |
| Definizione | [A] Esterno; esterno anaforico ("medesima legge", "citato decreto"); interno ("presente legge, articolo, comma"); interno presunto. |
| Verifica | 20 rinvii nell'art. 33, riletti uno per uno. Test. |

## D1 · Rinvii fra i commi (descrittiva, figura 2)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Fameli et al. 2014, § 11.3.3, p. 220. [A] Diagramma ad archi. |
| Limiti | Il grado in entrata non misura l'importanza giuridica. |
| Verifica | 14 archi; comma 3 citato da 7 commi. Test. |

## D2 · Atti esterni (descrittiva, figura 3)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Fameli et al. 2014, § 11.3.3, p. 220. |
| Adattamento | [A] "Della medesima legge" = atto citato subito prima nello stesso comma. |
| Verifica | d.lgs. 151/2001 (commi 2, 4), l. 76/2016 (comma 3), l. 81/2017 (6-bis), d.lgs. 198/2006 (7-ter); art. 4 l. 104/1992 (comma 2). Test. |

## A6 · Rinvio a comma abrogato (segnalazione)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Mercatali 2011, pp. 47-48; Fameli et al. 2014, § 11.3.2, p. 218; tesi, cap. III, § 2.1, a). |
| Risultato | Comma 7 → "commi 1, 2, 3, 4 e 5"; comma 1 abrogato dal d.lgs. 151/2001. |

## T1 · Terminologia (segnalazione, figura 4)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Regole 2001, par. 4, lett. a). [F] Tesi, cap. IV, § 1.2 (d.lgs. 62/2024 e "condizione di disabilità"). |
| Definizione | [A] Dizionario manuale di forme; "stesso concetto" è giudizio interpretativo. |
| Risultato | "con disabilità in situazione di gravità" 6 volte (commi 2, 3, entrambi modificati); "in situazione di handicap grave" 1 (3-bis); "handicappata in situazione di gravità" 2 (6, 7). "Handicap" solo nei commi non racchiusi tra (( )). |
| Limiti | Le (( )) indicano una modifica senza data. |
| Verifica | Controllato a mano. Test. |

## R1 · Controlli di tecnica legislativa
| Regola (Regole 2001) | Controllo | Art. 33 |
|---|---|---|
| par. 7, lett. b) | commi numerati | rispettata |
| par. 10, lett. b) | commi aggiunti con bis, ter | rispettata |
| par. 5, lett. b) | rubrica (uniformità da verificare sulla legge) | rispettata |
| par. 11, lett. d) | niente "precedente", "successivo" | rispettata |
| par. 4, lett. f) | niente "e/o" | rispettata |
| par. 12, lett. i) | niente "e seguenti" | rispettata |
| par. 4, lett. a) | denominazioni identiche | scostamento (T1) |

Fonte del metodo: [F] legimatica valutativa, Fameli et al. 2014, § 11.3.2, p. 218. Limiti: confronto retrospettivo per i commi del 1992.

## F1 · Formule ricorrenti (descrittiva)
| Voce | Contenuto |
|---|---|
| Fonte | [F] Tesi, cap. III, § 2.1, a). |
| Definizione | [A] Trigrammi ripetuti almeno 3 volte, senza parole grammaticali agli estremi. |
| Risultato | "situazione di gravità" 8 volte (commi 2, 3, 6, 7). |

## R · Requisiti di accesso (ricostruzione manuale, figura 5)
[P] Proposta originale; giudizio interpretativo. Ponte verso il terzo livello (tesi, cap. IV, § 1.2: chi avrebbe diritto senza riuscire a ottenere i permessi). [V] da rivedere con il relatore.

## G · Grafici (figura 1)
Polarità Gulpease nella formula; polarità dei periodi come assunzione delle formule di leggibilità (Fameli et al. 2014, § 10.2, p. 208). Fasce Gulpease 40/60/80 [V]. Triangoli = altri articoli analizzati.

---

## Da verificare prima dell'approvazione
1. Data "vigente al" e URL Normattiva dell'art. 33; copia degli artt. 3 e 4 alla stessa data.
2. Regole 2001: confrontare i paragrafi citati con il testo ufficiale.
3. Pagine di Lucisano e Piemontese.
4. Figura 5 e raggruppamento T1: conferma del relatore.
