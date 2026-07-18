/* ============================================================
   Tensoramax — main.js
   Site behavior: nav, reveals, counters, clock, footer net
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    year();
    navScroll();
    scrollProgress();
    mobileMenu();
    revealObserver();
    counters();
    accordions();
    smoothScroll();
    parallax();
    particles();
    footerClock();
    initNetworks();
    themeToggle();
    activeNav();
  }

  /* ---- Theme (dark mode) ---- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("tm-theme", t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#161210" : "#F6F0E6");
    if (window.__heroNet) { window.__heroNet.theme = t; window.__heroNet.draw(); }
  }
  function themeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    btn.addEventListener("click", () => {
      if (!reduce) {
        document.documentElement.classList.add("theme-transitioning");
        setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 450);
      }
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
    // follow the OS preference only if the user hasn't explicitly chosen
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      let stored = null;
      try { stored = localStorage.getItem("tm-theme"); } catch (e2) {}
      if (stored) return;
      applyTheme(e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---- Year ---- */
  function year() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---- Sticky nav state ---- */
  function navScroll() {
    const nav = $(".nav");
    if (!nav) return;
    const apply = () => nav.classList.toggle("scrolled", globalScroll() > 24);
    apply();
    window.addEventListener("scroll", apply, { passive: true });
  }
  function globalScroll() {
    return window.scrollY || document.documentElement.scrollTop;
  }

  /* ---- Reading progress bar ---- */
  function scrollProgress() {
    const bar = $(".scroll-progress");
    if (!bar) return;
    const upd = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (globalScroll() / max) * 100 : 0) + "%";
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
  }

  /* ---- Mobile menu ---- */
  function mobileMenu() {
    const toggle = $(".nav-toggle");
    if (!toggle) return;
    const close = () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---- Scroll reveal with stagger ---- */
  function revealObserver() {
    // auto-assign stagger index per parent group
    const groups = new Map();
    $$("[data-reveal]").forEach((el) => {
      const p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });
    groups.forEach((arr) => arr.forEach((el, i) => el.style.setProperty("--i", i % 8)));

    if (reduce || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    $$("[data-reveal]").forEach((el) => obs.observe(el));
  }

  /* ---- Animated counters ---- */
  function counters() {
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const dur = parseInt(el.dataset.duration || "1800", 10);
      const suf = el.dataset.suffix || "";
      const pre = el.dataset.prefix || "";
      let started = false;
      const fmt = (n) =>
        pre +
        n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        suf;
      if (reduce) { el.textContent = fmt(target); return; }
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !started) {
              started = true;
              const start = performance.now();
              const tick = (now) => {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = fmt(target * eased);
                if (p < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
    });
  }

  /* ---- Accordions (FAQ + logs + generic) ---- */
  function accordions() {
    $$(".faq-q, .log-head, [data-accordion] .acc-head").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item, .log-item, [data-accordion]");
        if (!item) return;
        const open = item.classList.toggle("open");
        if (btn.tagName === "BUTTON") btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---- Smooth in-page anchors ---- */
  function smoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      a.addEventListener("click", (e) => {
        const target = document.getElementById(id.slice(1));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
        const top = target.getBoundingClientRect().top + globalScroll() - navH - 12;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ---- Parallax ---- */
  function parallax() {
    if (reduce) return;
    const els = $$("[data-parallax]");
    if (!els.length) return;
    const onScroll = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const off = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Floating particles ---- */
  function particles() {
    if (reduce) return;
    $$(".particles").forEach((wrap) => {
      const n = parseInt(wrap.dataset.count || "14", 10);
      for (let i = 0; i < n; i++) {
        const p = document.createElement("span");
        p.className = "particle";
        const size = 3 + Math.random() * 6;
        p.style.cssText = `
          width:${size}px;height:${size}px;
          left:${Math.random() * 100}%;top:${Math.random() * 100}%;
          opacity:${0.06 + Math.random() * 0.16};
          animation:floatSlow ${9 + Math.random() * 10}s ease-in-out ${-Math.random() * 8}s infinite;`;
        wrap.appendChild(p);
      }
    });
  }

  /* ---- Footer live clock (UTC) ---- */
  function footerClock() {
    const el = $("#footer-clock");
    if (!el) return;
    const tick = () => {
      const d = new Date();
      const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      const hh = String(utc.getHours()).padStart(2, "0");
      const mm = String(utc.getMinutes()).padStart(2, "0");
      const ss = String(utc.getSeconds()).padStart(2, "0");
      el.textContent = `${hh}:${mm}:${ss} UTC`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Animated networks ---- */
  function initNetworks() {
    if (!window.NeuralNetwork) return;
    const hero = $("#hero-network");
    if (hero) {
      // Responsive topology: phones get fewer, larger, more legible nodes
      const mobile = window.innerWidth < 760;
      const tablet = window.innerWidth < 1024;
      const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const net = new NeuralNetwork(hero, {
        theme: currentTheme(),
        layers: mobile ? [3, 5, 4, 3] : tablet ? [3, 5, 6, 5, 3] : [3, 5, 7, 6, 4],
        nodeScale: mobile ? 1.9 : tablet ? 1.25 : 1,
        amp: mobile ? 5 : 7,
        interactive: hasHover, // avoid intercepting touch scroll on phones
        spawnRate: 0.12,
      });
      window.__heroNet = net; // expose so theme toggle can recolor it live
      net.start();
      // pause when off-screen for performance
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? net.start() : net.stop()));
      io.observe(hero);
    }
    const footer = $("#footer-network");
    if (footer) {
      const mobile = window.innerWidth < 760;
      const net = new NeuralNetwork(footer, {
        theme: "dark",
        layers: mobile ? [4, 6, 5, 3] : [6, 8, 7, 5],
        nodeScale: mobile ? 1.5 : 1,
        amp: mobile ? 5 : 7,
        interactive: false,
        spawnRate: 0.14,
      });
      net.start();
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? net.start() : net.stop()));
      io.observe(footer);
    }
  }

  /* ---- Active nav link from current page ---- */
  function activeNav() {
    let page = location.pathname.split("/").pop();
    if (!page || page === "") page = "index.html";
    $$(".nav-links a, .mobile-menu a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === page) a.classList.add("active");
    });
  }
})();
