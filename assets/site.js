(function () {
  var LANGS = ['tr', 'en', 'zh'];

  function currentLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && LANGS.indexOf(q) !== -1) return q;
    var stored = null;
    try { stored = localStorage.getItem('mtr-lang'); } catch (e) {}
    if (stored && LANGS.indexOf(stored) !== -1) return stored;
    var html = document.documentElement.getAttribute('data-lang');
    return html && LANGS.indexOf(html) !== -1 ? html : 'tr';
  }

  var lang = currentLang();
  try { localStorage.setItem('mtr-lang', lang); } catch (e) {}

  function apply() {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
    document.querySelectorAll('[data-tr][data-en][data-zh]').forEach(function (el) {
      var value = el.getAttribute('data-' + lang);
      if (value !== null) el.textContent = value;
    });
    document.querySelectorAll('[data-lang-block]').forEach(function (el) {
      el.style.display = el.getAttribute('data-lang-block') === lang ? '' : 'none';
    });
    document.title = document.body.getAttribute('data-title-' + lang) || document.title;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-set-lang') === lang);
    });

    // Keep docs links synchronized with current language
    document.querySelectorAll('a[href*="docs/"]').forEach(function (a) {
      var target = (lang === 'tr') ? 'docs/?lang=tr' : ('docs/' + lang + '/?lang=' + lang);
      a.setAttribute('href', target);
    });
  }

  window.mtrSetLang = function (next) {
    if (LANGS.indexOf(next) === -1) return;
    try { localStorage.setItem('mtr-lang', next); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set('lang', next);
    location.href = url.toString();
  };

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { window.mtrSetLang(b.getAttribute('data-set-lang')); });
    });
    var menu = document.querySelector('.menu-btn');
    var nav = document.querySelector('nav.links');
    if (menu && nav) {
      menu.addEventListener('click', function () { nav.classList.toggle('open'); });
    }
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
