(function () {
  "use strict";

  function getStoredLang() {
    try {
      const stored = localStorage.getItem("sohba_lang");
      return stored === "ar" || stored === "en" ? stored : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem("sohba_lang", lang);
    } catch (e) {
      /* storage unavailable */
    }
  }

  function getUrlLang() {
    try {
      const val = new URLSearchParams(window.location.search).get("lang");
      return val === "ar" || val === "en" ? val : null;
    } catch (e) {
      return null;
    }
  }

  function getInitialLang() {
    return getUrlLang() || getStoredLang() || "ar";
  }

  // Matches this site's own pages so internal links can carry ?lang= across
  // file:// navigation, where localStorage is isolated per file.
  const INTERNAL_PAGE_RE =
    /^(?:\.\/)?(?:index|privacy-policy|terms-of-service|data-deletion)\.html(?=[?#]|$)/;

  function withLangParam(href, lang) {
    const hashIndex = href.indexOf("#");
    const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
    const beforeHash = hashIndex === -1 ? href : href.slice(0, hashIndex);
    const qIndex = beforeHash.indexOf("?");
    const path = qIndex === -1 ? beforeHash : beforeHash.slice(0, qIndex);
    const params = new URLSearchParams(
      qIndex === -1 ? "" : beforeHash.slice(qIndex + 1),
    );
    if (lang === "en") {
      params.set("lang", "en");
    } else {
      params.delete("lang");
    }
    const qs = params.toString();
    return path + (qs ? "?" + qs : "") + hash;
  }

  function syncInternalLinks(lang) {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && INTERNAL_PAGE_RE.test(href)) {
        a.setAttribute("href", withLangParam(href, lang));
      }
    });
  }

  window.SohbaCommon = {
    getStoredLang,
    setStoredLang,
    getUrlLang,
    getInitialLang,
    withLangParam,
    syncInternalLinks,
  };
})();
