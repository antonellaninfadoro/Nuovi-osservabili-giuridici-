/*
 * Terzo prototipo - livello 4: microsimulazione illustrativa.
 * NON rappresenta gli effetti reali della l. 104/1992: e' un esperimento
 * computazionale su una popolazione IPOTETICA, con parametri dichiarati.
 * Scheda: SCHEDE-C.md, scheda S1.
 *
 * Ogni agente e' una persona che ha i requisiti per i permessi dell'art. 33, c. 3.
 * Il percorso segue i passaggi della figura 5 del primo prototipo:
 *   1 conosce il diritto  ->  2 ha la gravita' accertata (art. 4)  ->
 *   3 presenta la domanda  ->  4 fruisce dei permessi
 * L'unica interazione fra agenti e' il passaparola: chi conosce il diritto
 * puo' informare i propri contatti (ipotesi da dichiarare).
 */
(function (root) {
  'use strict';

  // Generatore pseudo-casuale con seme, per risultati riproducibili.
  function rng(seme) {
    var a = seme >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var FASI = ['non informato', 'informato, in attesa di accertamento', 'accertato, domanda non presentata', 'domanda presentata, permessi non fruiti', 'fruisce dei permessi'];

  // Parametri di base: VALORI IPOTETICI, scelti solo per rendere leggibile l'esperimento.
  var BASE = {
    n: 1000,              // agenti aventi diritto
    mesi: 12,             // orizzonte temporale
    infoIniziale: 0.40,   // quota che conosce il diritto al mese 0
    contatti: 4,          // contatti per agente (rete casuale)
    passaparola: 0.05,    // probabilita' mensile di essere informati da ciascun contatto informato
    tempoA: 4,            // mesi medi di accertamento nel territorio A
    tempoB: 9,            // mesi medi di accertamento nel territorio B
    quotaB: 0.5,          // quota di agenti nel territorio B
    domanda: 0.80,        // probabilita' di presentare la domanda una volta accertati
    ostacolo: 0.10,       // probabilita' che il datore ostacoli la fruizione
    seme: 104
  };

  function simula(par) {
    var p = {}; for (var k in BASE) p[k] = (par && par[k] !== undefined) ? par[k] : BASE[k];
    var r = rng(p.seme);
    var agenti = [];
    for (var i = 0; i < p.n; i++) {
      var terr = r() < p.quotaB ? 'B' : 'A';
      var media = terr === 'A' ? p.tempoA : p.tempoB;
      // tempo di accertamento: esponenziale con la media del territorio (ipotesi)
      var attesa = Math.max(1, Math.round(-Math.log(1 - r()) * media));
      agenti.push({ id: i, terr: terr, informato: r() < p.infoIniziale, meseInfo: 0, attesa: attesa,
        fase: 0, contatti: [], domanda: r() < p.domanda, ostacolato: r() < p.ostacolo });
    }
    agenti.forEach(function (a) {
      for (var c = 0; c < p.contatti; c++) a.contatti.push(Math.floor(r() * p.n));
    });
    var serie = [];
    function fotografa(mese) {
      var conta = [0, 0, 0, 0, 0];
      agenti.forEach(function (a) { conta[a.fase]++; });
      serie.push({ mese: mese, conta: conta });
    }
    agenti.forEach(function (a) { a.fase = a.informato ? 1 : 0; });
    fotografa(0);
    for (var m = 1; m <= p.mesi; m++) {
      // passaparola: calcolato sullo stato del mese precedente
      var nuovi = [];
      agenti.forEach(function (a) {
        if (a.informato) return;
        var inf = a.contatti.filter(function (j) { return agenti[j].informato; }).length;
        if (inf && r() < 1 - Math.pow(1 - p.passaparola, inf)) nuovi.push(a);
      });
      nuovi.forEach(function (a) { a.informato = true; a.meseInfo = m; a.fase = 1; });
      agenti.forEach(function (a) {
        if (!a.informato) return;
        if (a.fase === 1 && m - a.meseInfo >= a.attesa) a.fase = 2;
        if (a.fase === 2 && a.domanda) a.fase = 3;
        if (a.fase === 3 && !a.ostacolato) a.fase = 4;
      });
      fotografa(m);
    }
    var fin = serie[serie.length - 1].conta;
    function quota(t) {
      var g = agenti.filter(function (a) { return a.terr === t; });
      return g.length ? g.filter(function (a) { return a.fase === 4; }).length / g.length : null;
    }
    return { parametri: p, agenti: agenti, serie: serie, finale: fin,
      fruizione: fin[4] / p.n, fruizioneA: quota('A'), fruizioneB: quota('B') };
  }

  // Ripetizioni: lo stesso esperimento con semi diversi (1..volte).
  // Restituisce la media, il minimo e il massimo della quota che fruisce,
  // le medie per territorio e la composizione media per fase alla fine.
  var RIPETIZIONI = 100;
  function ripeti(par, volte) {
    volte = volte || RIPETIZIONI;
    var tot = 0, totA = 0, totB = 0, min = 1, max = 0, fasi = [0, 0, 0, 0, 0];
    for (var s = 1; s <= volte; s++) {
      var q = {}; for (var k in par) q[k] = par[k]; q.seme = s;
      var r = simula(q);
      tot += r.fruizione; totA += r.fruizioneA; totB += r.fruizioneB;
      if (r.fruizione < min) min = r.fruizione;
      if (r.fruizione > max) max = r.fruizione;
      r.finale.forEach(function (x, i) { fasi[i] += x / r.parametri.n / volte; });
    }
    return { volte: volte, media: tot / volte, min: min, max: max,
      mediaA: totA / volte, mediaB: totB / volte, fasi: fasi };
  }

  // Analisi di sensibilita': quota che fruisce al variare di un parametro,
  // come media di 'volte' ripetizioni (con volte = 1: una sola esecuzione, seme dei parametri).
  function sensibilita(par, nome, valori, volte) {
    return valori.map(function (v) {
      var q = {}; for (var k in par) q[k] = par[k]; q[nome] = v;
      return { valore: v, fruizione: volte ? ripeti(q, volte).media : simula(q).fruizione };
    });
  }

  var api = { rng: rng, simula: simula, ripeti: ripeti, sensibilita: sensibilita, RIPETIZIONI: RIPETIZIONI, BASE: BASE, FASI: FASI };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ModelloC = api;
})(this);
