/* MRC Tuner Studio — Language switcher & sync script
   Supports tr (default), en, zh.
   Preserves current chapter navigation and query parameters.
*/
(function () {
  'use strict';

  var SUPPORTED = ['tr', 'en', 'zh'];

  function currentLocale() {
    var path = window.location.pathname;
    var m = path.match(/\/docs\/(en|zh)(?:\/|$)/);
    return m ? m[1] : 'tr';
  }

  function requested() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q && SUPPORTED.indexOf(q) !== -1) return q;
    } catch (e) {}
    return null;
  }

  function getTargetUrlForLocale(targetLang) {
    if (SUPPORTED.indexOf(targetLang) === -1) return null;
    var path = window.location.pathname;
    var idx = path.indexOf('/docs');
    if (idx === -1) return null;

    var base = path.slice(0, idx + '/docs'.length);
    var sub = path.slice(idx + '/docs'.length);
    var cleanSub = sub.replace(/^\/(?:en|zh)(?=\/|$)/, '');
    if (!cleanSub.startsWith('/')) cleanSub = '/' + cleanSub;

    var targetPrefix = (targetLang === 'tr') ? '' : '/' + targetLang;
    var newPath = base + targetPrefix + cleanSub;

    var url = new URL(window.location.href);
    url.pathname = newPath;
    url.searchParams.set('lang', targetLang);
    return url.toString();
  }

  // Handle ?lang= redirection if requested language differs from page language
  var want = requested();
  var have = currentLocale();

  if (want && want !== have) {
    try { localStorage.setItem('mtr-lang', want); } catch (e) {}
    var targetUrl = getTargetUrlForLocale(want);
    if (targetUrl && targetUrl !== window.location.href) {
      window.location.replace(targetUrl);
      return;
    }
  } else {
    try { localStorage.setItem('mtr-lang', have); } catch (e) {}
  }

  function attachHandlers() {
    var selector = '.md-select__link, a[hreflang]';
    var links = document.querySelectorAll(selector);

    links.forEach(function (link) {
      link.addEventListener('click', function (ev) {
        var lang = link.getAttribute('hreflang');
        if (!lang) {
          var href = link.getAttribute('href') || '';
          var m = href.match(/(?:\/|^)(en|zh)(?:\/|$)/);
          lang = m ? m[1] : 'tr';
        }

        if (SUPPORTED.indexOf(lang) !== -1) {
          ev.preventDefault();
          try { localStorage.setItem('mtr-lang', lang); } catch (e) {}
          var dest = getTargetUrlForLocale(lang);
          if (dest) {
            window.location.href = dest;
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    attachHandlers();
  }
})();
