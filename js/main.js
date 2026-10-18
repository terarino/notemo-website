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
    // href は相対パス (../services.html, ./ など) なので、絶対パスに解決してから比べる。
    // /services と /services.html、/blog/ と /blog/index.html は同じページとして扱う
    const normalize = function (p) { return p.replace(/index\.html$/, '').replace(/\.html$/, ''); };
    const here  = normalize(window.location.pathname);
    const links = document.querySelectorAll('.header__nav-list a, .header__sp-menu a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const target = normalize(new URL(href, window.location.href).pathname);
      // ブログは記事ページ (/blog/xxx.html) でも「ブログ」を現在地にする
      const isMatch = target === here || (target === '/blog/' && here.indexOf('/blog/') === 0);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
        link.style.color = 'var(--color-accent)';
      }
    });
  })();

  /* --- ブログ一覧のカテゴリ絞り込み (blog/index.html) --- */
  (function setupBlogFilter() {
    const filter = document.querySelector('.blog-filter');
    const list   = document.querySelector('.blog-list');
    if (!filter || !list) return;
    const buttons = filter.querySelectorAll('.blog-filter__btn');
    const cards   = list.querySelectorAll('.blog-card[data-category]');
    const empty   = document.querySelector('.blog-filter__empty');

    function apply(category) {
      let last  = null;
      let count = 0;
      cards.forEach(function (card) {
        const show = !category || card.dataset.category === category;
        card.hidden = !show;
        card.classList.remove('is-last');
        if (show) { last = card; count++; }
      });
      if (last) last.classList.add('is-last');
      list.classList.toggle('is-filtered', !!category);
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.dataset.category === category));
      });
      if (empty) empty.hidden = count > 0;
    }

    filter.addEventListener('click', function (e) {
      const btn = e.target.closest('.blog-filter__btn');
      if (!btn) return;
      const category = btn.dataset.category;
      apply(category);
      // 絞り込んだ状態を URL に残す (共有・戻る用)。ページ位置は動かさない
      const url = window.location.pathname + window.location.search + (category ? '#' + encodeURIComponent(category) : '');
      history.replaceState(null, '', url);
    });

    // URL の #EC などで表示を絞り込む (知らないカテゴリなら「すべて」)
    function applyFromHash() {
      let category = '';
      try { category = decodeURIComponent(window.location.hash.slice(1)); } catch (err) { category = ''; }
      const known = Array.prototype.some.call(buttons, function (btn) { return btn.dataset.category === category; });
      apply(known ? category : '');
    }
    window.addEventListener('hashchange', applyFromHash);
    applyFromHash();
  })();

  /* --- スムーススクロール（ページ内アンカー） --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      let target = null;
      try { target = document.querySelector(this.getAttribute('href')); } catch (err) { target = null; }
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
