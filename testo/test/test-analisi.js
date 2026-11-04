/*
 * Test del codice del laboratorio A.
 * Le stringhe qui sotto sono STRINGHE DI PROVA costruite per controllare il
 * funzionamento degli algoritmi. Non sono testi normativi e non producono
 * risultati empirici. Esecuzione: node testo/test/test-analisi.js
 */
var A = require('../analisi.js');
var ok = 0, ko = 0;
function verifica(nome, ottenuto, atteso) {
  var esito = JSON.stringify(ottenuto) === JSON.stringify(atteso);
  if (esito) ok++; else ko++;
  console.log((esito ? 'OK  ' : 'ERR ') + nome + (esito ? '' : '\n     atteso: ' + JSON.stringify(atteso) + '\n     ottenuto: ' + JSON.stringify(ottenuto)));
}

// Frasi: il punto fermo chiude la frase
verifica('due frasi semplici', A.frasi('Il cane dorme. Il gatto mangia.').length, 2);
// Abbreviazioni: "art." e "n." non chiudono la frase
verifica('abbreviazioni art. e n.', A.frasi('Si applica l\'art. 3 della legge n. 10. Il resto vale.').length, 2);
// Punto seguito da minuscola: non e' fine frase
verifica('punto seguito da minuscola', A.frasi('Vedi lett. a) del comma. Fine.').length, 2);
// Testo senza punto finale: conta comunque come una frase
verifica('frase senza punto finale', A.frasi('Testo senza punto').length, 1);

// Parole e lettere: l'apostrofo separa
verifica('conteggio parole/lettere', A.conta("dell'articolo 33"), { parole: 3, lettere: 4 + 8 + 2 });

// Gulpease calcolato a mano: "Il cane dorme." -> P=3, L=2+4+5=11, F=1
// G = 89 + (300*1 - 10*11)/3 = 89 + 190/3 = 152.333...
verifica('Gulpease a mano', Math.round(A.gulpease(3, 11, 1) * 1000) / 1000, 152.333);

// Rinvii
function tipi(t) { return A.rinvii(t).map(function (r) { return r.tipo + ':' + r.testo; }); }
verifica('rinvio esterno con data e numero',
  tipi("di cui all'articolo 3, comma 1, della legge 8 marzo 2000, n. 53, si applica"),
  ['esterno:articolo 3, comma 1, della legge 8 marzo 2000, n. 53']);
verifica('rinvio interno presunto', tipi('ai sensi del comma 3 si provvede'), ['interno-presunto:comma 3']);
verifica('rinvio alla presente legge', tipi("previsti dall'articolo 4 della presente legge"), ['interno:articolo 4 della presente legge']);
verifica('rinvio a codice', tipi("ai sensi dell'articolo 2043 del codice civile"), ['esterno:articolo 2043 del codice civile']);
verifica('elenco di commi', tipi('dei commi 1 e 2'), ['interno-presunto:commi 1 e 2']);
verifica('nessun rinvio in "numero di giorni"', tipi('il numero di giorni e la lettera inviata'), []);

// Riferimenti relativi
verifica('comma precedente', A.relativi('di cui al comma precedente').map(function (x) { return x.testo; }), ['comma precedente']);
verifica('successivo articolo', A.relativi('il successivo articolo dispone').map(function (x) { return x.testo; }), ['successivo articolo']);

// Struttura in formato Normattiva (stringa di prova)
var prova = 'Art. 1\n\n(Prova).\n\n1. Testo uno.\n2. Testo due:\na) primo elemento;\nb) secondo elemento.\n3. ((COMMA ABROGATO DALLA L. 1/2000)).\n\nAGGIORNAMENTO (1)\nNota da escludere.';
var r = A.analizza(prova);
verifica('numero articolo', r.articolo, '1');
verifica('rubrica', r.rubrica, 'Prova');
verifica('numeri dei commi', r.commi.map(function (c) { return c.numero; }), ['1', '2', '3']);
verifica('lettere nel comma 2', r.commi[1].lettere, ['a)', 'b)']);
verifica('comma abrogato riconosciuto', r.commi[2].abrogato, true);
verifica('segmenti modificati (( ))', r.modificati, 1);
verifica('frasi esclusi abrogati', r.totali.frasi, 2);
verifica('nota AGGIORNAMENTO esclusa', r.commi[2].testo.indexOf('Nota') === -1, true);

// comma con suffisso latino
verifica('comma 3-bis', A.struttura('Art. 2\n(X).\n3-bis. Testo.').commi[0].numero, '3-bis');

// ---- Testo reale: art. 33 L. 104/1992, dati/l104-art33-vigente.txt ----
// Valori attesi controllati A MANO il 3 novembre 2026 (vedi SCHEDE-A.md, "Verifiche").
var fs = require('fs'), path = require('path');
var art33 = A.analizza(fs.readFileSync(path.join(__dirname, '..', 'dati', 'l104-art33-vigente.txt'), 'utf8'));
function cm(n) { return art33.commi.filter(function (c) { return c.numero === n; })[0]; }
verifica('art. 33: rubrica senza parentesi', art33.rubrica, 'Agevolazioni');
verifica('art. 33: commi', art33.commi.map(function (c) { return c.numero; }), ['1', '2', '3', '3-bis', '4', '5', '6', '6-bis', '7', '7-bis', '7-ter']);
verifica('art. 33: comma 1 abrogato', cm('1').abrogato, true);
verifica('art. 33: comma 5 a mano (P, L, F)', [cm('5').parole, cm('5').caratteri, cm('5').frasi.length], [37, 165, 1]);
verifica('art. 33: comma 5 Gulpease 52,51', cm('5').gulpease.toFixed(2), '52.51');
verifica('art. 33: comma 7 senza richiamo (11)', [cm('7').parole, cm('7').caratteri], [24, 104]);
verifica('art. 33: comma 7 Gulpease 58,17', cm('7').gulpease.toFixed(2), '58.17');
verifica('art. 33: comma 3 ha 4 periodi', cm('3').frasi.length, 4);
verifica('art. 33: 20 rinvii riconosciuti', art33.totali.rinvii, 20);
verifica('art. 33: "medesima legge" anaforico', cm('3').rinvii.filter(function (r) { return r.tipo === 'esterno-anaforico'; }).length, 2);
verifica('art. 33: "citato decreto" unito', cm('4').rinvii[2].testo, 'articoli 43, 44 e 56 del citato decreto legislativo n. 151 del 2001');

