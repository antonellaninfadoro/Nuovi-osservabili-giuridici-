/* Terzo prototipo - vista. Usa window.ModelloC; i dati osservati sono qui sotto, con la fonte. */
(function () {
  'use strict';
  var M = window.ModelloC, NS = 'http://www.w3.org/2000/svg';
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Dati osservati (scheda O1, O2) ---------- */
  var FRUITORI = [
    { anno: 2020, n: 445167 },
    { anno: 2024, n: 608206 }
  ]; // INPS, Osservatorio prestazioni a sostegno della famiglia, Tavola 6.1 (tesi, nota 469)
  var EVENTI = [
    { anno: 2016, testo: 'Corte cost. 213: anche il convivente', su: true },
    { anno: 2020.2, testo: 'd.l. 18: +24 giorni fra marzo e giugno', su: false },
    { anno: 2020, dato: 445167 },
    { anno: 2022.5, testo: 'd.lgs. 105: più familiari a turno', su: true },
    { anno: 2024.4, testo: 'd.lgs. 62: "condizione di disabilità"', su: false },
    { anno: 2024, dato: 608206 },
    { anno: 2027, testo: 'nuovo accertamento previsto', su: true, alto: true, previsto: true }
  ];

  function el(nome, attr, figli) {
    var e = document.createElementNS(NS, nome);
    for (var k in attr) e.setAttribute(k, attr[k]);
    (figli || []).forEach(function (f) { e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return e;
  }
  function fmt(x, d) { return Number(x).toLocaleString('it-IT', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function pct(x) { return fmt(x * 100, 0) + '%'; }

  /* ---------- Figura 1 ---------- */
  function figFruitori() {
    var W = 560, H = 300, X0 = 70, Y0 = 250, ALT = 210, MAX = 700000;
    var y = function (v) { return Y0 - v / MAX * ALT; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Fruitori dei permessi: 445.167 nel 2020, 608.206 nel 2024; aventi diritto: dato non disponibile' });
    [0, 200000, 400000, 600000].forEach(function (v) {
      svg.appendChild(el('line', { x1: X0, y1: y(v), x2: W - 20, y2: y(v), class: 'ax' }));
      svg.appendChild(el('text', { x: X0 - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'lbl' }, [v ? fmt(v / 1000) + ' mila' : '0']));
    });
    FRUITORI.forEach(function (d, i) {
      var x = X0 + 40 + i * 130;
      svg.appendChild(el('rect', { x: x, y: y(d.n), width: 80, height: Y0 - y(d.n), rx: 3, class: 'barra-oss' }, [el('title', {}, [d.anno + ': ' + fmt(d.n) + ' fruitori'])]));
      svg.appendChild(el('text', { x: x + 40, y: y(d.n) - 8, 'text-anchor': 'middle', class: 'val' }, [fmt(d.n)]));
      svg.appendChild(el('text', { x: x + 40, y: Y0 + 18, 'text-anchor': 'middle', class: 'lbl' }, [String(d.anno)]));
    });
    var v = FRUITORI[1].n / FRUITORI[0].n - 1;
    svg.appendChild(el('text', { x: X0 + 185, y: y(FRUITORI[1].n) - 30, 'text-anchor': 'middle', class: 'lbl' }, ['+' + fmt(v * 100, 1) + '%']));
    var xm = X0 + 340;
    svg.appendChild(el('path', { d: 'M' + xm + ' ' + Y0 + ' V' + (Y0 - ALT - 10) + ' M' + (xm + 110) + ' ' + Y0 + ' V' + (Y0 - ALT - 10), class: 'barra-manca' }));
    svg.appendChild(el('text', { x: xm + 55, y: Y0 - ALT / 2 - 6, 'text-anchor': 'middle', class: 'manca-txt' }, ['aventi diritto']));
    svg.appendChild(el('text', { x: xm + 55, y: Y0 - ALT / 2 + 14, 'text-anchor': 'middle', class: 'manca-txt' }, ['?']));
    svg.appendChild(el('text', { x: xm + 55, y: Y0 + 18, 'text-anchor': 'middle', class: 'lbl' }, ['dato non disponibile']));
    $('fig-fruitori').appendChild(svg);
  }

  /* ---------- Figura 2 ---------- */
  function figTempo() {
    var W = 760, H = 200, X0 = 40, X1 = W - 40, Y = 92, A0 = 2015, A1 = 2028;
    var x = function (a) { return X0 + (a - A0) / (A1 - A0) * (X1 - X0); };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Modifiche della disciplina dei permessi e misure INPS dal 2016 al 2027' });
    svg.appendChild(el('line', { x1: X0, y1: Y, x2: X1, y2: Y, class: 'ev-linea' }));
    for (var a = 2016; a <= 2027; a++) {
      svg.appendChild(el('line', { x1: x(a), y1: Y - 4, x2: x(a), y2: Y + 4, class: 'ax' }));
      if (a % 2 === 0) svg.appendChild(el('text', { x: x(a), y: Y + 20, 'text-anchor': 'middle', class: 'ev-anno' }, [String(a)]));
    }
    EVENTI.forEach(function (e) {
      if (e.dato) {
        svg.appendChild(el('rect', { x: x(e.anno) - 6, y: Y - 6, width: 12, height: 12, class: 'ev-dato' }, [el('title', {}, ['INPS ' + Math.floor(e.anno) + ': ' + fmt(e.dato) + ' fruitori'])]));
        svg.appendChild(el('text', { x: x(e.anno), y: Y + 40, 'text-anchor': 'middle', class: 'val' }, [fmt(e.dato)]));
        return;
      }
      var yt = e.su ? (e.alto ? Y - 62 : Y - 34) : Y + 64;
      svg.appendChild(el('line', { x1: x(e.anno), y1: Y, x2: x(e.anno), y2: e.su ? yt + 8 : Y + 50, class: 'ax' }));
      svg.appendChild(el('circle', { cx: x(e.anno), cy: Y, r: 5, class: 'ev-punto', 'stroke-dasharray': e.previsto ? '2 2' : '' }));
      var anc = x(e.anno) > W - 150 ? 'end' : x(e.anno) < 140 ? 'start' : 'middle';
      svg.appendChild(el('text', { x: x(e.anno), y: yt, 'text-anchor': anc, class: 'ev-txt' }, [e.testo]));
    });
    svg.appendChild(el('text', { x: X0, y: 190, class: 'lbl' }, ['○ modifica della disciplina   ■ misura INPS dei fruitori']));
    $('fig-tempo').appendChild(svg);
  }

  /* ---------- Simulazione ---------- */
  var PARAMETRI = [
    { k: 'infoIniziale', nome: 'Conosce il diritto all\'inizio', min: 0, max: 1, passo: 0.05, f: pct },
    { k: 'passaparola', nome: 'Passaparola, al mese per contatto', min: 0, max: 0.2, passo: 0.01, f: pct },
    { k: 'tempoA', nome: 'Accertamento nel territorio A', min: 1, max: 12, passo: 1, f: function (v) { return v + ' mesi'; } },
    { k: 'tempoB', nome: 'Accertamento nel territorio B', min: 1, max: 12, passo: 1, f: function (v) { return v + ' mesi'; } },
    { k: 'domanda', nome: 'Presenta la domanda, se accertato', min: 0, max: 1, passo: 0.05, f: pct },
    { k: 'ostacolo', nome: 'Il datore ostacola la fruizione', min: 0, max: 0.5, passo: 0.02, f: pct }
  ];
  var SCENARI = {
    base: {},
    informazione: { infoIniziale: 0.9 },
    tempi: { tempoB: M.BASE.tempoA },
    garanzia: { ostacolo: 0.02 }
  };
  var par = {}, base = M.simula(M.BASE), sensK = 'infoIniziale';
  function copia(o) { var c = {}; for (var k in o) c[k] = o[k]; return c; }

  function costruisciComandi() {
    $('parametri').innerHTML = PARAMETRI.map(function (p) {
      return '<div class="param"><label for="p-' + p.k + '">' + p.nome + ' <b id="v-' + p.k + '"></b></label>' +
        '<input type="range" id="p-' + p.k + '" min="' + p.min + '" max="' + p.max + '" step="' + p.passo + '"><small>ipotesi di base: ' + p.f(M.BASE[p.k]) + '</small></div>';
    }).join('');
    PARAMETRI.forEach(function (p) {
      $('p-' + p.k).addEventListener('input', function () {
        par[p.k] = parseFloat(this.value);
        segnaScenario(null); aggiorna();
      });
    });
    $('scelta-sens').innerHTML = PARAMETRI.map(function (p) {
      return '<button type="button" data-sens="' + p.k + '" aria-pressed="' + (p.k === sensK) + '">' + p.nome + '</button>';
    }).join('');
    $('scelta-sens').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sens]'); if (!b) return;
      sensK = b.getAttribute('data-sens');
      document.querySelectorAll('[data-sens]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      figSens();
    });
    document.querySelectorAll('[data-scenario]').forEach(function (b) {
      b.addEventListener('click', function () { applica(b.getAttribute('data-scenario')); });
    });
    $('b-ripristina').addEventListener('click', function () { applica('base'); });
    $('leg-fasi').innerHTML = M.FASI.map(function (f, i) { return '<span><i class="sw f' + i + '"></i>' + f + '</span>'; }).join('');
  }
  function segnaScenario(nome) {
    document.querySelectorAll('[data-scenario]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-scenario') === nome)); });
  }
  function applica(nome) {
    par = copia(M.BASE);
    var s = SCENARI[nome]; for (var k in s) par[k] = s[k];
    segnaScenario(nome); aggiorna();
  }

  var ultimo = null;
  function aggiorna() {
    PARAMETRI.forEach(function (p) { $('p-' + p.k).value = par[p.k]; $('v-' + p.k).textContent = p.f(par[p.k]); });
    ultimo = M.simula(par);
    var d = ultimo.fruizione - base.fruizione;
    $('r-quota').textContent = pct(ultimo.fruizione);
    $('r-testo').textContent = 'delle persone ipotetiche con i requisiti fruisce dei permessi dopo 12 mesi (territorio A ' + pct(ultimo.fruizioneA) + ', B ' + pct(ultimo.fruizioneB) + '). ' +
      (Math.abs(d) < 0.0005 ? 'È l\'ipotesi di base.' : (d > 0 ? '+' : '−') + fmt(Math.abs(d) * 100, 0) + ' punti rispetto all\'ipotesi di base (' + pct(base.fruizione) + ').');
    figAgenti(); figImbuto(); figMesi(); figSens();
  }

  function figAgenti() {
    var cont = $('fig-agenti'); cont.innerHTML = '';
    ['A', 'B'].forEach(function (t) {
      var g = ultimo.agenti.filter(function (a) { return a.terr === t; }).sort(function (a, b) { return b.fase - a.fase; });
      var COL = 25, L = 10, righe = Math.ceil(g.length / COL);
      var svg = el('svg', { viewBox: '0 0 ' + (COL * L) + ' ' + (righe * L), role: 'img', 'aria-label': 'Territorio ' + t + ': ' + g.length + ' persone' });
      g.forEach(function (a, i) {
        svg.appendChild(el('rect', { x: (i % COL) * L + 1, y: Math.floor(i / COL) * L + 1, width: L - 2, height: L - 2, rx: 1.5, class: 'f' + a.fase }));
      });
      var q = g.filter(function (a) { return a.fase === 4; }).length;
      var box = document.createElement('div'); box.className = 'griglia';
      box.innerHTML = '<h4>Territorio ' + t + ' · accertamento in ' + par['tempo' + t] + ' mesi · fruisce ' + q + ' su ' + g.length + '</h4>';
      box.appendChild(svg); cont.appendChild(box);
    });
  }

  function cumul(conta, da) { var s = 0; for (var i = da; i < conta.length; i++) s += conta[i]; return s; }
  function figImbuto() {
    var W = 420, H = 230, X0 = 150, L = W - X0 - 50, n = par.n;
    var passi = ['ha i requisiti', 'conosce il diritto', 'è accertato', 'presenta domanda', 'fruisce'];
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Persone che superano ciascun passaggio' });
    passi.forEach(function (p, i) {
      var v = i === 0 ? n : cumul(ultimo.finale, i), vb = i === 0 ? n : cumul(base.finale, i), y = 14 + i * 42;
      svg.appendChild(el('text', { x: X0 - 10, y: y + 17, 'text-anchor': 'end', class: 'lbl' }, [p]));
      svg.appendChild(el('rect', { x: X0, y: y, width: L, height: 26, rx: 3, class: 'imb-perdita' }));
      svg.appendChild(el('rect', { x: X0, y: y, width: L * v / n, height: 26, rx: 3, class: 'imb-barra' }, [el('title', {}, [p + ': ' + v + ' su ' + n])]));
      svg.appendChild(el('line', { x1: X0 + L * vb / n, y1: y - 3, x2: X0 + L * vb / n, y2: y + 29, stroke: '#111', 'stroke-width': 2, 'stroke-dasharray': '3 2' }, [el('title', {}, ['ipotesi di base: ' + vb])]));
      svg.appendChild(el('text', { x: X0 + L + 8, y: y + 17, class: 'val' }, [String(v)]));
    });
    $('fig-imbuto').innerHTML = ''; $('fig-imbuto').appendChild(svg);
    $('fig-imbuto').insertAdjacentHTML('beforeend', '<p class="nota">Barra: scenario corrente. Tratteggio nero: ipotesi di base.</p>');
  }

  function linea(serie, x, y) { return serie.map(function (s, i) { return (i ? 'L' : 'M') + x(s.mese).toFixed(1) + ' ' + y(s.conta[4] / par.n).toFixed(1); }).join(' '); }
  function figMesi() {
    var W = 420, H = 230, X0 = 44, X1 = W - 14, Y0 = 196, Y1 = 14;
    var x = function (m) { return X0 + m / 12 * (X1 - X0); }, y = function (q) { return Y0 - q * (Y0 - Y1); };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Quota che fruisce dei permessi nei 12 mesi' });
    [0, 0.25, 0.5, 0.75, 1].forEach(function (q) {
      svg.appendChild(el('line', { x1: X0, y1: y(q), x2: X1, y2: y(q), class: 'ax' }));
      svg.appendChild(el('text', { x: X0 - 6, y: y(q) + 4, 'text-anchor': 'end', class: 'lbl' }, [pct(q)]));
    });
    [0, 3, 6, 9, 12].forEach(function (m) { svg.appendChild(el('text', { x: x(m), y: Y0 + 18, 'text-anchor': 'middle', class: 'lbl' }, [m ? 'mese ' + m : 'inizio'])); });
    svg.appendChild(el('path', { d: linea(base.serie, x, y), class: 'linea-base' }));
    svg.appendChild(el('path', { d: linea(ultimo.serie, x, y), class: 'linea-scen' }));
    $('fig-mesi').innerHTML = ''; $('fig-mesi').appendChild(svg);
    $('fig-mesi').insertAdjacentHTML('beforeend', '<p class="nota">Linea piena: scenario corrente. Tratteggio: ipotesi di base.</p>');
  }

  function figSens() {
    var p = PARAMETRI.filter(function (q) { return q.k === sensK; })[0];
    var valori = []; for (var i = 0; i <= 10; i++) valori.push(+(p.min + (p.max - p.min) * i / 10).toFixed(4));
    var dati = M.sensibilita(par, sensK, valori);
    var W = 760, H = 240, X0 = 50, X1 = W - 20, Y0 = 200, Y1 = 14;
    var x = function (v) { return X0 + (v - p.min) / (p.max - p.min) * (X1 - X0); }, y = function (q) { return Y0 - q * (Y0 - Y1); };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Sensibilità della quota che fruisce a: ' + p.nome });
    [0, 0.25, 0.5, 0.75, 1].forEach(function (q) {
      svg.appendChild(el('line', { x1: X0, y1: y(q), x2: X1, y2: y(q), class: 'ax' }));
      svg.appendChild(el('text', { x: X0 - 6, y: y(q) + 4, 'text-anchor': 'end', class: 'lbl' }, [pct(q)]));
    });
    [0, 5, 10].forEach(function (i) { svg.appendChild(el('text', { x: x(valori[i]), y: Y0 + 18, 'text-anchor': i === 0 ? 'start' : i === 10 ? 'end' : 'middle', class: 'lbl' }, [p.f(valori[i])])); });
    svg.appendChild(el('text', { x: (X0 + X1) / 2, y: Y0 + 36, 'text-anchor': 'middle', class: 'lbl' }, [p.nome]));
    svg.appendChild(el('path', { d: dati.map(function (d, i) { return (i ? 'L' : 'M') + x(d.valore).toFixed(1) + ' ' + y(d.fruizione).toFixed(1); }).join(' '), class: 'linea-sens' }));
    dati.forEach(function (d) { svg.appendChild(el('circle', { cx: x(d.valore), cy: y(d.fruizione), r: 4, class: 'punto-sens' }, [el('title', {}, [p.f(d.valore) + ': fruisce ' + pct(d.fruizione)])])); });
    svg.appendChild(el('circle', { cx: x(par[sensK]), cy: y(ultimo.fruizione), r: 7, class: 'punto-qui' }, [el('title', {}, ['scenario corrente'])]));
    $('fig-sens').innerHTML = ''; $('fig-sens').appendChild(svg);
  }

  figFruitori(); figTempo(); costruisciComandi(); applica('base');
})();
