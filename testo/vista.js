/* Laboratorio A - vista. Usa window.AnalisiA; non contiene algoritmi di analisi. */
(function () {
  'use strict';
  var A = window.AnalisiA;
  var $ = function (id) { return document.getElementById(id); };
  var ultimo = null, lente = 'frasi';
  var CHIAVE = 'osservabili-labA-bozza';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function num(x, d) {
    if (x === null || x === undefined) return '–';
    return Number(x).toLocaleString('it-IT', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function nomeComma(c) { return c.numero ? 'comma ' + c.numero : 'comma non numerato ' + (c.indice + 1); }

  /* ----- bozza locale (solo comodita' per chi usa la pagina) ----- */
  var CAMPI = ['f-atto', 'f-versione', 'f-vigenza', 'f-consultazione', 'f-url', 'f-testo'];
  function salvaBozza() {
    try {
      var o = {}; CAMPI.forEach(function (id) { o[id] = $(id).value; });
      localStorage.setItem(CHIAVE, JSON.stringify(o));
      $('s-bozza').textContent = 'Bozza salvata in questo browser.';
    } catch (e) { /* storage non disponibile: nessun problema */ }
  }
  function caricaBozza() {
    try {
      var o = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
      if (o) CAMPI.forEach(function (id) { if (o[id] !== undefined) $(id).value = o[id]; });
    } catch (e) { /* ignora */ }
  }

  /* ----- resa del testo con evidenze ----- */
  function evidenzia(testo, segmenti) {
    // segmenti: [{a, b, html: fn(contenutoEscapato)}], non sovrapposti
    segmenti = segmenti.slice().sort(function (x, y) { return x.a - y.a; });
    var out = '', pos = 0;
    segmenti.forEach(function (s) {
      if (s.a < pos) return;
      out += esc(testo.slice(pos, s.a)) + s.html(esc(testo.slice(s.a, s.b)));
      pos = s.b;
    });
    return out + esc(testo.slice(pos));
  }

  function rendiNorma(r) {
    var h = '<div class="intest">Art. ' + esc(r.articolo || '?') +
      (r.rubrica ? ' <span style="font-weight:400">(' + esc(r.rubrica) + ')</span>' : '') + '</div>';
    r.commi.forEach(function (c, k) {
      var segmenti = [];
      if (lente === 'frasi' && !c.abrogato) {
        segmenti = c.frasi.map(function (f, j) {
          return { a: f.a, b: f.b, html: function (t) {
            return '<span class="fr ' + (j % 2 ? 'b' : 'a') + '" id="fr-' + k + '-' + j + '" data-vai="fr-' + k + '-' + j + '">' + t +
              '<sup title="parole nella frase">' + f.parole + '</sup></span>';
          } };
        });
      }
      if (lente === 'rinvii') {
        segmenti = c.rinvii.map(function (x, j) {
          return { a: x.a, b: x.b, html: function (t) { return '<span class="rv ' + x.tipo + '" id="rv-' + k + '-' + j + '">' + t + '</span>'; } };
        }).concat(c.relativi.map(function (x, j) {
          return { a: x.a, b: x.b, html: function (t) { return '<span class="rv relativo" id="rl-' + k + '-' + j + '">' + t + '</span>'; } };
        }));
      }
      var barra = '';
      if (lente === 'leggibilita') {
        var g = c.gulpease;
        var pos = g === null ? null : Math.max(0, Math.min(100, g));
        barra = '<div class="gbar">' + (g === null ? '<span>non calcolato (comma abrogato)</span>' :
          '<span>G ' + num(g, 1) + '</span><div class="asse" aria-hidden="true"><div class="val" style="left:calc(' + pos + '% - 1px)"></div></div>' +
          '<span>' + c.frasi.length + ' fr. · ' + c.parole + ' par.</span>' +
          (g < 0 || g > 100 ? '<span>(fuori scala 0-100)</span>' : '')) + '</div>';
      }
      h += '<div class="comma' + (c.abrogato ? ' abrogato' : '') + '" id="cm-' + k + '">' +
        '<span class="num">' + esc(c.numero ? c.numero + '.' : '·') + '</span>' +
        '<div class="corpo">' + evidenzia(c.testo, segmenti) + '</div>' + barra + '</div>';
    });
    if (lente === 'leggibilita') {
      h += '<div class="comma"><span></span><div class="gbar"><span style="visibility:hidden">G 00,0</span><div class="tacche"><span>0</span><span>50</span><span>100</span></div><span style="visibility:hidden">0 fr. · 00 par.</span></div></div>';
    }
    $('norma').innerHTML = h;

    var leg = {
      frasi: '<span>Frasi alterne a sfondo diverso; il numero in apice conta le parole.</span>',
      rinvii: '<span class="l-est">rinvio esterno</span><span class="l-ana">esterno anaforico</span><span class="l-int">interno (presente legge/articolo)</span><span class="l-pres">interno presunto</span><span class="l-rel">"precedente/successivo"</span>',
      leggibilita: '<span>Valore Gulpease di ogni comma su un asse 0-100. Da leggere come confronto tra commi.</span>'
    };
    $('legenda').innerHTML = leg[lente];
  }

  /* ----- tabelle ----- */
  function rendiTabella(r) {
    var h = '';
    if (lente === 'frasi') {
      $('t-tab').textContent = 'Frasi';
      h = '<table><thead><tr><th class="n">#</th><th>Comma</th><th class="n">Parole</th><th>Inizio della frase</th></tr></thead><tbody>';
      var n = 0;
      r.commi.forEach(function (c, k) {
        if (c.abrogato) return;
        c.frasi.forEach(function (f, j) {
          n++;
          h += '<tr data-vai="fr-' + k + '-' + j + '"><td class="n">' + n + '</td><td>' + esc(nomeComma(c)) + '</td><td class="n">' + f.parole +
            '</td><td>' + esc(f.testo.slice(0, 90)) + (f.testo.length > 90 ? '…' : '') + '</td></tr>';
        });
      });
      h += '</tbody></table>';
    } else if (lente === 'rinvii') {
      $('t-tab').textContent = 'Rinvii e riferimenti relativi';
      var etich = { esterno: 'esterno', 'esterno-anaforico': 'esterno ("medesima", "citata")', interno: 'interno', 'interno-presunto': 'interno presunto' };
      h = '<table><thead><tr><th>Comma</th><th>Testo riconosciuto</th><th>Tipo</th></tr></thead><tbody>';
      var vuota = true;
      r.commi.forEach(function (c, k) {
        c.rinvii.forEach(function (x, j) {
          vuota = false;
          h += '<tr data-vai="rv-' + k + '-' + j + '"><td>' + esc(nomeComma(c)) + '</td><td>' + esc(x.testo) + '</td><td>' + etich[x.tipo] + '</td></tr>';
        });
        c.relativi.forEach(function (x, j) {
          vuota = false;
          h += '<tr data-vai="rl-' + k + '-' + j + '"><td>' + esc(nomeComma(c)) + '</td><td>' + esc(x.testo) + '</td><td>riferimento relativo (A5)</td></tr>';
        });
      });
      if (vuota) h += '<tr><td colspan="3">Nessun rinvio riconosciuto. Controlla comunque il testo a mano.</td></tr>';
      h += '</tbody></table>';
    } else {
      $('t-tab').textContent = 'Commi';
      h = '<table><thead><tr><th>Comma</th><th class="n">Frasi</th><th class="n">Parole</th><th class="n">Lettere alfab.</th><th class="n">Gulpease</th></tr></thead><tbody>';
      r.commi.forEach(function (c, k) {
        h += '<tr data-vai="cm-' + k + '"><td>' + esc(nomeComma(c)) + (c.abrogato ? ' (abrogato)' : '') + '</td><td class="n">' + c.frasi.length +
          '</td><td class="n">' + c.parole + '</td><td class="n">' + c.caratteri + '</td><td class="n">' + num(c.gulpease, 1) + '</td></tr>';
      });
      h += '</tbody></table>';
    }
    $('tabella').innerHTML = h;
  }

  function rendiSintesi(r) {
    var t = r.totali;
    var d = [
      ['Articolo', r.articolo || 'non riconosciuto'],
      ['Rubrica', r.rubrica || 'assente'],
      ['Commi', t.commi + (t.commiAbrogati ? ' (di cui abrogati ' + t.commiAbrogati + ')' : '')],
      ['Lettere a), b)…', t.lettere],
      ['Frasi', t.frasi],
      ['Parole', num(t.parole)],
      ['Parole per frase (media)', num(t.parolePerFrase, 1)],
      ['Frase più lunga (parole)', num(t.frasePiuLunga)],
      ['Gulpease dell\'articolo', num(t.gulpease, 1)],
      ['Segmenti modificati (( ))', r.modificati],
      ['Richiami di nota tolti', r.note]
    ];
    $('m-descr').innerHTML = d.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd' + (typeof x[1] === 'string' && /[a-z]/i.test(x[1]) ? ' class="t"' : '') + '>' + esc(x[1]) + '</dd>'; }).join('');
    var tipi = { esterno: 0, 'esterno-anaforico': 0, interno: 0, 'interno-presunto': 0 };
    r.commi.forEach(function (c) { c.rinvii.forEach(function (x) { tipi[x.tipo]++; }); });
    var s = [
      ['Rinvii esterni', tipi.esterno],
      ['Rinvii esterni anaforici ("medesima legge")', tipi['esterno-anaforico']],
      ['Rinvii interni (presente legge, articolo, comma)', tipi.interno],
      ['Rinvii interni presunti', tipi['interno-presunto']],
      ['"Precedente / successivo"', t.relativi]
    ];
    $('m-segn').innerHTML = s.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('');
  }

  function rendiFonte() {
    var v = $('f-versione').value;
    var parti = [$('f-atto').value || 'Atto non indicato',
      v ? (v === 'vigente' ? 'testo vigente' : 'testo originario') : 'versione non indicata',
      $('f-vigenza').value ? 'vigente al ' + $('f-vigenza').value : 'data di vigenza non indicata',
      $('f-consultazione').value ? 'consultato il ' + $('f-consultazione').value : 'data di consultazione non indicata'];
    $('r-fonte').textContent = 'Fonte: ' + parti.join(' · ') + '.';
  }

  /* ----- reperti: frasi costruite dai dati, ciascuna con la sua scheda ----- */
  function fasciaG(g) { return g < 40 ? 'sotto 40' : g < 60 ? '40–60' : g < 80 ? '60–80' : 'oltre 80'; }
  function lista(xs) { return xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1]; }
  function rendiReperti(r) {
    var t = r.totali, R = r.relazioni, out = [];
    var vigenti = r.commi.filter(function (c) { return !c.abrogato; });
    var bassi = vigenti.filter(function (c) { return c.gulpease < 40; }).map(function (c) { return c.numero; });
    out.push({ n: num(t.gulpease, 1), cosa: 'Gulpease', tipo: 'misura · A3', fig: 'fig-1',
      testo: 'La leggibilità dell\'articolo cade nella fascia ' + fasciaG(t.gulpease) + ' (fasce da verificare sull\'originale).' +
        (bassi.length ? ' ' + (bassi.length === 1 ? 'Il comma ' : 'I commi ') + lista(bassi) + (bassi.length === 1 ? ' scende' : ' scendono') + ' sotto 40.' : '') });
    var lungo = null;
    vigenti.forEach(function (c) { c.frasi.forEach(function (f) { if (!lungo || f.parole > lungo.f.parole) lungo = { f: f, c: c }; }); });
    out.push({ n: num(t.parolePerFrase, 1), cosa: 'parole per periodo, in media', tipo: 'misura · A2', fig: 'fig-1',
      testo: 'Un periodo dell\'articolo ha in media ' + num(t.parolePerFrase, 1) + ' parole.' +
        (lungo ? ' Il più lungo, nel comma ' + lungo.c.numero + ', ne ha ' + lungo.f.parole + '.' : '') +
        (altriCorrenti().length ? ' ' + altriCorrenti().map(function (a) { return 'Nell\'' + a.nome + ' la media è ' + num(a.parolePerFrase, 1); }).join('; ') + '.' : '') });
    var hub = null;
    Object.keys(R.ingresso).forEach(function (k) { if (!hub || R.ingresso[k] > R.ingresso[hub]) hub = k; });
    if (hub) {
      var ch = r.commi.filter(function (c) { return c.numero === hub; })[0];
      var piuLungo = vigenti.every(function (c) { return c.parole <= ch.parole; });
      var pct = Math.round(ch.parole / t.parole * 100);
      out.push({ n: String(R.ingresso[hub]), cosa: 'commi rinviano al comma ' + hub, tipo: 'misura · D1', fig: 'fig-2',
        testo: 'Il comma ' + hub + ' regge l\'articolo: vi rinviano ' + R.ingresso[hub] + ' commi su ' + vigenti.length + ' in vigore.' +
          (piuLungo ? ' È anche il più lungo: ' + ch.parole + ' parole, il ' + pct + '% del testo.' : '') });
      $('t-fig2').textContent = 'Il comma ' + hub + ' regge l\'articolo';
    }
    if (R.atti.length) {
      var dalHub = R.atti.filter(function (a) { return a.commi.indexOf(hub) !== -1; })[0];
      out.push({ n: String(R.atti.length), cosa: R.atti.length === 1 ? 'altro atto da consultare' : 'altri atti da consultare', tipo: 'misura · D2', fig: 'fig-3',
        testo: 'Per leggere l\'articolo per intero servono ' + (R.atti.length === 1 ? 'un altro atto: ' : 'altri ' + R.atti.length + ' atti: ') + lista(R.atti.map(function (a) { return a.etichetta; })) + '.' +
          (dalHub ? ' Il comma ' + hub + ' rinvia ' + dalHub.rinvii.filter(function (x) { return x.comma === hub; }).length + ' volte ' + (/^l\./.test(dalHub.etichetta) ? 'alla ' : 'al ') + dalHub.etichetta + (r.articolo === '33' ? ' per definire chi può chiedere i permessi.' : '.') : '') });
      $('t-fig3').textContent = 'Per leggere l\'articolo per intero servono altri ' + R.atti.length + ' atti';
    }
    R.rinviiAbrogati.forEach(function (e) {
      out.push({ n: '!', cosa: 'segnalazione', tipo: 'segnalazione · A6', fig: 'fig-2', segn: true,
        testo: 'Il comma ' + e.da + ' rinvia ancora al comma ' + e.a + ', che risulta ' + (e.esiste ? 'abrogato' : 'assente') + ' («' + e.testo + '»). Da rileggere: può essere un difetto di coordinamento o avere una ragione redazionale.' });
    });
    var T = r.terminologia;
    if (T.forme.length > 1) {
      var perLessico = {};
      T.occorrenze.forEach(function (o) {
        var L = perLessico[o.lessico] = perLessico[o.lessico] || { commi: [], mod: 0, tot: 0 };
        if (L.commi.indexOf(o.comma) === -1) { L.commi.push(o.comma); L.tot++; if (r.commi[o.k].modificato) L.mod++; }
      });
      var frase = '';
      var D = perLessico['disabilità'], H = perLessico['handicap'];
      if (D && H && D.mod === D.tot && H.mod === 0)
        frase = ' "Disabilità" compare solo nei commi che Normattiva segna come modificati (' + lista(D.commi) + '); "handicap" solo in commi non segnati (' + lista(H.commi) + '). Il testo vigente conserva due strati di lessico.';
      out.push({ n: String(T.forme.length), cosa: 'modi di designare la persona assistita', tipo: 'segnalazione · T1', fig: 'fig-4', segn: true,
        testo: 'La stessa condizione è designata in ' + T.forme.length + ' modi: ' + lista(T.forme.map(function (f) { return '"' + f.forma + '"'; })) + '. Le regole di tecnica legislativa chiedono denominazioni identiche per lo stesso concetto (2001, par. 4, lett. a).' + frase });
    }
    var reg = r.regolarita, scost = reg.filter(function (e) { return e.esito === 'scostamento'; });
    out.push({ n: (reg.length - scost.length) + '/' + reg.length, cosa: 'regole di tecnica legislativa rispettate', tipo: 'controllo · R1', fig: 'controlli',
      testo: 'Su ' + reg.length + ' controlli automatici tratti dalle Regole e raccomandazioni del 2001, ' + (reg.length - scost.length) + ' sono rispettati.' +
        (scost.length ? ' Scostamenti: ' + lista(scost.map(function (e) { return e.titolo.toLowerCase() + ' (par. ' + e.regola.replace(/(\d+)([a-z])/, '$1, lett. $2') + ')'; })) + '.' : '') });
    var c33 = r.articolo === '33';
    $('fig-5').hidden = !c33;
    if (c33) out.push({ n: '4', cosa: 'passaggi per sapere se si ha diritto', tipo: 'ricostruzione manuale · R', fig: 'fig-5',
      testo: 'Per sapere se ha diritto ai tre giorni di permesso, una persona deve verificare quattro passaggi e cercare due definizioni in un\'altra legge.' });
    $('reperti').innerHTML = out.map(function (x) {
      return '<li class="' + (x.segn ? 'segn' : '') + '"><div class="r-num"><strong>' + esc(x.n) + '</strong><span>' + esc(x.cosa) + '</span></div>' +
        '<div class="r-testo"><p>' + esc(x.testo) + '</p><span class="r-meta"><span class="tipo ' + (x.segn ? 'segn' : 'descr') + '">' + esc(x.tipo) + '</span> <a href="#' + x.fig + '">vedi figura</a></span></div></li>';
    }).join('');
  }

  /* ----- controlli di tecnica legislativa (R1) ----- */
  function rendiControlli(r) {
    $('controlli-lista').innerHTML = r.regolarita.map(function (e) {
      var dove = e.dove.length ? '<span class="c-dove">' + e.dove.map(function (d) { return '<a href="#cm-' + d.k + '" data-vai="cm-' + d.k + '">c. ' + esc(d.comma) + '</a>'; })
        .filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' ') + '</span>' : '';
      return '<li class="' + e.esito.replace(' ', '-') + '"><span class="c-esito">' + (e.esito === 'rispettata' ? '✓ rispettata' : e.esito === 'scostamento' ? '! scostamento' : '? da verificare') + '</span>' +
        '<span class="c-regola">par. ' + esc(e.regola.replace(/(\d+)([a-z])/, '$1, lett. $2')) + '</span><strong>' + esc(e.titolo) + '</strong><span class="c-det">' + esc(e.dettaglio) + ' ' + dove + '</span></li>';
    }).join('');
  }

  /* ----- archivio degli articoli salvati, per il confronto ----- */
  var ELENCO = [
    { art: '33', nome: 'art. 33', file: 'dati/l104-art33-vigente.txt', ruolo: 'Permessi lavorativi: l\'articolo di partenza.' },
    { art: '3', nome: 'art. 3', file: 'dati/l104-art3-vigente.txt', ruolo: 'Soggetti aventi diritto: definisce la "situazione di gravità", la formula che ricorre 8 volte nell\'art. 33.' },
    { art: '4', nome: 'art. 4', file: 'dati/l104-art4-vigente.txt', ruolo: 'Accertamento dell\'handicap: richiamato dall\'art. 33, comma 2.' }
  ];
  var archivio = {};
  function caricaArchivio(fatto) {
    var attesi = ELENCO.length;
    ELENCO.forEach(function (x) {
      var ok = function (t) { try { archivio[x.art] = A.analizza(t); } catch (e) { archivio[x.art] = null; } if (--attesi === 0) fatto(); };
      var no = function () { archivio[x.art] = null; if (--attesi === 0) fatto(); };
      var pre = window.TESTI_PRECARICATI && window.TESTI_PRECARICATI[x.art];
      if (pre) { ok(pre); return; }
      // nell'anteprima in un solo file i testi sono incorporati: niente richieste
      if (window.TESTI_PRECARICATI || !window.fetch) { no(); return; }
      fetch(x.file).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(ok, no);
    });
  }
  function altriCorrenti() {
    if (!ultimo) return [];
    return ELENCO.filter(function (x) { return archivio[x.art] && x.art !== ultimo.articolo; })
      .map(function (x) { var r = archivio[x.art]; return { nome: x.nome, gulpease: r.totali.gulpease, parolePerFrase: r.totali.parolePerFrase }; });
  }
  function rendiConfronto() {
    var righe = ELENCO.map(function (x) {
      var r = archivio[x.art];
      if (!r) return '<tr class="mancante"><th>' + esc(x.nome) + '</th><td colspan="8">' + esc(x.ruolo) + ' <span class="verifica">Testo da copiare da Normattiva in ' + esc(x.file) + '.</span></td></tr>';
      var t = r.totali;
      return '<tr' + (ultimo && r.articolo === ultimo.articolo ? ' class="corrente"' : '') + '><th>' + esc(x.nome) + '<small>' + esc(r.rubrica || '') + '</small></th>' +
        '<td class="n">' + (t.commi - t.commiAbrogati) + '</td><td class="n">' + t.parole + '</td><td class="n">' + t.frasi + '</td>' +
        '<td class="n">' + num(t.parolePerFrase, 1) + '</td><td class="n">' + t.frasePiuLunga + '</td><td class="n">' + num(t.gulpease, 1) + '</td>' +
        '<td class="n">' + r.relazioni.atti.length + '</td><td class="n">' + r.terminologia.forme.length + '</td></tr>';
    });
    $('confronto').innerHTML = '<table><thead><tr><th>Articolo</th><th class="n">Commi in vigore</th><th class="n">Parole</th><th class="n">Periodi</th>' +
      '<th class="n">Parole per periodo</th><th class="n">Periodo più lungo</th><th class="n">Gulpease</th><th class="n">Atti esterni</th><th class="n">Designazioni</th></tr></thead><tbody>' +
      righe.join('') + '</tbody></table>';
  }

  function rendi() {
    if (!ultimo) return;
    rendiFonte(); rendiSintesi(ultimo); rendiNorma(ultimo); rendiTabella(ultimo);
    if (window.GraficiA) window.GraficiA.rendi($('grafici'), ultimo, {
      vai: vai,
      lente: function (l) { lente = l; rendi(); $('norma').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }, altriCorrenti());
    if (window.GraficiA) {
      window.GraficiA.figuraCommi($('fig-commi'), $('leg-commi'), ultimo, { vai: vai });
      window.GraficiA.figuraAtti($('fig-atti'), $('leg-atti'), ultimo, { vai: vai });
      window.GraficiA.figuraTermini($('fig-termini'), $('leg-termini'), ultimo, { vai: vai });
    }
    rendiControlli(ultimo);
    rendiReperti(ultimo);
    rendiConfronto();
    document.querySelectorAll('[data-lente]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lente === lente)); });
  }

  function analizza() {
    var testo = $('f-testo').value;
    var av = [];
    if (!testo.trim()) { av.push('Incolla il testo dell\'articolo prima di analizzarlo.'); }
    if (!$('f-versione').value) av.push('Indica la versione del testo (vigente o originaria).');
    if (!$('f-consultazione').value) av.push('Indica la data di consultazione di Normattiva.');
    if (testo.trim()) {
      ultimo = A.analizza(testo);
      av = av.concat(ultimo.avvisi);
      $('risultati').hidden = false;
      $('vuoto').hidden = true;
      rendi();
    }
    $('avvisi').innerHTML = av.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('avvisi').hidden = !av.length;
    salvaBozza();
  }

  function csv() {
    if (!ultimo) return '';
    var righe = [['fonte', $('f-atto').value, $('f-versione').value, $('f-vigenza').value, $('f-consultazione').value, $('f-url').value]];
    righe.push(['tipo', 'comma', 'n', 'parole', 'lettere_alfab', 'frasi', 'gulpease', 'testo']);
    ultimo.commi.forEach(function (c) {
      righe.push(['comma', c.numero || '', '', c.parole, c.caratteri, c.frasi.length, c.gulpease === null ? '' : c.gulpease.toFixed(2), c.abrogato ? 'abrogato' : '']);
      c.frasi.forEach(function (f, j) { righe.push(['frase', c.numero || '', j + 1, f.parole, f.caratteri, '', '', f.testo]); });
      c.rinvii.forEach(function (x, j) { righe.push(['rinvio-' + x.tipo, c.numero || '', j + 1, '', '', '', '', x.testo]); });
      c.relativi.forEach(function (x, j) { righe.push(['riferimento-relativo', c.numero || '', j + 1, '', '', '', '', x.testo]); });
    });
    return righe.map(function (r) {
      return r.map(function (v) { v = String(v).replace(/\s+/g, ' '); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(';');
    }).join('\n');
  }

  function vai(id) {
    var el = document.getElementById(id);
    if (!el) return;
    document.querySelectorAll('.attiva').forEach(function (x) { x.classList.remove('attiva'); });
    el.classList.add('attiva');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ----- testo salvato in dati/ (art. 33, versione vigente) ----- */
  function caricaSalvato() {
    var fatto = function (t) {
      $('f-testo').value = t;
      if (!$('f-versione').value) $('f-versione').value = 'vigente';
      analizza();
    };
    var pre = window.TESTI_PRECARICATI && window.TESTI_PRECARICATI['33'];
    if (pre) { fatto(pre); return; }
    fetch('dati/l104-art33-vigente.txt').then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(fatto, function () { $('s-bozza').textContent = 'Il file dati/l104-art33-vigente.txt non è raggiungibile da qui.'; });
  }

  /* ----- eventi ----- */
  caricaBozza();
  $('b-carica').addEventListener('click', caricaSalvato);
  $('b-analizza').addEventListener('click', analizza);
  $('b-svuota').addEventListener('click', function () {
    $('f-testo').value = ''; ultimo = null;
    $('risultati').hidden = true; $('vuoto').hidden = false; $('avvisi').hidden = true;
    salvaBozza();
  });
  CAMPI.forEach(function (id) { $(id).addEventListener('change', function () { salvaBozza(); if (ultimo) rendiFonte(); }); });
  document.querySelectorAll('[data-lente]').forEach(function (b) {
    b.addEventListener('click', function () { lente = b.dataset.lente; rendi(); });
  });
  $('controlli-lista').addEventListener('click', function (e) {
    var a = e.target.closest('[data-vai]'); if (a) { e.preventDefault(); vai(a.getAttribute('data-vai')); }
  });
  $('tabella').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-vai]'); if (tr) vai(tr.dataset.vai);
  });
  $('b-copia').addEventListener('click', function () {
    var testo = csv(), b = this;
    var fatto = function () { b.textContent = 'Copiato'; setTimeout(function () { b.textContent = 'Copia i risultati (CSV)'; }, 1800); };
    try {
      navigator.clipboard.writeText(testo).then(fatto, function () { mostraCsv(testo); });
    } catch (e) { mostraCsv(testo); }
  });
  function mostraCsv(t) {
    $('tabella').innerHTML = '<label for="csv-out">Seleziona e copia</label><textarea id="csv-out" style="min-height:160px;font-family:var(--mono);font-size:.8rem">' + esc(t) + '</textarea>';
    $('csv-out').select();
  }
  caricaArchivio(function () { if ($('f-testo').value.trim()) analizza(); else caricaSalvato(); });
})();
