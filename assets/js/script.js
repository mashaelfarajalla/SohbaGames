(function () {
  "use strict";

  // Fill these in once a backend/PlayFab title exists — no other code needs to change.
  const SOHBA_CONFIG = {
    apiBaseUrl: "",
    playfabTitleId: "",
  };

  const state = {
    lang: "ar",
    copied: false,
    referralCode: "5BKCKW",
    inviterName: null,
    liveCount: 10842,
    stat1: 0,
    stat2: 0,
    stat3: 0,
  };

  let liveTickInterval = null;
  let statsAnimated = false;

  const benefitIcons = [
    {
      color: "#a855f7",
      svg: '<line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>',
    },
    {
      color: "#d946ef",
      svg: '<path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path>',
    },
    {
      color: "#38bdf8",
      svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    },
    {
      color: "#fbbf24",
      svg: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
    },
  ];

  const stepIcons = [
    {
      color: "#00d4ff",
      svg: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
    },
    {
      color: "#0077aa",
      svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line>',
    },
    {
      color: "#7c3aed",
      svg: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>',
    },
    {
      color: "#00e8c8",
      svg: '<line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>',
    },
  ];

  const gameCardImgs = [
    "assets/img/sohba ludo.jpg",
    "assets/img/sohba cards.jpg",
    "assets/img/sohba 1.jpg",
  ];

  function getReferralLink() {
    return `https://sohbagames.com/?ref=${state.referralCode}`;
  }

  function getTexts() {
    const isAr = state.lang === "ar";
    const name = state.inviterName || (isAr ? "صديقك" : "Your Friend");

    const benefits = isAr
      ? [
          {
            title: "اكتشف الألعاب",
            desc: "أحدث الإصدارات والتحديثات في مكان واحد",
          },
          {
            title: "العب مع أصدقائك",
            desc: "كوّن فرقاً وشارك في بطولات حماسية يومية",
          },
          {
            title: "انضم للمجتمعات",
            desc: "تعرف على لاعبين جدد يشاركونك شغف الألعاب",
          },
          {
            title: "المكافآت والإحالات",
            desc: "ادعُ أصدقاءك واكسب جواهر ورصيد مجاني",
          },
        ]
      : [
          {
            title: "Discover Games",
            desc: "Latest releases and updates all in one place",
          },
          {
            title: "Play with Friends",
            desc: "Form teams and join daily tournaments",
          },
          {
            title: "Join Communities",
            desc: "Meet gamers who share your passion",
          },
          {
            title: "Rewards & Referrals",
            desc: "Invite friends and earn gems and free credits",
          },
        ];

    const gameNames = isAr
      ? ["لودو", "طرنيب", "صحبة غيمز"]
      : ["Ludo", "Tarneeb", "Sohba Games"];
    const gamePlayers = ["4,821", "3,142", "2,658"];
    const games = gameCardImgs.map((img, i) => ({
      img,
      name: gameNames[i],
      players: gamePlayers[i],
    }));

    const steps = isAr
      ? [
          {
            n: "01",
            title: "حمّل التطبيق",
            desc: "حمل تطبيق Sohba من متجر Google Play أو App Store.",
          },
          {
            n: "02",
            title: "أنشئ حسابك",
            desc: "سجل حساب جديد باستخدام بريدك الإلكتروني أو حسابك.",
          },
          {
            n: "03",
            title: "أدخل كود الدعوة",
            desc: "أدخل كود الدعوة الخاص بك واحصل على مكافآت.",
          },
          {
            n: "04",
            title: "ابدأ اللعب",
            desc: "استمتع بالألعاب وتواصل مع أصدقاء جدد على Sohba.",
          },
        ]
      : [
          {
            n: "01",
            title: "Download the App",
            desc: "Free on Google Play & App Store",
          },
          {
            n: "02",
            title: "Create Account",
            desc: "Sign up in a few simple steps",
          },
          {
            n: "03",
            title: "Enter Referral Code",
            desc: "Use the code to unlock your welcome gift",
          },
          {
            n: "04",
            title: "Start Playing",
            desc: "Top up games, join tournaments, and win",
          },
        ];

    return {
      dir: isAr ? "rtl" : "ltr",
      logoText: isAr ? "صحبة غيمز" : "Sohba Games",
      langToggle: isAr ? "EN" : "ع",
      navDownload: isAr ? "حمّل الآن" : "Download Now",
      navAbout: isAr ? "من نحن" : "About",
      navBenefits: isAr ? "المميزات" : "Features",
      navGames: isAr ? "الألعاب" : "Games",
      navHow: isAr ? "كيف تبدأ" : "How It Works",

      heroEyebrow: isAr
        ? "أول منصة عربية للّعب والتواصل بين اللاعبين"
        : "The First Arab Gaming & Community Platform",
      heroTitle: isAr ? "صحبة غيمز" : "Sohba Games",
      heroSubtitle: isAr
        ? "العب وتواصل مع أكبر مجتمع لاعبين عرب — وشحن ألعابك وبطاقات هداياك في مكان واحد."
        : "Play and connect with the largest Arab gaming community — plus top up your games and gift cards in one place.",
      heroDownloadBtn: isAr ? "حمّل التطبيق الآن" : "Download the App",
      heroExploreBtn: isAr ? "استكشف الألعاب" : "Explore Games",

      liveCountFormatted: state.liveCount.toLocaleString("en-US"),
      liveCountLabel: isAr ? "لاعب انضموا اليوم" : "players joined today",

      stat1Display:
        state.stat1 >= 1000
          ? Math.floor(state.stat1 / 1000) + "K+"
          : state.stat1 + "+",
      stat2Display: state.stat2 + "+",
      stat3Display: state.stat3 + "%",
      stat1Label: isAr ? "لاعب نشط" : "Active Players",
      stat2Label: isAr ? "لعبة متاحة" : "Games Available",
      stat3Label: isAr ? "رضا العملاء" : "Customer Satisfaction",

      gameBadge: isAr ? "دعوة للعب" : "GAME INVITE",
      inviterDisplay: name,
      heroInviteText: isAr
        ? "دعاك للانضمام إلى عالم صحبة"
        : "invited you to join Sohba",
      codeLabel: isAr ? "رابط الدعوة الخاص بك" : "Your Referral Link",
      codeHint: isAr
        ? "شارك هذا الرابط مع أصدقائك للحصول على هديتك"
        : "Share this link with friends to claim your gift",
      copyBtnText: state.copied
        ? isAr
          ? "✓ تم النسخ!"
          : "✓ Copied!"
        : isAr
          ? "نسخ الرابط"
          : "Copy Link",
      copyBtnShort: state.copied
        ? isAr
          ? "✓ تم"
          : "✓"
        : isAr
          ? "نسخ"
          : "Copy",
      storeGetOn: isAr ? "تحميل من" : "Get it on",

      aboutTitle: isAr ? "ما هي منصة صحبة؟" : "What is Sohba?",
      aboutStore: isAr ? "متجر رقمي متكامل" : "All-in-One Digital Store",
      aboutStoreDesc: isAr
        ? "شحن ألعاب الفيديو، بطاقات الهدايا (PlayStation، Xbox، Steam)، وعملات الألعاب المشهورة مثل ببجي وموبايل ليجندز بأسعار تنافسية تناسب اللاعب العربي."
        : "Top up video games, gift cards (PlayStation, Xbox, Steam), and popular in-game currencies at competitive prices for Arab gamers.",
      aboutCommunity: isAr
        ? "مجتمع اللاعبين الأكبر"
        : "The Biggest Gaming Community",
      aboutCommunityDesc: isAr
        ? "تجمع لعشاق الألعاب (Gamers) في العالم العربي للنقاش، تنظيم البطولات، ومشاركة أحدث أخبار الألعاب في بيئة تفاعلية."
        : "A gathering place for gaming enthusiasts across the Arab world to discuss, organize tournaments, and share the latest gaming news.",

      benefitsSub: isAr ? "المميزات" : "Features",
      benefitsTitle: isAr ? "لماذا تختار صحبة؟" : "Why Choose Sohba?",
      benefits,

      gamesSub: isAr ? "الألعاب" : "Games",
      gamesTitle: isAr
        ? "أشهر الألعاب على المنصة"
        : "Popular Games on the Platform",
      gameLive: isAr ? "متوفر" : "LIVE",
      playingNow: isAr ? "لاعب الآن" : "playing now",
      playNowBtn: isAr ? "العب الآن" : "Play Now",
      games,

      howSub: isAr ? "ابدأ الآن" : "Get Started",
      howTitle: isAr ? "كيف تبدأ رحلتك؟" : "How It Works",
      steps,

      ctaSub: isAr ? "انضم الآن" : "Join Now",
      ctaTitle: isAr ? "جاهز للانضمام؟" : "Ready to Join?",
      ctaDesc: isAr
        ? "لا تفوّت هديتك الترحيبية — شارك رابط الدعوة عند التسجيل في التطبيق"
        : "Don't miss your welcome gift — share the referral link when signing up",

      footerPrivacy: isAr ? "سياسة الخصوصية" : "Privacy Policy",
      footerTerms: isAr ? "شروط الاستخدام" : "Terms of Use",
      footerContact: isAr ? "اتصل بنا" : "Contact Us",
      footerRights: isAr
        ? "© 2026 صحبة غيمز. جميع الحقوق محفوظة."
        : "© 2026 Sohba Games. All rights reserved.",
    };
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  function render() {
    const t = getTexts();

    document.documentElement.setAttribute("lang", state.lang);
    document.documentElement.setAttribute("dir", t.dir);
    document.body.classList.toggle("lang-en", state.lang === "en");

    document.getElementById("logoText").textContent = t.logoText;
    document.getElementById("footerLogoText").textContent = t.logoText;
    document.getElementById("langToggleBtn").textContent = t.langToggle;
    document.getElementById("navDownload").textContent = t.navDownload;
    document.getElementById("navAboutLink").textContent = t.navAbout;
    document.getElementById("navBenefitsLink").textContent = t.navBenefits;
    document.getElementById("navGamesLink").textContent = t.navGames;
    document.getElementById("navHowLink").textContent = t.navHow;

    document.getElementById("heroEyebrow").textContent = t.heroEyebrow;
    document.getElementById("heroTitle").textContent = t.heroTitle;
    document.getElementById("heroSubtitle").textContent = t.heroSubtitle;
    document.getElementById("heroDownloadBtn").textContent = t.heroDownloadBtn;
    document.getElementById("heroExploreBtn").textContent = t.heroExploreBtn;

    document.getElementById("liveCountText").textContent = t.liveCountFormatted;
    document.getElementById("liveCountLabel").textContent = t.liveCountLabel;

    document.getElementById("stat1Value").textContent = t.stat1Display;
    document.getElementById("stat1Label").textContent = t.stat1Label;
    document.getElementById("stat2Value").textContent = t.stat2Display;
    document.getElementById("stat2Label").textContent = t.stat2Label;
    document.getElementById("stat3Value").textContent = t.stat3Display;
    document.getElementById("stat3Label").textContent = t.stat3Label;

    document.getElementById("gameBadge").textContent = t.gameBadge;
    document.getElementById("inviterDisplay").textContent = t.inviterDisplay;
    document.getElementById("heroInviteText").textContent = t.heroInviteText;

    const referralLink = getReferralLink();

    document.getElementById("codeLabel").textContent = t.codeLabel;
    const codeValueEl = document.getElementById("referralCodeText");
    codeValueEl.textContent = referralLink;
    codeValueEl.setAttribute("dir", "ltr");
    document.getElementById("codeHint").textContent = t.codeHint;
    const copyBtn = document.getElementById("copyCodeBtn");
    copyBtn.textContent = t.copyBtnText;
    copyBtn.classList.toggle("copied", state.copied);

    const ctaCodeValueEl = document.getElementById("ctaReferralCodeText");
    ctaCodeValueEl.textContent = referralLink;
    ctaCodeValueEl.setAttribute("dir", "ltr");
    const ctaCopyBtn = document.getElementById("ctaCopyCodeBtn");
    ctaCopyBtn.textContent = t.copyBtnShort;

    document.querySelectorAll('[data-i18n="storeGetOn"]').forEach((node) => {
      node.textContent = t.storeGetOn;
    });

    document.getElementById("aboutTitle").textContent = t.aboutTitle;
    document.getElementById("aboutStore").textContent = t.aboutStore;
    document.getElementById("aboutStoreDesc").textContent = t.aboutStoreDesc;
    document.getElementById("aboutCommunity").textContent = t.aboutCommunity;
    document.getElementById("aboutCommunityDesc").textContent =
      t.aboutCommunityDesc;

    document.getElementById("benefitsSub").textContent = t.benefitsSub;
    document.getElementById("benefitsTitle").textContent = t.benefitsTitle;
    const benefitsGrid = document.getElementById("benefitsGrid");
    benefitsGrid.innerHTML = "";
    t.benefits.forEach((b, i) => {
      const icon = benefitIcons[i];
      benefitsGrid.appendChild(
        el(`
        <div class="sb-benefit-card">
          <div class="sb-benefit-icon" style="--glow:${icon.color};">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${icon.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>
          </div>
          <h3 class="sb-benefit-title">${b.title}</h3>
          <p class="sb-benefit-desc">${b.desc}</p>
        </div>
      `),
      );
    });

    document.getElementById("gamesSub").textContent = t.gamesSub;
    document.getElementById("gamesTitle").textContent = t.gamesTitle;
    const gamesGrid = document.getElementById("gamesGrid");
    gamesGrid.innerHTML = "";
    t.games.forEach((g) => {
      gamesGrid.appendChild(
        el(`
        <div class="sb-game-card">
          <img src="${g.img}" alt="${g.name}" loading="lazy" decoding="async">
          <div class="sb-game-overlay"></div>
          <div class="sb-game-live">
            <div class="sb-game-live-dot"></div>
            <span>${t.gameLive}</span>
          </div>
          <div class="sb-game-name">${g.name}</div>
          <div class="sb-game-hover-overlay">
            <div class="sb-game-playing">
              <div class="sb-game-playing-dot"></div>
              <span>${g.players} ${t.playingNow}</span>
            </div>
            <div class="sb-game-hover-title">${g.name}</div>
            <div class="sb-game-play-btn">${t.playNowBtn}</div>
          </div>
        </div>
      `),
      );
    });
    initGameTilt();

    document.getElementById("howSub").textContent = t.howSub;
    document.getElementById("howTitle").textContent = t.howTitle;
    const stepsRow = document.getElementById("stepsRow");
    stepsRow.innerHTML = "";
    t.steps.forEach((s, i) => {
      const icon = stepIcons[i];
      stepsRow.appendChild(
        el(`
        <div class="sb-step">
          <div class="sb-step-icon-wrap">
            <div class="sb-step-num">${Number(s.n)}</div>
            <div class="sb-step-icon" style="--glow:${icon.color};">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${icon.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>
            </div>
          </div>
          <h3 class="sb-step-title">${s.title}</h3>
          <p class="sb-step-desc">${s.desc}</p>
        </div>
      `),
      );
    });

    document.getElementById("ctaSub").textContent = t.ctaSub;
    document.getElementById("ctaTitle").textContent = t.ctaTitle;
    document.getElementById("ctaDesc").textContent = t.ctaDesc;

    document.getElementById("footerPrivacy").textContent = t.footerPrivacy;
    document.getElementById("footerTerms").textContent = t.footerTerms;
    document.getElementById("footerContact").textContent = t.footerContact;
    document.getElementById("footerRights").textContent = t.footerRights;
  }

  function animateStat(key, target, duration, elId, formatter) {
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = Math.round(ease * target);
      state[key] = val;
      const el = document.getElementById(elId);
      if (el) el.textContent = formatter(val);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initStats() {
    const statsEl = document.getElementById("stats-section");
    if (!statsEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStat("stat1", 50000, 2200, "stat1Value", (v) =>
              v >= 1000 ? Math.floor(v / 1000) + "K+" : v + "+",
            );
            animateStat("stat2", 10, 1400, "stat2Value", (v) => v + "+");
            animateStat("stat3", 98, 1800, "stat3Value", (v) => v + "%");
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(statsEl);
  }

  function updateLiveCountText() {
    const el = document.getElementById("liveCountText");
    if (el) el.textContent = state.liveCount.toLocaleString("en-US");
  }

  function animateLiveCount(from, to, duration, onDone) {
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      state.liveCount = Math.round(from + ease * (to - from));
      updateLiveCountText();
      if (t < 1) requestAnimationFrame(tick);
      else if (onDone) onDone();
    };
    requestAnimationFrame(tick);
  }

  function startLiveCounter() {
    animateLiveCount(10842, 12605, 2400, () => {
      liveTickInterval = setInterval(() => {
        state.liveCount += Math.floor(Math.random() * 3 + 1);
        updateLiveCountText();
      }, 3500);
    });
  }

  function initGameTilt() {
    const cards = Array.from(document.querySelectorAll(".sb-game-card"));
    cards.forEach((cardEl) => {
      cardEl.addEventListener("mouseenter", () => {
        cardEl.style.zIndex = "5";
        cards.forEach((other) => {
          if (other !== cardEl) other.classList.add("sb-game-card--back");
        });
      });
      cardEl.addEventListener("mousemove", (e) => {
        const rect = cardEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardEl.style.transition = "transform 0.08s";
        cardEl.style.transform = `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.1)`;
        cardEl.style.boxShadow = `0 12px 24px rgba(124,58,237,.18), ${x * 6}px ${y * 6}px 16px rgba(0,119,170,.2)`;
        const img = cardEl.querySelector("img");
        if (img)
          img.style.transform = `scale(1.08) translate(${x * 6}px,${y * 6}px)`;
      });
      cardEl.addEventListener("mouseleave", () => {
        cardEl.style.transition = "transform .45s ease, box-shadow .45s ease";
        cardEl.style.transform =
          "perspective(700px) rotateX(0) rotateY(0) scale(1)";
        cardEl.style.boxShadow = "";
        cardEl.style.zIndex = "";
        cards.forEach((other) => other.classList.remove("sb-game-card--back"));
        const img = cardEl.querySelector("img");
        if (img) {
          img.style.transition = "transform .45s ease";
          img.style.transform = "";
        }
      });
    });
  }

  function copyCode() {
    const referralLink = getReferralLink();
    const onSuccess = () => {
      state.copied = true;
      render();
      setTimeout(() => {
        state.copied = false;
        render();
      }, 2500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(referralLink)
        .then(onSuccess)
        .catch(() => copyFallback(referralLink, onSuccess));
    } else {
      copyFallback(referralLink, onSuccess);
    }
  }

  function copyFallback(text, cb) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      cb();
    } catch (e) {
      /* clipboard unsupported */
    }
    document.body.removeChild(textarea);
  }

  function initStars() {
    const container = document.getElementById("hero-stars");
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 70; i++) {
      const dot = document.createElement("div");
      const size = (Math.random() * 2.4 + 0.5).toFixed(1);
      const teal = Math.random() > 0.52;
      const dur = (2.5 + Math.random() * 4.5).toFixed(1);
      const delay = (Math.random() * 7).toFixed(1);
      const alpha = (Math.random() * 0.6 + 0.3).toFixed(2);
      dot.style.cssText = [
        "position:absolute",
        `width:${size}px`,
        `height:${size}px`,
        "border-radius:50%",
        `background:${teal ? `rgba(0,232,200,${alpha})` : `rgba(0,212,255,${alpha})`}`,
        `left:${(Math.random() * 100).toFixed(1)}%`,
        `top:${(Math.random() * 100).toFixed(1)}%`,
        `animation:starBlink ${dur}s ease-in-out ${delay}s infinite`,
        "pointer-events:none",
      ].join(";");
      frag.appendChild(dot);
    }
    container.appendChild(frag);
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

  // Single hook point for wiring the captured referral/attribution data to a
  // real backend or PlayFab later (e.g. PlayFabClientAPI login + AddPlayerTag,
  // or a POST to SOHBA_CONFIG.apiBaseUrl). No-op until one of those exists.
  function syncAttributionToBackend(attribution) {
    if (!SOHBA_CONFIG.apiBaseUrl && !SOHBA_CONFIG.playfabTitleId) return;
  }

  function initReferralCode() {
    const pathMatch = window.location.pathname.match(/\/i\/([^/?#]+)/i);
    const params = new URLSearchParams(window.location.search);
    let code =
      (pathMatch && pathMatch[1]) ||
      params.get("code") ||
      params.get("ref") ||
      "";

    const incomingUtm = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    };
    const hasIncomingUtm = Object.values(incomingUtm).some(Boolean);

    let attribution = {};
    try {
      attribution =
        JSON.parse(localStorage.getItem("sohba_attribution") || "{}") || {};
    } catch (e) {
      attribution = {};
    }

    if (code) {
      code = code.toUpperCase();
      localStorage.setItem("sohba_referral_code", code);
      localStorage.setItem("sohba_referral_ts", String(Date.now()));
      attribution = {
        code,
        capturedAt: Date.now(),
        ...(hasIncomingUtm ? incomingUtm : attribution),
      };
      localStorage.setItem("sohba_attribution", JSON.stringify(attribution));
    } else {
      code = localStorage.getItem("sohba_referral_code") || "5BKCKW";
    }

    const alpha = code.replace(/[^a-zA-Z]/g, "");
    const inviterName =
      alpha.length >= 2
        ? alpha.charAt(0).toUpperCase() + alpha.slice(1, 9).toLowerCase()
        : null;

    state.referralCode = code;
    state.inviterName = inviterName;

    syncAttributionToBackend(attribution);
  }

  function bindEvents() {
    document.getElementById("langToggleBtn").addEventListener("click", () => {
      state.lang = state.lang === "ar" ? "en" : "ar";
      render();
    });
    document.getElementById("copyCodeBtn").addEventListener("click", copyCode);
    document
      .getElementById("ctaCopyCodeBtn")
      .addEventListener("click", copyCode);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReferralCode();
    bindEvents();
    render();
    initScrollReveal();
    initStars();
    startLiveCounter();
    initStats();
  });

  // Stable read-only surface for a future app WebView bridge or backend
  // integration to pull the captured referral/attribution data.
  window.Sohba = {
    getReferralCode: () => state.referralCode,
    getReferralLink,
    getAttribution: () => {
      try {
        return JSON.parse(localStorage.getItem("sohba_attribution") || "{}");
      } catch (e) {
        return {};
      }
    },
    config: SOHBA_CONFIG,
  };
})();
