(function () {
  function applyPreloadedStyles() {
    document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (link) {
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = link.href;
      if (link.crossOrigin) s.crossOrigin = link.crossOrigin;
      link.parentNode.insertBefore(s, link.nextSibling);
    });
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', applyPreloadedStyles)
    : applyPreloadedStyles();
})();