// Relazioni (schede D1, D2, A6), controllate a mano sul testo
var R = art33.relazioni;
verifica('art. 33: 14 rinvii fra commi', R.interne.map(function (e) { return e.da + '>' + e.a; }),
  ['3-bis>3', '4>2', '4>3', '5>3', '6>2', '6>3', '6-bis>2', '6-bis>3', '7>1', '7>2', '7>3', '7>4', '7>5', '7-bis>3']);
verifica('art. 33: comma 3 citato da 7 commi', R.ingresso['3'], 7);
verifica('art. 33: rinvio a comma abrogato (7 -> 1)', R.rinviiAbrogati.map(function (e) { return e.da + '>' + e.a; }), ['7>1']);
verifica('art. 33: atti esterni', R.atti.map(function (a) { return a.etichetta + ' [' + a.commi.join(',') + ']'; }),
  ['d.lgs. 151/2001 [2,4]', 'l. 76/2016 [3]', 'l. 81/2017 [6-bis]', 'd.lgs. 198/2006 [7-ter]']);
verifica('art. 33: rinvio ad altro articolo della legge', R.altriArticoli.map(function (x) { return x.da + ': ' + x.testo; }), ['2: articolo 4, comma 1']);

// Terminologia (T1), regolarita' (R1), formule (F1): controllate a mano sul testo
var T = art33.terminologia;
verifica('art. 33: 3 designazioni della condizione', T.forme.map(function (f) { return f.forma + ' ' + f.n + ' [' + f.commi.join(',') + ']'; }),
  ['con disabilità in situazione di gravità 6 [2,3]', 'in situazione di handicap grave 1 [3-bis]', 'handicappata in situazione di gravità 2 [6,7]']);
verifica('art. 33: commi marcati (( )) da Normattiva', art33.commi.filter(function (c) { return c.modificato; }).map(function (c) { return c.numero; }),
  ['2', '3', '4', '6-bis', '7-ter']);
verifica('art. 33: esiti R1', art33.regolarita.map(function (e) { return e.regola + ':' + e.esito; }),
  ['7b:rispettata', '10b:rispettata', '5b:rispettata', '11d:rispettata', '4f:rispettata', '12i:rispettata', '4a:scostamento']);
verifica('art. 33: formula piu\' ricorrente', art33.formule[0].formula + ' ' + art33.formule[0].n, 'situazione di gravità 8');
verifica('sequenza commi irregolare', A.regolarita(A.analizza('Art. 1\n(X).\n1. Uno.\n3. Tre.\n')).filter(function (e) { return e.regola === '10b'; })[0].esito, 'scostamento');
verifica('"e/o" segnalato', A.regolarita(A.analizza('Art. 1\n(X).\n1. Il padre e/o la madre.\n')).filter(function (e) { return e.regola === '4f'; })[0].esito, 'scostamento');

// Art. 3 (testo inviato da Antonella il 4/11/2026), comma 2 contato a mano
var art3 = A.analizza(fs.readFileSync(path.join(__dirname, '..', 'dati', 'l104-art3-vigente.txt'), 'utf8'));
verifica('art. 3: rubrica e commi', [art3.rubrica, art3.commi.map(function (c) { return c.numero; }).join(',')], ['Soggetti aventi diritto', '1,2,3,4']);
verifica('art. 3: comma 2 a mano (P, L, F)', [art3.commi[1].parole, art3.commi[1].caratteri, art3.commi[1].frasi.length], [31, 198, 1]);
verifica('art. 3: comma 2 Gulpease 34,81', art3.commi[1].gulpease.toFixed(2), '34.81');
verifica('art. 3: designazione "persona handicappata"', art3.terminologia.forme.map(function (f) { return f.forma + ' ' + f.n; }), ['persona handicappata 2']);

// Art. 4 (testo inviato da Antonella il 4/11/2026), contato a mano
var art4 = A.analizza(fs.readFileSync(path.join(__dirname, '..', 'dati', 'l104-art4-vigente.txt'), 'utf8'));
verifica('art. 4: un comma, un periodo di 68 parole', [art4.commi.length, art4.totali.frasi, art4.totali.parole], [1, 1, 68]);
verifica('art. 4: Gulpease 38,12', art4.totali.gulpease.toFixed(2), '38.12');
verifica('art. 4: rinvii (art. 3; l. 295/1990)', [art4.relazioni.altriArticoli[0].testo, art4.relazioni.atti[0].etichetta], ['articolo 3', 'l. 295/1990']);

// Correzione del 4/11/2026: l'anno non va preso dal numero dell'atto
verifica('anno dalla data, numero a 4 cifre', A.estremiAtto('art. 7 della legge 30 dicembre 1971, n. 1204').etichetta, 'l. 1204/1971');
verifica('anno da "del"', A.estremiAtto('art. 7 della legge n. 1204 del 1971').etichetta, 'l. 1204/1971');

console.log('\n' + ok + ' superati, ' + ko + ' falliti');
process.exit(ko ? 1 : 0);
