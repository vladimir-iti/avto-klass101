(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Header: сжатие при скролле
     --------------------------------------------------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    // Гистерезис: порог сжатия заметно выше порога возврата. Без этого
    // сжатие шапки уменьшает высоту документа, страница «отыгрывает» скролл
    // назад за порог, класс снимается — и шапка начинает дрожать.
    // Разрыв между порогами должен превышать разницу высот шапки.
    var SHRINK_AT = 96;
    var GROW_AT = 24;
    var ticking = false;

    var applyHeaderState = function () {
      ticking = false;
      var y = window.scrollY;
      if (header.classList.contains('is-scrolled')) {
        if (y < GROW_AT) header.classList.remove('is-scrolled');
      } else if (y > SHRINK_AT) {
        header.classList.add('is-scrolled');
      }
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyHeaderState);
    };

    applyHeaderState();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Мобильное меню
     --------------------------------------------------------------------- */
  var toggleBtn = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var navReturnFocus = null;

  function navFocusable() {
    return mobileNav ? Array.prototype.filter.call(
      mobileNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.hidden; }
    ) : [];
  }

  function openNav() {
    if (!mobileNav) return;
    navReturnFocus = document.activeElement;
    mobileNav.hidden = false;
    requestAnimationFrame(function () {
      mobileNav.classList.add('is-open');
    });
    document.body.classList.add('nav-open');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'true');
    var focusable = navFocusable();
    if (focusable[0]) focusable[0].focus({ preventScroll: true });
  }

  function closeNav(restoreFocus) {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () {
      if (!mobileNav.classList.contains('is-open')) mobileNav.hidden = true;
    }, reducedMotion ? 0 : 420);
    if (restoreFocus !== false && navReturnFocus && typeof navReturnFocus.focus === 'function') {
      navReturnFocus.focus({ preventScroll: true });
    }
    navReturnFocus = null;
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openNav);
  document.addEventListener('click', function (e) {
    var closer = e.target.closest && e.target.closest('[data-nav-close]');
    if (closer) closeNav(closer.tagName === 'BUTTON');
  });
  document.addEventListener('keydown', function (e) {
    if (!mobileNav || !mobileNav.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNav(true);
    } else if (e.key === 'Tab') {
      var focusable = navFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* Десктопный disclosure «Направления». */
  var dropdown = document.querySelector('.nav-dropdown');
  var dropdownBtn = dropdown && dropdown.querySelector('.has-menu');
  function setDropdownExpanded(expanded) {
    if (!dropdownBtn || !dropdown) return;
    dropdownBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    dropdown.classList.toggle('is-expanded', expanded);
  }
  if (dropdown && dropdownBtn) {
    dropdownBtn.addEventListener('click', function () {
      setDropdownExpanded(true);
    });
    dropdown.addEventListener('mouseenter', function () { setDropdownExpanded(true); });
    dropdown.addEventListener('mouseleave', function () { setDropdownExpanded(false); });
    dropdown.addEventListener('focusin', function () { setDropdownExpanded(true); });
    dropdown.addEventListener('focusout', function (e) {
      if (!dropdown.contains(e.relatedTarget)) setDropdownExpanded(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdownBtn.getAttribute('aria-expanded') === 'true') {
        setDropdownExpanded(false);
        dropdownBtn.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Открытие формы заявки по ссылкам data-open-lead
     --------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-open-lead]');
    if (!link) return;
    var targetSelector = link.getAttribute('href');
    if (!targetSelector || targetSelector.charAt(0) !== '#') return;
    var target = document.querySelector(targetSelector);
    if (!target) return;
    window.setTimeout(function () {
      var input = target.querySelector('input[name="name"]');
      if (input) input.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 500);
  });

  /* ---------------------------------------------------------------------
     FAQ: анимация высоты <details>
     --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var panel = item.querySelector('[data-anim]');
    if (!panel) return;

    item.addEventListener('toggle', function () {
      if (panel._faqTransitionEnd) {
        panel.removeEventListener('transitionend', panel._faqTransitionEnd);
        panel._faqTransitionEnd = null;
      }
      if (reducedMotion) {
        panel.style.height = item.open ? 'auto' : '0px';
        return;
      }
      if (item.open) {
        var h = panel.scrollHeight;
        panel.style.height = '0px';
        requestAnimationFrame(function () {
          panel.style.height = h + 'px';
        });
        var onEnd = function (event) {
          if (event.target !== panel || event.propertyName !== 'height') return;
          panel.style.height = 'auto';
          panel.removeEventListener('transitionend', onEnd);
          panel._faqTransitionEnd = null;
        };
        panel._faqTransitionEnd = onEnd;
        panel.addEventListener('transitionend', onEnd);
      } else {
        panel.style.height = '0px';
      }
    });
  });

  /* ---------------------------------------------------------------------
     Плавное появление блоков при прокрутке
     --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------
     Professional: подсветка активного пункта саб-нава при скролле
     --------------------------------------------------------------------- */
  var subnavLinks = document.querySelectorAll('.subnav__link');
  var catSections = document.querySelectorAll('.cat-section[id]');
  if (subnavLinks.length && catSections.length && 'IntersectionObserver' in window) {
    var byId = {};
    subnavLinks.forEach(function (a) {
      byId[a.getAttribute('href').replace('#', '')] = a;
    });
    var subIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            subnavLinks.forEach(function (a) { a.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    catSections.forEach(function (s) { subIo.observe(s); });
  }

  /* ---------------------------------------------------------------------
     Переход по якорям с учётом высоты фиксированной шапки (и саб-нава
     на странице «Профессиональные категории»). Не полагаемся только на
     нативный scroll-margin-top — считаем смещение явно и сами скроллим,
     это работает одинаково надёжно и по клику, и при прямом открытии
     ссылки вида /professional/#ce.
     --------------------------------------------------------------------- */
  function headerOffset() {
    var h = header ? header.getBoundingClientRect().height : 0;
    var subnav = document.querySelector('.subnav');
    var s = subnav ? subnav.getBoundingClientRect().height : 0;
    return h + s + 16;
  }

  function scrollToHash(hash, behavior) {
    if (!hash || hash === '#') return false;
    var id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch (error) {
      return false;
    }
    var target = document.getElementById(id);
    if (!target) return false;
    var top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: reducedMotion ? 'auto' : (behavior || 'smooth') });
    return true;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    if (scrollToHash(hash)) {
      e.preventDefault();
      history.pushState(null, '', hash);
    }
  });

  // Прямое открытие страницы с якорем (например /professional/#ce)
  if (window.location.hash) {
    window.setTimeout(function () {
      scrollToHash(window.location.hash, 'auto');
    }, 60);
  }

  /* ---------------------------------------------------------------------
     Видео тракторной площадки: воспроизведение по клику
     --------------------------------------------------------------------- */
  document.querySelectorAll('.video-block').forEach(function (block) {
    var video = block.querySelector('video');
    var playBtn = block.querySelector('.video-block__play');
    if (!video || !playBtn) return;
    playBtn.addEventListener('click', function () {
      video.controls = true;
      var playAttempt = video.play();
      if (playAttempt && typeof playAttempt.then === 'function') {
        playAttempt.then(function () {
          block.classList.add('is-playing');
        }).catch(function () {
          video.controls = false;
          block.classList.remove('is-playing');
        });
      } else {
        block.classList.add('is-playing');
      }
    });
  });
})();
