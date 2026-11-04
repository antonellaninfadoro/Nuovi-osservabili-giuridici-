/*
 * Laboratorio A - grafici di sintesi. Solo visualizzazione: legge il risultato
 * di AnalisiA.analizza() e non calcola nuove misure.
 * Fonti di fasce, riferimenti e polarita': SCHEDE-A.md, scheda G.
 */
(function (root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  // Fasce Gulpease: Lucisano e Piemontese 1988, come riportate nella tesi (cap. 3, nota 441)
  // e coerenti con Brunato e Venturi 2014, nota 55. DA VERIFICARE sull'originale.
  var FASCE = [
    { da: 0, a: 40, nome: 'sotto 40', senso: 'sotto la soglia del diploma superiore' },
    { da: 40, a: 60, nome: '40–60', senso: 'facile con diploma superiore' },
    { da: 60, a: 80, nome: '60–80', senso: 'facile con licenza media' },
    { da: 80, a: 100, nome: 'oltre 80', senso: 'facile con licenza elementare' }
  ];

  function el(nome, attr, figli) {
    var e = document.createElementNS(NS, nome);
    for (var k in attr) e.setAttribute(k, attr[k]);
    (figli || []).forEach(function (f) { e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return e;
  }
  function fmt(x, d) { return Number(x).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Geometria del semicerchio: t in [0,1], 0 = sinistra, 1 = destra. */
  var CX = 150, CY = 150, R = 110;
  function punto(t, r) {
    var th = Math.PI * (1 - t);
    return [CX + r * Math.cos(th), CY - r * Math.sin(th)];
  }
  function arco(t1, t2, r) {
    var p1 = punto(t1, r), p2 = punto(t2, r);
    return 'M' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
  }

  /*
   * gauge(opzioni)
   *   scala(v) -> t in [0,1] (polarita': destra = verso indicato dalla fonte)
   *   fasce: [{t1,t2,classe}] | null
   *   tacche: [{t, etichetta}]
   *   punti: [{t, titolo, vai}]
   *   lancetta: t
   *   riferimenti: [{t, titolo}]
   */
  function gauge(o) {
    var svg = el('svg', { viewBox: '0 0 300 178', class: 'gauge', role: 'img', 'aria-label': o.aria });
    // traccia di fondo
    svg.appendChild(el('path', { d: arco(0, 1, R), class: 'g-traccia' }));
    (o.fasce || []).forEach(function (f) {
      var g = 0.004; // 2px circa di stacco fra le fasce
      svg.appendChild(el('path', { d: arco(f.t1 + (f.t1 > 0 ? g : 0), f.t2 - (f.t2 < 1 ? g : 0), R), class: 'g-fascia ' + f.classe }, [el('title', {}, [f.titolo])]));
    });
    // tacche ed etichette
    o.tacche.forEach(function (k) {
      var a = punto(k.t, R - 13), b = punto(k.t, R + 13), l = punto(k.t, R + 25);
      svg.appendChild(el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'g-tacca' }));
      var anc = k.t < 0.35 ? 'end' : k.t > 0.65 ? 'start' : 'middle';
      svg.appendChild(el('text', { x: l[0], y: l[1] + 3, 'text-anchor': anc, class: 'g-etich' }, [k.etichetta]));
    });
    // riferimenti esterni (triangoli verso l'interno)
    (o.riferimenti || []).forEach(function (r) {
      var p = punto(r.t, R - 15), q1 = punto(r.t - 0.012, R - 25), q2 = punto(r.t + 0.012, R - 25);
      svg.appendChild(el('path', { d: 'M' + p.join(' ') + ' L' + q1.join(' ') + ' L' + q2.join(' ') + 'Z', class: 'g-rif' }, [el('title', {}, [r.titolo])]));
    });
    // punti: commi o frasi, sul bordo esterno
    o.punti.forEach(function (p) {
      var c = punto(p.t, R + 2);
      var g = el('g', { class: 'g-punto', tabindex: '0', 'data-vai': p.vai || '' }, [
        el('circle', { cx: c[0], cy: c[1], r: 11, class: 'g-bersaglio' }),
        el('circle', { cx: c[0], cy: c[1], r: 4.5, class: 'g-dot' }),
        el('title', {}, [p.titolo])
      ]);
      svg.appendChild(g);
    });
    // lancetta
    var n = punto(o.lancetta, R - 20), base1 = punto(o.lancetta + 0.5, 6), base2 = punto(o.lancetta - 0.5, 6);
    svg.appendChild(el('path', { d: 'M' + base1.join(' ') + ' L' + n.join(' ') + ' L' + base2.join(' ') + 'Z', class: 'g-lancetta' }));
    svg.appendChild(el('circle', { cx: CX, cy: CY, r: 7, class: 'g-perno' }));
    return svg;
  }

  function pannello(titolo, valore, unita, svg, polarita, legenda, nota) {
    var d = document.createElement('figure');
    d.className = 'pannello';
    d.innerHTML = '<figcaption><h3>' + esc(titolo) + '</h3>' +
      (valore !== null ? '<div class="valore"><strong>' + esc(valore) + '</strong> <span>' + esc(unita) + '</span></div>' : '') +
      '</figcaption>';
    if (svg) { var w = document.createElement('div'); w.className = 'g-svg'; w.appendChild(svg); d.appendChild(w); }
    var p = document.createElement('div'); p.className = 'polarita'; p.innerHTML = polarita; d.appendChild(p);
    if (legenda) { var l = document.createElement('div'); l.className = 'g-legenda'; l.innerHTML = legenda; d.appendChild(l); }
    var f = document.createElement('p'); f.className = 'nota'; f.innerHTML = nota; d.appendChild(f);
    return d;
  }

  function nomeComma(c) { return c.numero ? 'comma ' + c.numero : 'comma ' + (c.indice + 1); }

  /* 1. Gulpease */
  // altri: articoli confrontati, [{nome, gulpease, parolePerFrase}]
  function rifAltri(altri, campo, s) {
    return (altri || []).filter(function (a) { return a[campo] !== null && a[campo] !== undefined; })
      .map(function (a) { return { t: s(a[campo]), titolo: a.nome + ': ' + fmt(a[campo], 1) }; });
  }
  function legAltri(altri, campo) {
    var xs = (altri || []).filter(function (a) { return a[campo] !== null && a[campo] !== undefined; });
    return xs.length ? '<span><i class="sw rif"></i>' + xs.map(function (a) { return a.nome + ': ' + fmt(a[campo], 1); }).join(' · ') + '</span>' : '';
  }

  function pannelloGulpease(r, altri) {
    var s = function (v) { return Math.max(0, Math.min(100, v)) / 100; };
    var commi = r.commi.map(function (c, k) { return { c: c, k: k }; }).filter(function (x) { return x.c.gulpease !== null; });
    var svg = gauge({
      aria: 'Indice Gulpease dell\'articolo: ' + fmt(r.totali.gulpease, 1) + ' su una scala da 0 a 100',
      fasce: FASCE.map(function (f, i) { return { t1: f.da / 100, t2: f.a / 100, classe: 'f' + i, titolo: f.nome + ': ' + f.senso }; }),
      tacche: [0, 40, 60, 80, 100].map(function (v) { return { t: v / 100, etichetta: String(v) }; }),
      punti: commi.map(function (x) { return { t: s(x.c.gulpease), titolo: nomeComma(x.c) + ': ' + fmt(x.c.gulpease, 1), vai: 'cm-' + x.k }; }),
      riferimenti: rifAltri(altri, 'gulpease', s),
      lancetta: s(r.totali.gulpease)
    });
    var leg = FASCE.map(function (f, i) { return '<span><i class="sw f' + i + '"></i><b>' + f.nome + '</b> ' + f.senso + '</span>'; }).join('') +
      '<span><i class="sw dot"></i>un punto per comma</span>' + legAltri(altri, 'gulpease');
    return pannello('Leggibilità (Gulpease)', fmt(r.totali.gulpease, 1), 'articolo intero', svg,
      '<b>→</b> Verso destra il testo è più facile da leggere. La polarità è nella formula: valori più alti significano parole e frasi più brevi.',
      leg,
      'Fasce: Lucisano e Piemontese (1988), riportate nella tesi (nota 441) e da Brunato e Venturi (2014, nota 55). <span class="verifica">Da verificare sull\'originale.</span> La leggibilità non dice nulla sulla correttezza giuridica della norma.');
  }

  /* 2. Lunghezza dei periodi */
  function pannelloFrasi(r, altri) {
    var frasi = [];
    r.commi.forEach(function (c, k) { if (!c.abrogato) c.frasi.forEach(function (f, j) { frasi.push({ f: f, c: c, k: k, j: j }); }); });
    var max = Math.max(60, Math.ceil((r.totali.frasePiuLunga || 0) / 20) * 20);
    // polarita' invertita: a destra i periodi brevi
    var s = function (v) { return 1 - Math.max(0, Math.min(max, v)) / max; };
    var passi = []; for (var v = 0; v <= max; v += max / 4) passi.push(v);
    var svg = gauge({
      aria: 'Parole per frase, media dell\'articolo: ' + fmt(r.totali.parolePerFrase, 1),
      fasce: null,
      tacche: passi.map(function (v) { return { t: s(v), etichetta: String(v) }; }),
      punti: frasi.map(function (x) { return { t: s(x.f.parole), titolo: nomeComma(x.c) + ', frase ' + (x.j + 1) + ': ' + x.f.parole + ' parole', vai: 'cm-' + x.k }; }),
      riferimenti: rifAltri(altri, 'parolePerFrase', s),
      lancetta: s(r.totali.parolePerFrase)
    });
    var leg = '<span><i class="sw dot"></i>un punto per frase</span>' + legAltri(altri, 'parolePerFrase');
    return pannello('Lunghezza dei periodi', fmt(r.totali.parolePerFrase, 1), 'parole per frase, in media', svg,
      '<b>→</b> Verso destra i periodi sono più brevi. È l\'assunzione su cui si basano le formule di leggibilità (Fameli et al. 2014, p. 208), non una regola di tecnica legislativa. Per questo il grafico non ha fasce.',
      leg,
      'Frase: segmento che termina con il punto (Regole e raccomandazioni 2001, par. 7, lett. e; Fameli et al. 2014, § 10.4, p. 208). Frase più lunga dell\'articolo: ' + r.totali.frasePiuLunga + ' parole.' + ((altri || []).length ? ' Triangoli: gli altri articoli analizzati.' : ''));
  }


  /* ---------- Figura 2: diagramma ad archi dei rinvii fra commi (schede D1, A6) ---------- */
  function figuraCommi(cont, legenda, r, azioni) {
    var commi = r.commi, R = r.relazioni;
    var W = 760, M = 46, YB = 250, H = 345;
    var passo = (W - 2 * M) / Math.max(1, commi.length - 1);
    var pos = {}, raggio = {};
    commi.forEach(function (c, i) {
      pos[c.numero] = M + i * passo;
      raggio[c.numero] = c.abrogato ? 9 : 5 + Math.sqrt(c.parole) * 0.85;
    });
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img',
      'aria-label': R.interne.length + ' rinvii fra i commi; il comma più citato è il 3' });
    var defs = el('defs', {}, [
      el('marker', { id: 'fr-int', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, [el('path', { d: 'M0 0 L10 5 L0 10 z', class: 'a-punta' })]),
      el('marker', { id: 'fr-abr', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, [el('path', { d: 'M0 0 L10 5 L0 10 z', class: 'a-punta-abr' })])
    ]);
    svg.appendChild(defs);
    svg.appendChild(el('line', { x1: M - 20, y1: YB, x2: W - M + 20, y2: YB, class: 'a-base' }));
    var archi = R.interne.slice().sort(function (a, b) { return Math.abs(pos[b.da] - pos[b.a]) - Math.abs(pos[a.da] - pos[a.a]); });
    archi.forEach(function (e) {
      if (!(e.a in pos)) return;
      var x1 = pos[e.da], x2 = pos[e.a], dx = Math.abs(x2 - x1);
      var y1 = YB - raggio[e.da], y2 = YB - raggio[e.a] - 3;
      var rx = dx / 2, ry = Math.min(dx * 0.42, YB - 40);
      var sweep = x2 > x1 ? 1 : 0;
      svg.appendChild(el('path', {
        d: 'M' + x1 + ' ' + y1 + ' A' + rx + ' ' + ry + ' 0 0 ' + sweep + ' ' + x2 + ' ' + y2,
        class: 'a-arco' + (e.abrogato ? ' abr' : ''), 'marker-end': 'url(#' + (e.abrogato ? 'fr-abr' : 'fr-int') + ')'
      }, [el('title', {}, ['comma ' + e.da + ' → comma ' + e.a + ': «' + e.testo + '»' + (e.abrogato ? ' (comma abrogato)' : '')])]));
    });
    commi.forEach(function (c, k) {
      var x = pos[c.numero], ing = R.ingresso[c.numero] || 0;
      var g = el('g', { class: 'a-nodo' + (c.abrogato ? ' abr' : ''), tabindex: '0', 'data-vai': 'cm-' + k }, [
        el('circle', { cx: x, cy: YB, r: Math.max(raggio[c.numero], 14), class: 'g-bersaglio' }),
        el('circle', { cx: x, cy: YB, r: raggio[c.numero], class: 'a-cerchio' }),
        el('text', { x: x, y: YB + raggio[c.numero] + 18, 'text-anchor': 'middle', class: 'a-num' }, [c.numero]),
        el('text', { x: x, y: YB + raggio[c.numero] + 32, 'text-anchor': 'middle', class: 'a-sub' }, [c.abrogato ? 'abrogato' : c.parole + ' par.']),
        el('title', {}, ['comma ' + c.numero + (c.abrogato ? ' (abrogato)' : ': ' + c.parole + ' parole') + (ing ? ', citato da ' + ing + (ing === 1 ? ' comma' : ' commi') : '')])
      ]);
      if (ing) g.appendChild(el('text', { x: x, y: YB + raggio[c.numero] + 47, 'text-anchor': 'middle', class: 'a-ing' }, ['← ' + ing]));
      svg.appendChild(g);
    });
    cont.innerHTML = ''; cont.appendChild(svg);
    legenda.innerHTML = '<span><i class="ln int"></i>rinvio esplicito fra commi</span>' +
      (R.rinviiAbrogati.length ? '<span><i class="ln abr"></i>rinvio a un comma abrogato (segnalazione A6)</span>' : '') +
      '<span><b>← n</b> commi che vi rinviano</span><span>cerchio: parole del comma</span>';
    attivaClic(cont, azioni);
  }

  /* ---------- Figura 3: commi e atti esterni (scheda D2) ---------- */
  function figuraAtti(cont, legenda, r, azioni) {
    var R = r.relazioni, numeri = r.commi.map(function (c) { return c.numero; });
    var destra = R.atti.map(function (a) { return { chiave: a.chiave, nome: a.etichetta, tipo: 'est', commi: a.commi, rinvii: a.rinvii }; });
    R.altriArticoli.forEach(function (x) {
      var nome = x.testo.replace(/,\s*comma.*$/i, '') + ' della stessa legge';
      var d = destra.filter(function (y) { return y.nome === nome; })[0];
      if (!d) { d = { chiave: nome, nome: nome, tipo: 'int', commi: [], rinvii: [] }; destra.push(d); }
      if (d.commi.indexOf(x.da) === -1) d.commi.push(x.da);
      d.rinvii.push({ comma: x.da, testo: x.testo, ricostruito: false });
    });
    var sinistra = [];
    destra.forEach(function (d) { d.commi.forEach(function (c) { if (sinistra.indexOf(c) === -1) sinistra.push(c); }); });
    sinistra.sort(function (a, b) { return numeri.indexOf(a) - numeri.indexOf(b); });
    var W = 640, XS = 130, XD = 400, PASSO = 52, TOP = 34;
    var H = TOP + Math.max(sinistra.length, destra.length) * PASSO + 10;
    var yS = function (i) { return TOP + i * PASSO + (Math.max(sinistra.length, destra.length) - sinistra.length) * PASSO / 2; };
    var yD = function (i) { return TOP + i * PASSO + (Math.max(sinistra.length, destra.length) - destra.length) * PASSO / 2; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Commi dell\'art. 33 e atti esterni che citano' });
    svg.appendChild(el('text', { x: XS, y: 14, 'text-anchor': 'end', class: 'a-sub' }, ['commi dell\'art. 33']));
    svg.appendChild(el('text', { x: XD, y: 14, class: 'a-sub' }, ['atti citati']));
    destra.forEach(function (d, j) {
      d.commi.forEach(function (c) {
        var i = sinistra.indexOf(c), y1 = yS(i), y2 = yD(j);
        var n = d.rinvii.filter(function (x) { return x.comma === c; });
        var ric = n.filter(function (x) { return x.ricostruito; }).length;
        svg.appendChild(el('path', {
          d: 'M' + (XS + 8) + ' ' + y1 + ' C' + (XS + 140) + ' ' + y1 + ' ' + (XD - 140) + ' ' + y2 + ' ' + (XD - 8) + ' ' + y2,
          class: 'b-linea ' + d.tipo, 'stroke-width': 1.5 + n.length * 1.6
        }, [el('title', {}, ['comma ' + c + ' → ' + d.nome + ': ' + n.length + (n.length === 1 ? ' rinvio' : ' rinvii') + (ric ? ' (di cui ' + ric + ' "medesima legge", attribuiti all\'atto citato prima)' : '') + '\n' + n.map(function (x) { return '«' + x.testo + '»'; }).join('\n')])]));
      });
    });
    sinistra.forEach(function (c, i) {
      var k = numeri.indexOf(c);
      svg.appendChild(el('g', { class: 'a-nodo', tabindex: '0', 'data-vai': 'cm-' + k }, [
        el('rect', { x: XS - 96, y: yS(i) - 15, width: 104, height: 30, class: 'g-bersaglio' }),
        el('circle', { cx: XS, cy: yS(i), r: 6, class: 'b-nodo' }),
        el('text', { x: XS - 14, y: yS(i) + 4, 'text-anchor': 'end', class: 'a-num' }, ['comma ' + c]),
        el('title', {}, ['vai al comma ' + c])
      ]));
    });
    destra.forEach(function (d, j) {
      svg.appendChild(el('circle', { cx: XD, cy: yD(j), r: 7, class: 'b-atto ' + d.tipo }));
      svg.appendChild(el('text', { x: XD + 16, y: yD(j) + 1, class: 'a-num' }, [d.nome]));
      var ricD = d.rinvii.filter(function (x) { return x.ricostruito; }).length;
      svg.appendChild(el('text', { x: XD + 16, y: yD(j) + 16, class: 'a-sub' }, [d.rinvii.length + (d.rinvii.length === 1 ? ' rinvio' : ' rinvii') + (ricD ? ' (' + ricD + '*)' : '') + ' · comm' + (d.commi.length === 1 ? 'a ' : 'i ') + d.commi.join(', ')]));
    });
    cont.innerHTML = ''; cont.appendChild(svg);
    legenda.innerHTML = '<span><i class="ln est"></i>rinvio a un altro atto</span><span><i class="ln int"></i>rinvio a un altro articolo della l. 104/1992</span>' +
      '<span><b>*</b> rinvii "della medesima legge", attribuiti all\'atto citato subito prima</span>';
    attivaClic(cont, azioni);
  }


  /* ---------- Figura 4: terminologia per comma (schede T1, R1 4a) ---------- */
  function figuraTermini(cont, legenda, r, azioni) {
    var T = r.terminologia, forme = T.forme;
    var vigenti = r.commi.map(function (c, k) { return { c: c, k: k }; }).filter(function (x) { return !x.c.abrogato; });
    var W = 760, XL = 70, XM = 150, COL = (W - XM - 20) / Math.max(1, forme.length), RIGA = 30, TOP = 64;
    var H = TOP + vigenti.length * RIGA + 10;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Designazioni della persona assistita, comma per comma' });
    svg.appendChild(el('text', { x: XL, y: 22, 'text-anchor': 'end', class: 'a-sub' }, ['comma']));
    svg.appendChild(el('text', { x: XM - 40, y: 22, 'text-anchor': 'middle', class: 'a-sub' }, ['modificato']));
    svg.appendChild(el('text', { x: XM - 40, y: 36, 'text-anchor': 'middle', class: 'a-sub' }, ['(( ))']));
    forme.forEach(function (f, j) {
      var x = XM + COL * j + COL / 2;
      var parole = f.forma.split(' '), meta = Math.ceil(parole.length / 2);
      svg.appendChild(el('text', { x: x, y: 22, 'text-anchor': 'middle', class: 't-forma ' + f.lessico }, ['"' + parole.slice(0, meta).join(' ')]));
      svg.appendChild(el('text', { x: x, y: 38, 'text-anchor': 'middle', class: 't-forma ' + f.lessico }, [parole.slice(meta).join(' ') + '"']));
    });
    vigenti.forEach(function (x, i) {
      var y = TOP + i * RIGA + RIGA / 2;
      svg.appendChild(el('line', { x1: XL - 30, y1: y + RIGA / 2, x2: W - 10, y2: y + RIGA / 2, class: 't-riga' }));
      var g = el('g', { class: 'a-nodo', tabindex: '0', 'data-vai': 'cm-' + x.k }, [
        el('rect', { x: 0, y: y - RIGA / 2, width: XL + 8, height: RIGA, class: 'g-bersaglio' }),
        el('text', { x: XL, y: y + 4, 'text-anchor': 'end', class: 'a-num' }, [x.c.numero]),
        el('title', {}, ['vai al comma ' + x.c.numero])
      ]);
      svg.appendChild(g);
      if (x.c.modificato) svg.appendChild(el('rect', { x: XM - 52, y: y - 7, width: 24, height: 14, rx: 3, class: 't-mod' }, [el('title', {}, ['comma ' + x.c.numero + ' racchiuso tra (( )) da Normattiva'])]));
      forme.forEach(function (f, j) {
        var n = T.occorrenze.filter(function (o) { return o.k === x.k && o.forma === f.forma; }).length;
        if (!n) return;
        var cx = XM + COL * j + COL / 2;
        svg.appendChild(el('circle', { cx: cx, cy: y, r: 5 + n * 1.6, class: 't-punto ' + f.lessico }, [el('title', {}, ['comma ' + x.c.numero + ': ' + n + (n === 1 ? ' volta' : ' volte') + ' "' + f.forma + '"'])]));
        if (n > 1) svg.appendChild(el('text', { x: cx + 9 + n * 1.6, y: y + 4, class: 'a-sub' }, ['× ' + n]));
      });
    });
    cont.innerHTML = ''; cont.appendChild(svg);
    legenda.innerHTML = '<span><i class="sw t-dis"></i>lessico "disabilità"</span><span><i class="sw t-han"></i>lessico "handicap"</span>' +
      '<span><i class="sw t-mod"></i>comma racchiuso tra (( )) da Normattiva, cioè modificato nel tempo</span>';
    attivaClic(cont, azioni);
  }

  function attivaClic(cont, azioni) {
    cont.onclick = function (e) { var p = e.target.closest('[data-vai]'); if (p) azioni.vai(p.getAttribute('data-vai')); };
    cont.onkeydown = function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var p = e.target.closest('[data-vai]'); if (p) { e.preventDefault(); azioni.vai(p.getAttribute('data-vai')); }
    };
  }

  function rendi(contenitore, r, azioni, altri) {
    contenitore.innerHTML = '';
    contenitore.appendChild(pannelloGulpease(r, altri));
    contenitore.appendChild(pannelloFrasi(r, altri));
    contenitore.onclick = function (e) {
      var p = e.target.closest('[data-vai]');
      if (p && p.getAttribute('data-vai')) { azioni.vai(p.getAttribute('data-vai')); return; }
      var s = e.target.closest('[data-lente]');
      if (s) azioni.lente(s.getAttribute('data-lente'));
    };
    contenitore.onkeydown = function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var p = e.target.closest('[data-vai]');
      if (p && p.getAttribute('data-vai')) { e.preventDefault(); azioni.vai(p.getAttribute('data-vai')); }
    };
  }

  root.GraficiA = { rendi: rendi, figuraCommi: figuraCommi, figuraAtti: figuraAtti, figuraTermini: figuraTermini };
})(this);
