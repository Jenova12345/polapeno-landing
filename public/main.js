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
