/*
 * Laboratorio A - analisi del testo di una disposizione (Legge 104/1992).
 * Solo algoritmi: nessun accesso al DOM. Funziona nel browser (window.AnalisiA)
 * e in Node (module.exports) per i test.
 *
 * Ogni misura e' documentata in SCHEDE-A.md. Le scelte che adattano le fonti
 * sono marcate con "ADATTAMENTO" nei commenti.
 */
(function (root) {
  'use strict';

  var LAT = 'bis|ter|quater|quinquies|sexies|septies|octies|novies|decies|undecies|duodecies|terdecies';
  var NUM = '\\d+(?:-?(?:' + LAT + '))?';
  var LET = '[a-z](?:-(?:' + LAT + '))?\\)';
  var ORD = 'primo|secondo|terzo|quarto|quinto|sesto|settimo|ottavo|nono|decimo';
  var ITEM = '(?:' + NUM + '|' + LET + '|' + ORD + ')';

  // ADATTAMENTO (scheda A2): abbreviazioni dopo le quali il punto non chiude la frase.
  var ABBREVIAZIONI = ['n', 'nn', 'art', 'artt', 'lett', 'c', 'cc', 'co', 'cfr', 'ecc',
    'pag', 'pagg', 'pp', 'p', 'sig', 'dott', 'prof', 'lgs', 'd.lgs', 'd.l', 'd.p.r',
    'd.m', 'r.d', 'l', 's.m.i', 'g.u', 'suppl', 'ord', 'dpr', 'dlgs', 'cost'];

  /* ---------- 0. Pulizia dei segni redazionali di Normattiva ---------- */
  // Normattiva racchiude tra (( )) il testo modificato. I segni non fanno parte
  // del testo normativo: si tolgono, ma si conservano gli intervalli modificati.
  function pulisci(grezzo) {
    var testo = '', modificati = [], prof = 0, inizio = -1, i = 0;
    grezzo = grezzo.replace(/\r\n?/g, '\n').replace(/ /g, ' ');
    // ADATTAMENTO: i richiami di nota di Normattiva, es. "gravita'.(11)", non fanno parte
    // del testo normativo. Si tolgono per primi, per non spostare le posizioni dei commi.
    var note = 0;
    grezzo = grezzo.replace(/([.;:])\((\d+[a-z]?)\)/g, function (m, p1) { note++; return p1; });
    while (i < grezzo.length) {
      if (grezzo.substr(i, 2) === '((') {
        if (prof === 0) inizio = testo.length;
        prof++; i += 2; continue;
      }
      if (grezzo.substr(i, 2) === '))' && prof > 0) {
        prof--;
        if (prof === 0) modificati.push([inizio, testo.length]);
        i += 2; continue;
      }
      testo += grezzo[i]; i++;
    }
    return { testo: testo, modificati: modificati, note: note };
  }

  /* ---------- A1. Struttura: articolo, rubrica, commi, lettere ---------- */
  var RE_ART = /^\s*Art(?:icolo|\.)\s*(\d+(?:-?(?:bis|ter|quater|quinquies|sexies))?)\s*\.?\s*$/i;
  var RE_RUBRICA = /^\s*\((.+)\)\s*\.?\s*$/;
  var RE_COMMA = new RegExp('^\\s*(' + NUM + ')\\.\\s+');
  var RE_LETTERA = new RegExp('^\\s*(' + LET + ')\\s');
  var RE_STOP = /^\s*(AGGIORNAMENTO|-{3,}|Art(?:icolo|\.)\s*\d)/i;
  var RE_ABROGATO = /^\s*\(?\s*(COMMA|PERIODO|ARTICOLO)?\s*(ABROGAT[OA]|SOPPRESS[OA])/i;

  function struttura(testoPulito) {
    var righe = testoPulito.split('\n');
    var inizioRiga = [], pos = 0;
    righe.forEach(function (x) { inizioRiga.push(pos); pos += x.length + 1; });
    var art = null, rubrica = null, commi = [], corrente = null, i = 0, avvisi = [];

    // salta righe vuote iniziali
    while (i < righe.length && !righe[i].trim()) i++;
    if (i < righe.length && RE_ART.test(righe[i])) { art = righe[i].match(RE_ART)[1]; i++; }
    else avvisi.push('Intestazione "Art. N" non trovata nella prima riga.');
    while (i < righe.length && !righe[i].trim()) i++;
    if (i < righe.length && RE_RUBRICA.test(righe[i])) { rubrica = righe[i].match(RE_RUBRICA)[1].trim(); i++; }
    else if (art && i < righe.length && !RE_COMMA.test(righe[i]) && righe[i].trim().length <= 120) {
      // ADATTAMENTO: Normattiva a volte riporta la rubrica senza parentesi
      rubrica = righe[i].trim().replace(/\.$/, ''); i++;
    } else avvisi.push('Rubrica non trovata dopo l\'intestazione.');

    var numerati = true;
    for (; i < righe.length; i++) {
      var r = righe[i];
      if (i > 0 && RE_STOP.test(r) && corrente) { avvisi.push('Testo successivo a "' + r.trim().slice(0, 30) + '" escluso dall\'analisi.'); break; }
      if (!r.trim()) continue;
      var m = r.match(RE_COMMA);
      if (m) {
        corrente = { numero: m[1], righe: [r.slice(m[0].length).trim()], inizio: inizioRiga[i] };
        commi.push(corrente);
      } else if (corrente) {
        corrente.righe.push(r.trim());
      } else {
        // testo prima di qualunque numero: comma non numerato
        corrente = { numero: null, righe: [r.trim()], inizio: inizioRiga[i] };
        commi.push(corrente);
        numerati = false;
      }
    }
    if (!numerati) avvisi.push('Sono presenti commi senza numerazione: il conteggio va controllato a mano.');

    commi.forEach(function (c, k) {
      c.testo = c.righe.join('\n');
      c.indice = k;
      c.lettere = c.righe.filter(function (x) { return RE_LETTERA.test(x); })
        .map(function (x) { return x.match(RE_LETTERA)[1]; });
      c.abrogato = RE_ABROGATO.test(c.testo) && c.testo.length < 200;
      delete c.righe;
    });
    return { articolo: art, rubrica: rubrica, commi: commi, avvisi: avvisi };
  }

  /* ---------- A2. Frasi: segmenti chiusi da punto fermo ---------- */
  function precedenteToken(t, pos) {
    var j = pos - 1;
    while (j >= 0 && /[A-Za-zÀ-ÿ.]/.test(t[j])) j--;
    return t.slice(j + 1, pos).toLowerCase().replace(/^\.+/, '');
  }

  function frasi(t) {
    var out = [], inizio = 0, re = /\./g, m;
    while ((m = re.exec(t))) {
      var p = m.index;
      var dopo = t.slice(p + 1);
      // il punto chiude la frase solo se seguito da spazio/fine
      if (dopo.length && !/^[\s)"'»”]/.test(dopo)) continue;
      var tok = precedenteToken(t, p);
      if (ABBREVIAZIONI.indexOf(tok) !== -1) continue;
      var prossimo = dopo.replace(/^[\s)"'»”]+/, '');
      // ADATTAMENTO: se dopo il punto viene minuscola o cifra, non e' fine frase
      if (prossimo.length && /^[a-zà-ÿ0-9]/.test(prossimo)) continue;
      var fine = p + 1;
      if (t.slice(inizio, fine).trim()) out.push([inizio, fine]);
      inizio = fine;
    }
    if (t.slice(inizio).trim()) out.push([inizio, t.length]);
    // rifila gli spazi iniziali
    return out.map(function (s) {
      var a = s[0];
      while (a < s[1] && /\s/.test(t[a])) a++;
      return [a, s[1]];
    });
  }

  /* ---------- A3. Parole, lettere e indice Gulpease ---------- */
  // ADATTAMENTO: parola = sequenza di lettere o cifre; l'apostrofo separa
  // ("dell'articolo" = 2 parole); le cifre contano come caratteri della parola.
  function conta(t) {
    var parole = t.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+/g) || [];
    var lettere = parole.reduce(function (s, w) { return s + w.length; }, 0);
    return { parole: parole.length, lettere: lettere };
  }

  // G = 89 + (300 * frasi - 10 * lettere) / parole
  function gulpease(parole, lettere, nFrasi) {
    if (!parole) return null;
    return 89 + (300 * nFrasi - 10 * lettere) / parole;
  }

  /* ---------- A4. Rinvii espliciti ---------- */
  var RE_ATTO = new RegExp(
    '\\b(?:legge(?:\\s+costituzionale)?|decreto[\\s-]+legislativo|decreto-legge|' +
    'decreto\\s+del\\s+Presidente\\s+della\\s+Repubblica|decreto\\s+del\\s+Presidente\\s+del\\s+Consiglio\\s+dei\\s+ministri|' +
    'decreto\\s+ministeriale|decreto\\s+interministeriale|regio\\s+decreto(?:-legge)?|d\\.\\s?lgs\\.|d\\.l\\.|d\\.\\s?P\\.\\s?R\\.|D\\.\\s?P\\.\\s?R\\.)' +
    '\\s+(?:\\d{1,2}°?\\s+[a-zA-Z]+\\s+\\d{4},?\\s+)?n\\.\\s*\\d+(?:\\/\\d+)?(?:,?\\s+del\\s+\\d{4})?', 'gi');
  var RE_CODICE = /\b(?:codice\s+civile|codice\s+di\s+procedura\s+civile|codice\s+penale|codice\s+di\s+procedura\s+penale|Costituzione)\b/g;
  var RE_SE_STESSA = /\bpresente\s+(?:legge|articolo|comma)\b/gi;
  var RE_ANAFORA = /\b(?:medesim[oa]|citat[oa]|predett[oa])\s+(?:legge|decreto(?:\s+legislativo)?|decreto-legge)\b(?!\s+(?:legislativo\s+)?n\.)/gi;
  var RE_PARTIZIONE = new RegExp('\\b(?:articol[oi]|artt?\\.|comm[ai]|letter[ae]|numer[oi])\\s+' + ITEM +
    '(?:\\s*(?:,|e|ed|o|ovvero)\\s+' + ITEM + ')*', 'gi');
  var RE_CONNETTIVI = /\b(?:citat[oaie]|del|della|dello|dell|dei|delle|degli|di|cui|al|alla|allo|all|ai|alle|agli|e|ed|nonché|dal|dalla|dallo|dall|previst[oaie])\b/gi;

  function trova(re, t, tipo) {
    var out = [], m;
    re.lastIndex = 0;
    while ((m = re.exec(t))) out.push({ a: m.index, b: m.index + m[0].length, tipo: tipo });
    return out;
  }

  function rinvii(t) {
    var pezzi = trova(RE_PARTIZIONE, t, 'partizione')
      .concat(trova(RE_ATTO, t, 'atto'), trova(RE_CODICE, t, 'atto'), trova(RE_SE_STESSA, t, 'se'), trova(RE_ANAFORA, t, 'anafora'))
      .sort(function (x, y) { return x.a - y.a || y.b - x.b; });
    // elimina sovrapposizioni
    var puliti = [];
    pezzi.forEach(function (p) {
      var ult = puliti[puliti.length - 1];
      if (!ult || p.a >= ult.b) puliti.push(p);
    });
    // unisce in catene i pezzi separati solo da connettivi ("comma 3 dell'articolo 4 della legge ...")
    var catene = [];
    puliti.forEach(function (p) {
      var c = catene[catene.length - 1];
      if (c && !c.chiusa) {
        var gap = t.slice(c.b, p.a);
        var resto = gap.replace(RE_CONNETTIVI, '').replace(/[\s,']/g, '');
        if (gap.length <= 40 && resto === '') {
          c.b = p.b; c.parti.push(p.tipo);
          if (p.tipo !== 'partizione') c.chiusa = true;
          return;
        }
      }
      catene.push({ a: p.a, b: p.b, parti: [p.tipo], chiusa: p.tipo !== 'partizione' });
    });
    return catene.map(function (c) {
      var tipo = c.parti.indexOf('atto') !== -1 ? 'esterno'
        : c.parti.indexOf('anafora') !== -1 ? 'esterno-anaforico'
        : c.parti.indexOf('se') !== -1 ? 'interno' : 'interno-presunto';
      return { a: c.a, b: c.b, testo: t.slice(c.a, c.b), tipo: tipo };
    });
  }

  /* ---------- A5. Riferimenti con "precedente", "successivo", "seguente" ---------- */
  var PAR = '(?:comm[ai]|articol[oi]|letter[ae]|periodo|periodi)';
  var REL = '(?:precedent[ei]|successiv[oi]|seguent[ei])';
  var RE_RELATIVO = new RegExp('\\b(?:' + PAR + '\\s+' + REL + '|' + REL + '\\s+' + PAR + ')\\b', 'gi');

  function relativi(t) {
    return trova(RE_RELATIVO, t, 'relativo').map(function (x) {
      return { a: x.a, b: x.b, testo: t.slice(x.a, x.b) };
    });
  }

  /* ---------- D1-D2. Dai rinvii alle relazioni (schede D1, D2, A6) ---------- */
  var TIPI_ATTO = [
    [/^decreto[\s-]+legislativo|^d\.\s?lgs\./i, 'd.lgs.'],
    [/^decreto-legge|^d\.l\./i, 'd.l.'],
    [/^decreto\s+del\s+Presidente\s+della\s+Repubblica|^d\.\s?P\.\s?R\./i, 'd.P.R.'],
    [/^legge\s+costituzionale/i, 'l. cost.'],
    [/^legge/i, 'l.']
  ];
  // Estremi dell'atto citato in un rinvio esterno: "d.lgs. 151/2001".
  function estremiAtto(testo) {
    var m = testo.match(RE_ATTO_SOLO);
    if (!m) {
      var cod = testo.match(RE_CODICE_SOLO);
      return cod ? { chiave: cod[0].toLowerCase(), etichetta: cod[0] } : null;
    }
    var atto = m[0], tipo = '?';
    for (var i = 0; i < TIPI_ATTO.length; i++) if (TIPI_ATTO[i][0].test(atto)) { tipo = TIPI_ATTO[i][1]; break; }
    var num = (atto.match(/n\.\s*(\d+)/) || [])[1];
    // anno: dalla data ("30 dicembre 1971") o da "del 1971"; non dal numero dell'atto (n. 1204)
    var anno = (atto.match(/\d{1,2}°?\s+[a-zA-Z]+\s+(\d{4})/) || atto.match(/\bdel\s+(\d{4})/) || atto.match(/\/(\d{4})/) || [])[1];
    return { chiave: tipo + ' ' + num + '/' + anno, etichetta: tipo + ' ' + num + '/' + anno };
  }
  var RE_ATTO_SOLO = new RegExp(RE_ATTO.source, 'i');
  var RE_CODICE_SOLO = new RegExp(RE_CODICE.source, 'i');

  // Numeri dei commi citati in un rinvio senza "articolo": "commi 1, 2, 3, 4 e 5" -> [1..5]
  function commiCitati(testo) {
    if (/\b(?:articol[oi]|artt?\.)\s+\d/i.test(testo)) return []; // rinvio ad altro articolo
    var m = testo.match(new RegExp('\\bcomm[ai]\\s+(' + ITEM + '(?:\\s*(?:,|e|ed|o|ovvero)\\s+' + ITEM + ')*)', 'i'));
    if (!m) return [];
    return m[1].match(new RegExp(NUM, 'g')) || [];
  }

  function relazioni(r) {
    var numeri = r.commi.map(function (c) { return c.numero; });
    var interne = [], altriArticoli = [], atti = {}, ordine = [];
    r.commi.forEach(function (c) {
      var ultimoAtto = null;
      c.rinvii.forEach(function (x) {
        if (x.tipo === 'esterno' || x.tipo === 'esterno-anaforico') {
          var e = x.tipo === 'esterno' ? estremiAtto(x.testo) : ultimoAtto;
          if (!e) return;
          ultimoAtto = e;
          if (!atti[e.chiave]) { atti[e.chiave] = { chiave: e.chiave, etichetta: e.etichetta, commi: [], rinvii: [] }; ordine.push(e.chiave); }
          var a = atti[e.chiave];
          if (a.commi.indexOf(c.numero) === -1) a.commi.push(c.numero);
          // ADATTAMENTO: l'atto di un rinvio anaforico ("medesima legge") e' quello citato prima nello stesso comma
          a.rinvii.push({ comma: c.numero, testo: x.testo, ricostruito: x.tipo === 'esterno-anaforico' });
          return;
        }
        var bersagli = commiCitati(x.testo);
        if (bersagli.length) {
          bersagli.forEach(function (b) {
            var dest = r.commi[numeri.indexOf(b)];
            interne.push({ da: c.numero, a: b, testo: x.testo, esiste: !!dest, abrogato: !!(dest && dest.abrogato) });
          });
        } else if (/\barticol/i.test(x.testo) && x.tipo === 'interno-presunto') {
          altriArticoli.push({ da: c.numero, testo: x.testo });
        }
      });
    });
    var ingresso = {};
    interne.forEach(function (e) { ingresso[e.a] = (ingresso[e.a] || 0) + 1; });
    return {
      interne: interne,
      altriArticoli: altriArticoli,
      atti: ordine.map(function (k) { return atti[k]; }),
      ingresso: ingresso,
      // A6: rinvio a un comma abrogato o inesistente
      rinviiAbrogati: interne.filter(function (e) { return e.abrogato || !e.esiste; })
    };
  }

  /* ---------- T1. Terminologia: designazioni della persona assistita ----------
   * Regole e raccomandazioni 2001, par. 4, lett. a): i medesimi concetti e istituti
   * sono individuati con denominazioni identiche, senza sinonimi.
   * ADATTAMENTO: il dizionario delle varianti e' costruito a mano sul lessico della
   * l. 104/1992; il raggruppamento "stesso concetto" e' un giudizio da verificare.
   */
  var DESIGNAZIONI = [
    { re: /\bcon\s+disabilit[aà]\s+in\s+situazione\s+di\s+gravit[aà]/gi, forma: 'con disabilità in situazione di gravità', lessico: 'disabilità' },
    { re: /\bhandicappat[aeio](?:\s+maggiorenn[ei])?\s+in\s+situazione\s+di\s+gravit[aà]/gi, forma: 'handicappata in situazione di gravità', lessico: 'handicap' },
    { re: /\bin\s+situazione\s+di\s+handicap\s+grave/gi, forma: 'in situazione di handicap grave', lessico: 'handicap' },
    { re: /\bcon\s+handicap\s+in\s+situazione\s+di\s+gravit[aà]/gi, forma: 'con handicap in situazione di gravità', lessico: 'handicap' },
    { re: /\bportator[ei]\s+di\s+handicap(?:\s+grave)?/gi, forma: 'portatore di handicap', lessico: 'handicap' },
    { re: /\bperson[ae]\s+handicappat[ae]\b/gi, forma: 'persona handicappata', lessico: 'handicap' }
  ];
  function terminologia(r) {
    var occ = [];
    r.commi.forEach(function (c, k) {
      if (c.abrogato) return;
      var presi = [];
      DESIGNAZIONI.forEach(function (d) {
        d.re.lastIndex = 0; var m;
        while ((m = d.re.exec(c.testo))) {
          var a = m.index, b = a + m[0].length;
          if (presi.some(function (p) { return a < p[1] && b > p[0]; })) continue;
          presi.push([a, b]);
          occ.push({ comma: c.numero, k: k, a: a, b: b, testo: m[0], forma: d.forma, lessico: d.lessico });
        }
      });
    });
    var forme = {};
    occ.forEach(function (o) { (forme[o.forma] = forme[o.forma] || { forma: o.forma, lessico: o.lessico, commi: [], n: 0 }).n++;
      if (forme[o.forma].commi.indexOf(o.comma) === -1) forme[o.forma].commi.push(o.comma); });
    return { occorrenze: occ, forme: Object.keys(forme).map(function (f) { return forme[f]; }) };
  }

  /* ---------- R1. Regolarita' formale (Regole e raccomandazioni 2001) ---------- */
  function ordine(num) { // "3-bis" -> [3, 2]
    var LATINI = ['', 'bis', 'ter', 'quater', 'quinquies', 'sexies', 'septies', 'octies', 'novies', 'decies'];
    var m = String(num).match(/^(\d+)(?:-?([a-z]+))?$/);
    return m ? [parseInt(m[1], 10), m[2] ? LATINI.indexOf(m[2]) : 0] : null;
  }
  function regolarita(r) {
    var esiti = [];
    var numerati = r.commi.every(function (c) { return c.numero; });
    esiti.push({ regola: '7b', titolo: 'Commi numerati', esito: numerati ? 'rispettata' : 'scostamento',
      dettaglio: numerati ? 'Tutti gli ' + r.commi.length + ' commi sono numerati.' : 'Ci sono commi senza numero.', dove: [] });
    var errori = [];
    for (var i = 1; i < r.commi.length; i++) {
      var p = ordine(r.commi[i - 1].numero), q = ordine(r.commi[i].numero);
      if (!p || !q) continue;
      var ok = (q[0] === p[0] && q[1] === p[1] + 1) || (q[0] === p[0] + 1 && q[1] === 0);
      if (!ok) errori.push(r.commi[i - 1].numero + ' → ' + r.commi[i].numero);
    }
    esiti.push({ regola: '10b', titolo: 'Commi aggiunti con bis, ter... dopo il comma di riferimento', esito: errori.length ? 'scostamento' : 'rispettata',
      dettaglio: errori.length ? 'Sequenza irregolare: ' + errori.join('; ') + '.' : 'La sequenza dei numeri è regolare, compresi i commi aggiunti (' +
        r.commi.filter(function (c) { return /-/.test(c.numero || ''); }).map(function (c) { return c.numero; }).join(', ') + ').', dove: [] });
    esiti.push({ regola: '5b', titolo: 'Rubrica', esito: r.rubrica ? 'rispettata' : 'da verificare',
      dettaglio: r.rubrica ? 'L\'articolo ha la rubrica "' + r.rubrica + '". L\'uniformità va controllata sugli altri articoli della legge.' : 'Rubrica assente: va controllato se la legge usa rubriche.', dove: [] });
    var rel = [], eo = [], seg = [];
    r.commi.forEach(function (c, k) {
      if (c.abrogato) return;
      c.relativi.forEach(function (x) { rel.push({ comma: c.numero, k: k, testo: x.testo }); });
      var m, re1 = /\be\/o\b/gi; while ((m = re1.exec(c.testo))) eo.push({ comma: c.numero, k: k, testo: m[0] });
      var re2 = /\b(?:articol[oi]|comm[ai])\s+[\d\-a-z, ]+\s+e\s+seguenti\b/gi; while ((m = re2.exec(c.testo))) seg.push({ comma: c.numero, k: k, testo: m[0] });
    });
    esiti.push({ regola: '11d', titolo: 'Niente "precedente" e "successivo" nei riferimenti interni', esito: rel.length ? 'scostamento' : 'rispettata',
      dettaglio: rel.length ? rel.length + ' casi.' : 'Nessun caso.', dove: rel });
    esiti.push({ regola: '4f', titolo: 'Niente "e/o"', esito: eo.length ? 'scostamento' : 'rispettata', dettaglio: eo.length ? eo.length + ' casi.' : 'Nessun caso.', dove: eo });
    esiti.push({ regola: '12i', titolo: 'Niente "articoli o commi ... e seguenti"', esito: seg.length ? 'scostamento' : 'rispettata', dettaglio: seg.length ? seg.length + ' casi.' : 'Nessun caso.', dove: seg });
    var t = terminologia(r);
    esiti.push({ regola: '4a', titolo: 'Stesso concetto, stessa denominazione', esito: t.forme.length > 1 ? 'scostamento' : 'rispettata',
      dettaglio: t.forme.length > 1 ? 'La condizione della persona assistita è designata in ' + t.forme.length + ' modi diversi (scheda T1).' : 'Una sola designazione.',
      dove: t.occorrenze.map(function (o) { return { comma: o.comma, k: o.k, testo: o.testo }; }) });
    return esiti;
  }

  /* ---------- F1. Formule ricorrenti (sequenze di parole ripetute) ---------- */
  var VUOTE = /^(?:di|a|da|in|con|su|per|tra|fra|il|lo|la|i|gli|le|un|uno|una|e|o|ed|del|della|dello|dei|degli|delle|al|alla|allo|ai|agli|alle|dal|dalla|dai|nel|nella|nei|che|cui|non|si)$/i;
  function formule(r, n, minimo) {
    n = n || 4; minimo = minimo || 3;
    var conta = {}, esempi = {};
    r.commi.forEach(function (c) {
      if (c.abrogato) return;
      var parole = c.testo.toLowerCase().match(/[a-zà-öø-ÿ0-9]+/g) || [];
      for (var i = 0; i + n <= parole.length; i++) {
        var g = parole.slice(i, i + n);
        if (VUOTE.test(g[0]) || VUOTE.test(g[n - 1])) continue;
        var k = g.join(' ');
        conta[k] = (conta[k] || 0) + 1;
        (esempi[k] = esempi[k] || []).indexOf(c.numero) === -1 && esempi[k].push(c.numero);
      }
    });
    return Object.keys(conta).filter(function (k) { return conta[k] >= minimo; })
      .sort(function (a, b) { return conta[b] - conta[a] || a.localeCompare(b); })
      .map(function (k) { return { formula: k, n: conta[k], commi: esempi[k] }; });
  }

  /* ---------- Analisi completa ---------- */
  function analizza(grezzo) {
    var p = pulisci(grezzo || '');
    var s = struttura(p.testo);
    var tot = { parole: 0, lettere: 0, frasi: 0 };
    var tutteFrasi = [];
    s.commi.forEach(function (c) {
      // comma dentro un segmento (( )) di Normattiva = testo modificato nel tempo
      c.modificato = p.modificati.some(function (iv) { return c.inizio >= iv[0] && c.inizio < iv[1]; });
      c.frasi = frasi(c.testo).map(function (f, k) {
        var testoF = c.testo.slice(f[0], f[1]);
        var n = conta(testoF);
        return { a: f[0], b: f[1], testo: testoF, parole: n.parole, caratteri: n.lettere, comma: c.numero, indice: k };
      });
      var n = conta(c.testo);
      c.parole = n.parole; c.caratteri = n.lettere;
      c.gulpease = c.abrogato ? null : gulpease(n.parole, n.lettere, c.frasi.length);
      c.rinvii = c.abrogato ? [] : rinvii(c.testo);
      c.relativi = c.abrogato ? [] : relativi(c.testo);
      if (!c.abrogato) {
        tot.parole += n.parole; tot.lettere += n.lettere; tot.frasi += c.frasi.length;
        tutteFrasi = tutteFrasi.concat(c.frasi);
      }
    });
    var lunghezze = tutteFrasi.map(function (f) { return f.parole; });
    var risultato = {
      articolo: s.articolo,
      rubrica: s.rubrica,
      commi: s.commi,
      avvisi: s.avvisi,
      modificati: p.modificati.length,
      note: p.note,
      totali: {
        commi: s.commi.length,
        commiAbrogati: s.commi.filter(function (c) { return c.abrogato; }).length,
        lettere: s.commi.reduce(function (x, c) { return x + c.lettere.length; }, 0),
        frasi: tot.frasi,
        parole: tot.parole,
        lettereAlfa: tot.lettere,
        parolePerFrase: tot.frasi ? tot.parole / tot.frasi : null,
        frasePiuLunga: lunghezze.length ? Math.max.apply(null, lunghezze) : null,
        gulpease: gulpease(tot.parole, tot.lettere, tot.frasi),
        rinvii: s.commi.reduce(function (x, c) { return x + c.rinvii.length; }, 0),
        relativi: s.commi.reduce(function (x, c) { return x + c.relativi.length; }, 0)
      }
    };
    risultato.relazioni = relazioni(risultato);
    risultato.terminologia = terminologia(risultato);
    risultato.regolarita = regolarita(risultato);
    risultato.formule = formule(risultato, 3, 3);
    return risultato;
  }

  var api = { pulisci: pulisci, struttura: struttura, frasi: frasi, conta: conta,
    gulpease: gulpease, rinvii: rinvii, relativi: relativi, relazioni: relazioni,
    estremiAtto: estremiAtto, commiCitati: commiCitati, terminologia: terminologia,
    regolarita: regolarita, formule: formule, analizza: analizza };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AnalisiA = api;
})(this);
