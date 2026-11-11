/* Test della microsimulazione (livello 4). Esecuzione: node effetti/test-modello.js */
var M = require('./modello.js');
var ok = 0, ko = 0;
function verifica(nome, cond) { if (cond) ok++; else ko++; console.log((cond ? 'OK  ' : 'ERR ') + nome); }

var a = M.simula({}), b = M.simula({});
verifica('stesso seme, stesso risultato', JSON.stringify(a.finale) === JSON.stringify(b.finale));
verifica('seme diverso, risultato diverso', JSON.stringify(M.simula({ seme: 7 }).finale) !== JSON.stringify(a.finale));
verifica('ogni mese gli agenti sono tutti contati', a.serie.every(function (s) { return s.conta.reduce(function (x, y) { return x + y; }, 0) === a.parametri.n; }));
verifica('chi fruisce non diminuisce nel tempo', a.serie.every(function (s, i) { return i === 0 || s.conta[4] >= a.serie[i - 1].conta[4]; }));
var tutti = M.simula({ infoIniziale: 1, tempoA: 0.01, tempoB: 0.01, domanda: 1, ostacolo: 0 });
verifica('nessun ostacolo: fruiscono tutti', tutti.fruizione === 1);
var nessuno = M.simula({ infoIniziale: 0 });
verifica('nessuno informato e nessun passaparola possibile: nessuno fruisce', nessuno.fruizione === 0);
var sens = M.sensibilita(M.BASE, 'infoIniziale', [0.2, 0.4, 0.6, 0.8, 1]);
verifica('piu\' informazione iniziale, piu\' fruizione', sens.every(function (x, i) { return i === 0 || x.fruizione >= sens[i - 1].fruizione; }));
verifica('tempi piu\' lunghi nel territorio B riducono la fruizione in B', a.fruizioneB < a.fruizioneA);
// Ripetizioni (100 semi)
var rip = M.ripeti({}), rip2 = M.ripeti({});
verifica('ripetizioni: stesso risultato a ogni esecuzione', JSON.stringify(rip) === JSON.stringify(rip2));
verifica('ripetizioni: la media sta fra il minimo e il massimo', rip.min <= rip.media && rip.media <= rip.max);
verifica('ripetizioni: le fasi medie sommano a 1', Math.abs(rip.fasi.reduce(function (x, y) { return x + y; }, 0) - 1) < 1e-9);
verifica('ripetizioni: con tempi uguali lo scarto fra A e B resta sotto un punto', Math.abs(M.ripeti({ tempoB: M.BASE.tempoA }).mediaA - M.ripeti({ tempoB: M.BASE.tempoA }).mediaB) < 0.01);
var sensR = M.sensibilita(M.BASE, 'infoIniziale', [0.1, 0.4, 0.9], 100);
verifica('sensibilita\' su 100 ripetizioni: piu\' informazione, piu\' fruizione', sensR[0].fruizione < sensR[1].fruizione && sensR[1].fruizione < sensR[2].fruizione);
console.log('\n' + ok + ' superati, ' + ko + ' falliti');
process.exit(ko ? 1 : 0);
