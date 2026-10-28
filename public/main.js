// Jednorázové dokreslení rough.js kreseb při vstupu do viewportu.
// Samotné kresby jsou inline SVG z buildu (src/components/Kresba.astro),
// tady se jen spouští animace. Bez JS nebo s prefers-reduced-motion
// se nic nespustí a kresby zůstanou vidět.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var kresby = document.querySelectorAll('.kresba');
  if (!kresby.length) return;

  // délka čáry v px na obrazovce (SVG je natažené, čára má non-scaling-stroke)
  function delka(path) {
    var m = path.getScreenCTM();
    if (!m) return 0;
    var celkem = path.getTotalLength();
    var kroku = 40;
    var soucet = 0;
    var predchozi = null;
    for (var i = 0; i <= kroku; i++) {
      var b = path.getPointAtLength((celkem * i) / kroku);
      var x = m.a * b.x + m.c * b.y;
      var y = m.b * b.x + m.d * b.y;
      if (predchozi) soucet += Math.hypot(x - predchozi[0], y - predchozi[1]);
      predchozi = [x, y];
    }
    return Math.ceil(soucet) + 2;
  }

  document.documentElement.classList.add('kresby-anim');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var kresba = entry.target;
      kresba.querySelectorAll('path').forEach(function (path) {
        path.style.setProperty('--delka', delka(path) + 'px');
      });
      kresba.classList.add('kresba--kresli');
      observer.unobserve(kresba);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  kresby.forEach(function (kresba) {
    observer.observe(kresba);
  });
})();

