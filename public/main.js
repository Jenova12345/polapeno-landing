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

// Atribuce odkazů do portálu a cookie souhlas.
// Odkazy s data-atribuce vedou na PORTAL_START_URL i bez JS, tady se k nim
// jen přidají UTM parametry, pp_ref a pp_lp. Cookie pp_ft (first-touch)
// se zapíše jen se souhlasem (pp_consent=accepted).
(function () {
  var VLASTNI_DOMENA = 'polapeno.cz';
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var COOKIE_DNI_FT = 90;
  var COOKIE_DNI_SOUHLAS = 365;

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

  function zapisCookie(jmeno, hodnota, dni) {
    var c = jmeno + '=' + hodnota + '; Path=/; Max-Age=' + dni * 86400 + '; SameSite=Lax; Secure';
    // sdílení s portálem jen na skutečné doméně (lokálně a na náhledu by cookie neprošla)
    if (jeNaseDomena(location.hostname)) {
      c += '; Domain=.' + VLASTNI_DOMENA;
    }
    document.cookie = c;
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
    zapisCookie('pp_ft', encodeURIComponent(JSON.stringify(data)), COOKIE_DNI_FT);
  }

  var souhlas = cookie('pp_consent');
  if (souhlas === 'accepted') ulozFirstTouch();

  var lista = document.getElementById('cookie-lista');
  if (!lista) return;

  // Lišta je fixní dole. Dokud je vidět, dostane stránka dole stejně
  // vysoký okraj, aby lišta nezakrývala konec obsahu (patičku).
  function vyskaListy() {
    document.documentElement.style.setProperty('--cookie-lista', lista.hidden ? '0px' : lista.offsetHeight + 'px');
  }
  function ukazListu(ano) {
    lista.hidden = !ano;
    vyskaListy();
  }
  window.addEventListener('resize', vyskaListy);

  if (!souhlas) ukazListu(true);

  lista.addEventListener('click', function (e) {
    var tlacitko = e.target.closest('[data-consent]');
    if (!tlacitko) return;
    var volba = tlacitko.getAttribute('data-consent');
    zapisCookie('pp_consent', volba, COOKIE_DNI_SOUHLAS);
    if (volba === 'accepted') ulozFirstTouch();
    // odvolaný souhlas: first-touch cookie smazat
    else if (cookie('pp_ft')) zapisCookie('pp_ft', '', 0);
    ukazListu(false);
  });

  document.querySelectorAll('[data-cookie-nastaveni]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      ukazListu(true);
      lista.querySelector('button').focus();
    });
  });
})();
