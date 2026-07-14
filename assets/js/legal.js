(function () {
  "use strict";

  const { setStoredLang, getInitialLang, syncInternalLinks } = window.SohbaCommon;

  const state = { lang: getInitialLang() };

  const commonText = {
    ar: {
      logoText: "صحبة غيمز",
      langToggle: "EN",
      navDownload: "حمّل الآن",
      navAbout: "من نحن",
      navBenefits: "المميزات",
      navGames: "الألعاب",
      navHow: "كيف تبدأ",
      footerSlogan: "أول منصة عربية للّعب والتواصل بين اللاعبين",
      footerColPlatformTitle: "المنصة",
      footerAbout: "من نحن",
      footerBenefits: "المميزات",
      footerGames: "الألعاب",
      footerDownload: "التحميل",
      footerColLegalTitle: "قانوني",
      footerPrivacy: "سياسة الخصوصية",
      footerTerms: "شروط الاستخدام",
      footerDataDeletion: "حذف البيانات",
      footerColContactTitle: "تواصل معنا",
      footerRights: "© 2026 صحبة غيمز. جميع الحقوق محفوظة.",
      breadcrumbHome: "الرئيسية",
    },
    en: {
      logoText: "Sohba Games",
      langToggle: "ع",
      navDownload: "Download Now",
      navAbout: "About",
      navBenefits: "Features",
      navGames: "Games",
      navHow: "How It Works",
      footerSlogan: "The First Arab Gaming & Community Platform",
      footerColPlatformTitle: "Platform",
      footerAbout: "About Us",
      footerBenefits: "Features",
      footerGames: "Games",
      footerDownload: "Download",
      footerColLegalTitle: "Legal",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Service",
      footerDataDeletion: "Data Deletion",
      footerColContactTitle: "Contact Us",
      footerRights: "© 2026 Sohba Games. All rights reserved.",
      breadcrumbHome: "Home",
    },
  };

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function applyDataI18n(lang) {
    document.querySelectorAll("[data-ar]").forEach((node) => {
      const val = node.getAttribute(lang === "ar" ? "data-ar" : "data-en");
      if (val !== null) node.textContent = val;
    });
    document.querySelectorAll("[data-ar-html]").forEach((node) => {
      const val = node.getAttribute(
        lang === "ar" ? "data-ar-html" : "data-en-html",
      );
      if (val !== null) node.innerHTML = val;
    });
  }

  function render() {
    const lang = state.lang;
    const t = commonText[lang];
    const dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    document.body.classList.toggle("lang-en", lang === "en");

    setText("logoText", t.logoText);
    setText("footerLogoText", t.logoText);
    setText("langToggleBtn", t.langToggle);
    setText("navDownload", t.navDownload);
    setText("navAboutLink", t.navAbout);
    setText("navBenefitsLink", t.navBenefits);
    setText("navGamesLink", t.navGames);
    setText("navHowLink", t.navHow);
    setText("footerSlogan", t.footerSlogan);
    setText("footerColPlatformTitle", t.footerColPlatformTitle);
    setText("footerAbout", t.footerAbout);
    setText("footerBenefits", t.footerBenefits);
    setText("footerGames", t.footerGames);
    setText("footerDownload", t.footerDownload);
    setText("footerColLegalTitle", t.footerColLegalTitle);
    setText("footerPrivacy", t.footerPrivacy);
    setText("footerTerms", t.footerTerms);
    setText("footerDataDeletion", t.footerDataDeletion);
    setText("footerColContactTitle", t.footerColContactTitle);
    setText("footerRights", t.footerRights);
    setText("breadcrumbHome", t.breadcrumbHome);

    applyDataI18n(lang);
    syncInternalLinks(lang);
  }

  function initScrollReveal() {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );
    document
      .querySelectorAll(".animate-in")
      .forEach((node) => io.observe(node));
  }

  function bindEvents() {
    const btn = document.getElementById("langToggleBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        state.lang = state.lang === "ar" ? "en" : "ar";
        setStoredLang(state.lang);
        render();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    render();
    initScrollReveal();
  });

  window.SohbaLegal = {
    setLang: (lang) => {
      state.lang = lang;
      render();
    },
  };
})();