// Atribuce odkazů do portálu, cookie souhlas a Meta Pixel.
// Odkazy s data-atribuce vedou na PORTAL_START_URL i bez JS, tady se k nim
// jen přidají UTM parametry, pp_ref a pp_lp. Souhlas (pp_consent) má formát
// daný portálem a sdílí se s ním přes doménu .polapeno.cz. Cookie pp_ft
// (first-touch) a Pixel jen s marketingovým souhlasem (m = 1).
(function () {
  var VLASTNI_DOMENA = 'polapeno.cz';
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var DEN = 86400000;
  var COOKIE_DNI_FT = 90;
  var SOUHLAS_MAX_AGE = 15552000; // 180 dní
  var SOUHLAS_KLICE = ['v', 'a', 'm', 't', 'id'];
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // z configu přes data atributy na <body> (Base.astro)
  var PIXEL_ID = document.body.getAttribute('data-pixel') || '';
  var CONSENT_API = document.body.getAttribute('data-consent-api') || '';

  // Jen ostrá doména sdílí souhlas s portálem. Lokálně a na náhledech
  // se souhlas ukládá zvlášť (pp_consent_test, bez Domain) a neodesílá.
  var OSTRA = location.hostname === VLASTNI_DOMENA || location.hostname === 'www.' + VLASTNI_DOMENA;
  var SOUHLAS = OSTRA ? 'pp_consent' : 'pp_consent_test';

  function jeNaseDomena(host) {
    return host === VLASTNI_DOMENA || host.slice(-VLASTNI_DOMENA.length - 1) === '.' + VLASTNI_DOMENA;
  }

  function jeVlastni(host) {
    return jeNaseDomena(host) || host === location.hostname;
  }

  // UTM hodnoty: lowercase, max 100 znaků, nikdy e-mail ani telefon
  function cistaUtm(hodnota) {
    var v = hodnota.trim().toLowerCase();
    if (!v || v.indexOf('@') !== -1 || /\+?\d[\d\s().\/-]{7,}\d/.test(v)) return null;
    return v.slice(0, 100);
  }

  var params = new URLSearchParams(location.search);
  var zdroj = {};
  UTM.forEach(function (klic) {
    var v = params.get(klic);
    if (v === null) return;
    v = cistaUtm(v);
    if (v) zdroj[klic] = v;
  });
  // fbclid beze změny (velikost písmen je součást identifikátoru)
  var fbclid = params.get('fbclid');
  if (fbclid && fbclid.indexOf('@') === -1) zdroj.fbclid = fbclid;

  var ref = '';
  try {
    var host = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, '');
    if (host && !jeVlastni(host)) ref = host;
  } catch (e) {}

  var lp = location.pathname;

  // --- odkazy do portálu ---
  var dotaz = [];
  Object.keys(zdroj).forEach(function (klic) {
    dotaz.push(klic + '=' + encodeURIComponent(zdroj[klic]));
  });
  if (ref) dotaz.push('pp_ref=' + encodeURIComponent(ref));
  // bez zdroje návštěvy zůstává odkaz čistý
  if (dotaz.length) {
    dotaz.push('pp_lp=' + encodeURIComponent(lp).replace(/%2F/g, '/'));
    document.querySelectorAll('a[data-atribuce]').forEach(function (a) {
      a.href += (a.href.indexOf('?') === -1 ? '?' : '&') + dotaz.join('&');
    });
  }

  // --- cookies ---
  function cookie(jmeno) {
    var m = document.cookie.match('(?:^|; )' + jmeno + '=([^;]*)');
    return m ? m[1] : null;
  }

  function zapisCookie(jmeno, hodnota, maxAge) {
    var c = jmeno + '=' + hodnota + '; Max-Age=' + maxAge + '; Path=/';
    // sdílení s portálem jen na ostré doméně (lokálně a na náhledu by cookie neprošla)
    if (OSTRA) c += '; Domain=.' + VLASTNI_DOMENA;
    document.cookie = c + '; Secure; SameSite=Lax';
  }

  // mazat dvakrát: kopii bez Domain i sdílenou
  function smazCookie(jmeno) {
    document.cookie = jmeno + '=; Max-Age=0; Path=/';
    document.cookie = jmeno + '=; Max-Age=0; Path=/; Domain=.' + VLASTNI_DOMENA;
  }

  function smazCookiesSPredponou(predpona) {
    document.cookie.split('; ').forEach(function (c) {
      var jmeno = c.split('=')[0];
      if (jmeno.indexOf(predpona) === 0) smazCookie(jmeno);
    });
  }

  // first-touch: jen poprvé, existující pp_ft se nikdy nepřepisuje
  function ulozFirstTouch() {
    if (cookie('pp_ft')) return;
    var data = {};
    UTM.concat('fbclid').forEach(function (klic) {
      data[klic] = zdroj[klic] || null;
    });
    data.ref = ref || null;
    data.lp = lp;
    data.ts = Date.now();
    zapisCookie('pp_ft', encodeURIComponent(JSON.stringify(data)), COOKIE_DNI_FT * 86400);
  }

  // --- souhlas ---
  // Platný jen přesně v daném formátu, jinak null (lišta se ukáže znovu).
  // Souhlas se nikdy nepředpokládá.
  function ctiSouhlas() {
    var hodnota = cookie(SOUHLAS);
    if (hodnota === null) return null;
    var s;
    try {
      s = JSON.parse(decodeURIComponent(hodnota));
    } catch (e) {
      return null;
    }
    if (!s || typeof s !== 'object' || Array.isArray(s)) return null;
    if (Object.keys(s).length !== SOUHLAS_KLICE.length) return null;
    for (var i = 0; i < SOUHLAS_KLICE.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(s, SOUHLAS_KLICE[i])) return null;
    }
    if (s.v !== 1) return null;
    if ((s.a !== 0 && s.a !== 1) || (s.m !== 0 && s.m !== 1)) return null;
    if (typeof s.id !== 'string' || !UUID.test(s.id)) return null;
    var ted = Date.now();
    if (typeof s.t !== 'number' || !isFinite(s.t) || s.t > ted + DEN || s.t < ted - 180 * DEN) return null;
    return s;
  }

  function noveId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // starší prohlížeče: UUID v4 z náhodných bajtů
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  function zapisSouhlas(s) {
    // na sdílené doméně nejdřív smazat případnou starou kopii bez Domain
    if (OSTRA) document.cookie = SOUHLAS + '=; Max-Age=0; Path=/';
    zapisCookie(SOUHLAS, encodeURIComponent(JSON.stringify(s)), SOUHLAS_MAX_AGE);
  }

  // --- záznam souhlasu do portálu ---
  // Při 503 se záznam zkusí znovu na další stránce, nejvýš 3× za session.
  var FRONTA = 'pp_consent_fronta';

  function fronta(zaznam) {
    try {
      if (zaznam) sessionStorage.setItem(FRONTA, JSON.stringify(zaznam));
      else sessionStorage.removeItem(FRONTA);
    } catch (e) {}
  }

  function ctiFrontu() {
    try {
      return JSON.parse(sessionStorage.getItem(FRONTA));
    } catch (e) {
      return null;
    }
  }

  function odesli(data, pokusy) {
    if (!OSTRA || !CONSENT_API) return;
    fetch(CONSENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
      keepalive: true,
    })
      .then(function (odpoved) {
        var cekajici = ctiFrontu();
        // mezitím mohla vzniknout novější volba, tu nepřepisovat
        if (cekajici && cekajici.data.t !== data.t) return;
        fronta(odpoved.status === 503 ? { data: data, pokusy: pokusy } : null);
      })
      .catch(function () {});
  }

  var cekajici = ctiFrontu();
  if (cekajici) {
    if (cekajici.pokusy < 3) odesli(cekajici.data, cekajici.pokusy + 1);
    else fronta(null);
  }

  // --- Meta Pixel ---
  var pixelBezi = false;

  function spustPixel() {
    if (!PIXEL_ID) return;
    if (pixelBezi) {
      window.fbq('consent', 'grant');
      return;
    }
    pixelBezi = true;
    // oficiální zavaděč od Mety
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('set', 'autoConfig', false, PIXEL_ID);
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function odvolejMarketing() {
    if (pixelBezi) window.fbq('consent', 'revoke');
    ['_fbp', '_fbc', 'pp_ft'].forEach(smazCookie);
  }

  var souhlas = ctiSouhlas();
  if (souhlas && souhlas.m === 1) {
    ulozFirstTouch();
    spustPixel();
  }

  // --- Lead při kliknutí na „Vyzkoušet zdarma“ ---
  // Všechny odkazy s data-atribuce vedou na /start. Lead jen s m = 1.
  // Stránka odchází na jinou doménu a požadavek Pixelu by se zrušil, proto
  // se přechod o chvíli odloží: dokud se nenačte fbevents.js, Lead čeká
  // ve frontě fbq. Nejdéle LEAD_MAX_MS, pak se odejde i bez něj.
  // Nový panel (Ctrl/Cmd, prostřední tlačítko) stránku neopouští, tam se
  // jen odešle Lead. Bez JS odkaz funguje jako obyčejný odkaz.
  var LEAD_PO_NACTENI_MS = 300;
  var LEAD_MAX_MS = 1000;
  var odchazi = false;

  function odejdiPoLeadu(url) {
    var zacatek = Date.now();
    (function cekej() {
      var nacteno = window.fbq && window.fbq.callMethod;
      if (nacteno || Date.now() - zacatek >= LEAD_MAX_MS) {
        setTimeout(function () { location.href = url; }, nacteno ? LEAD_PO_NACTENI_MS : 0);
      } else {
        setTimeout(cekej, 50);
      }
    })();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-atribuce]');
    if (!a || !souhlas || souhlas.m !== 1 || !pixelBezi) return;
    var novyPanel = e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank';
    if (odchazi) {
      if (!novyPanel) e.preventDefault();
      return;
    }
    window.fbq('track', 'Lead');
    if (novyPanel || e.defaultPrevented) return;
    e.preventDefault();
    odchazi = true;
    odejdiPoLeadu(a.href);
  });
  // návrat tlačítkem Zpět (bfcache) vrací stránku i s odchazi = true
  window.addEventListener('pageshow', function () { odchazi = false; });
  // prostřední tlačítko nespouští click, jen auxclick
  document.addEventListener('auxclick', function (e) {
    if (e.button !== 1) return;
    var a = e.target.closest && e.target.closest('a[data-atribuce]');
    if (a && souhlas && souhlas.m === 1 && pixelBezi) window.fbq('track', 'Lead');
  });

  // nová nebo změněná volba: zapsat, uklidit po odvolání, zaznamenat do portálu
  function ulozVolbu(a, m) {
    var predtim = souhlas;
    if (predtim && predtim.a === a && predtim.m === m) return;
    souhlas = { v: 1, a: a, m: m, t: Date.now(), id: predtim ? predtim.id : noveId() };
    zapisSouhlas(souhlas);
    // bez platné předchozí volby se uklízí taky (mohly zůstat staré cookies)
    if (m === 0 && (!predtim || predtim.m === 1)) odvolejMarketing();
    if (a === 0 && (!predtim || predtim.a === 1)) smazCookiesSPredponou('ph_');
    if (m === 1) {
      ulozFirstTouch();
      spustPixel();
    }
    fronta(null);
    odesli(souhlas, 0);
  }

  var lista = document.getElementById('cookie-lista');
  if (!lista) return;
  var zakladni = lista.querySelector('.cookie-akce--lista');
  var nastaveni = lista.querySelector('.cookie-nastaveni');
  var prepinacA = lista.querySelector('input[name="a"]');
  var prepinacM = lista.querySelector('input[name="m"]');

  // Lišta je fixní dole. Dokud je vidět, dostane stránka dole stejně
  // vysoký okraj, aby lišta nezakrývala konec obsahu (patičku).
  function vyskaListy() {
    document.documentElement.style.setProperty('--cookie-lista', lista.hidden ? '0px' : lista.offsetHeight + 'px');
  }

  // rezim: 'lista' (tři tlačítka), 'nastaveni' (kategorie) nebo false (skrýt)
  function ukazListu(rezim) {
    var kategorie = rezim === 'nastaveni';
    lista.hidden = !rezim;
    zakladni.hidden = kategorie;
    nastaveni.hidden = !kategorie;
    lista.classList.toggle('cookie-lista--nastaveni', kategorie);
    if (kategorie) {
      prepinacA.checked = !!(souhlas && souhlas.a);
      prepinacM.checked = !!(souhlas && souhlas.m);
    }
    vyskaListy();
  }
  window.addEventListener('resize', vyskaListy);

  if (!souhlas) ukazListu('lista');

  lista.addEventListener('click', function (e) {
    var tlacitko = e.target.closest('[data-consent]');
    if (!tlacitko) return;
    var akce = tlacitko.getAttribute('data-consent');
    if (akce === 'nastavit') {
      ukazListu('nastaveni');
      prepinacA.focus();
      return;
    }
    if (akce === 'vse') ulozVolbu(1, 1);
    else if (akce === 'nic') ulozVolbu(0, 0);
    else ulozVolbu(prepinacA.checked ? 1 : 0, prepinacM.checked ? 1 : 0);
    ukazListu(false);
  });

  document.querySelectorAll('[data-cookie-nastaveni]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      ukazListu('nastaveni');
      prepinacA.focus();
    });
  });
})();
