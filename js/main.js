/* ============================================================
   main.js — 共通スクリプト / notemo.net
   ============================================================ */

(function () {
  'use strict';

  /* --- ハンバーガーメニュー --- */
  const hamburger = document.querySelector('.header__hamburger');
  const spMenu    = document.querySelector('.header__sp-menu');

  if (hamburger && spMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('is-open');
      spMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // メニューリンクをクリックで閉じる
    spMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        spMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- スクロールでヘッダーに影を付ける --- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* --- アクティブナビリンク --- */
  (function setActiveNav() {
    const path  = window.location.pathname;
    const links = document.querySelectorAll('.header__nav-list a, .header__sp-menu a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const isRoot   = (path === '/' || path.endsWith('index.html')) && (href === '/' || href === './index.html' || href === 'index.html');
      const isMatch  = href !== '/' && href !== 'index.html' && path.includes(href.replace('.html', ''));
      if (isRoot || isMatch) {
        link.setAttribute('aria-current', 'page');
        link.style.color = 'var(--color-accent)';
      }
    });
  })();

  /* --- スムーススクロール（ページ内アンカー） --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
