# Terzo prototipo · Schede metodologiche (bozza v0.1, 4 novembre 2026)

Stato: **da approvare dal relatore**. Livello 3: dati ufficiali, pochi. Livello 4: simulazione illustrativa, non calibrata né validata.

Legenda: **[F]** fonte documentata · **[A]** adattamento · **[P]** proposta originale · **[V]** da verificare

## O1 · Fruitori dei permessi (livello 3, osservato)
| Voce | Contenuto |
|---|---|
| Domanda | Quante persone usano i permessi dell'art. 33, comma 3? |
| Unità | Lavoratore dipendente del settore privato che ha fruito dei permessi per assistere un familiare, nell'anno. |
| Fonte | [F] INPS, Coordinamento generale statistico attuariale, *Osservatorio statistico. Prestazioni a sostegno della famiglia*, anni 2020-2024, dicembre 2025, Tavola 6.1 (tesi, cap. IV, nota 469): 445.167 nel 2020; 608.206 nel 2024. Variazione +36,6% calcolata da noi. |
| Dati collegati, non usati nei grafici | [V] Fonte secondaria (dottrinalavoro.it, sull'Osservatorio 2025): 2024 +10% sul 2023; 52% uomini; permessi personali 74.468. Da verificare sull'Osservatorio. |
| Limiti | Solo settore privato; conta chi fruisce, non chi ne avrebbe diritto; due anni. |
| Da fare | Tavola 6.1 originale; anni 2021-2023; distribuzione per territorio e genere se disponibile. |

## O2 · Modifiche della disciplina (livello 3, osservato)
| Fonte | [F] Note di aggiornamento dell'art. 33 (Normattiva, file testo/dati): Corte cost. 213/2016; d.l. 18/2020, art. 24, c. 1. [F] Tesi, cap. IV, § 1.2: d.lgs. 105/2022; d.lgs. 62/2024 e rinvio al 2027. |
|---|---|

## O3 · Osservabile mancante: il non accesso (proposta)
[P] Persone con i requisiti che non fruiscono dei permessi, per territorio e condizione. Modello metodologico: [F] C.A.M. La Porta, S. Zapperi, *Inequality and Health. A Quantitative Approach*, Peter Lang, 2026, § 4.1, pp. 38-40 (rinuncia alle visite mediche per quintile di reddito e motivo; Eurostat EU-SILC). Dati necessari: accertamenti di gravità (art. 3, c. 3; art. 4), familiari lavoratori, fruitori.

## S1 · Microsimulazione del percorso di accesso (livello 4, simulato)
| Voce | Contenuto |
|---|---|
| Domanda | Quali meccanismi possono generare uno scarto fra aventi diritto e fruitori, e quanto pesa ciascuno? |
| Statuto | [P] Esperimento illustrativo. Nessun numero descrive la realtà. |
| Fondamento | [F] Tesi, cap. III, terza regola della griglia, e nota 420 (Troitzsch, pp. 58 e 73-74): esiti dipendenti dalle ipotesi, analisi di sensibilità. [F] Passaggi: figura 5 del primo prototipo. |
| Modello | 1.000 agenti, 12 mesi, rete casuale (4 contatti). Mese per mese: passaparola; attesa dell'accertamento (esponenziale, media diversa in A e B); domanda; fruizione salvo ostacolo. Seme fisso 104. Codice: effetti/modello.js. |
| Ipotesi di base | informati 40%; passaparola 5%/mese per contatto informato; accertamento 4 mesi (A), 9 (B); domanda 80%; ostacolo 10%. |
| Scenari | informazione d'ufficio (90% informati); accertamento rapido in B (4 mesi); meno ostacoli (2%). Non sono proposte di riforma. |
| Esiti di base | fruisce il 47,8% (A 56%, B 39%). |
| Limiti | Territori ipotetici; nessuna eterogeneità di reddito, genere, lavoro; nessuna rinuncia volontaria; nessuna calibrazione. |
| Verifica | 8 test (effetti/test-modello.js): riproducibilità; conservazione degli agenti; monotonia nel tempo; casi limite; monotonia rispetto all'informazione; effetto dei tempi. |
