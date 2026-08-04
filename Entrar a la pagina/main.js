(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* -----------------------------------------------------------
     Loader — plays on first load AND every slide transition.
     playLoader(onContentDone, onFullyHidden):
       onContentDone fires while the loader still fully covers the
       screen (the caller swaps slide content behind it here).
       onFullyHidden fires once the loader has faded away.
     The very first play (the initial page load) runs a short ~4s, two-beat
     intro: the combined placeholder (mark + tagline + wordmark, standing in
     for the pending single PNG), then the mark alone — before the curtain
     opens onto the first photo. Every later play (slide-to-slide
     navigation) runs the even shorter single-beat version so clicking
     around the site stays snappy; only the first-ever visit gets the intro.
  ----------------------------------------------------------- */
  var hasPlayedIntro = false;

  function playLoader(onContentDone, onFullyHidden) {
    var loader = $("[data-loader]");
    if (!loader) {
      safe(onContentDone, "loader:onContentDone");
      safe(onFullyHidden, "loader:onFullyHidden");
      return;
    }
    var mark = $("[data-loader-solo]", loader);
    var beat1 = $("[data-loader-beat1]", loader);
    var beat2 = $("[data-loader-beat2]", loader);
    var timers = [];
    var isFirstPlay = !hasPlayedIntro;
    hasPlayedIntro = true;

    function schedule(fn, delay) { timers.push(setTimeout(fn, delay)); }
    function clearTimers() {
      for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
      timers = [];
    }

    function resetLoader() {
      clearTimers();
      loader.classList.remove("is-playing", "is-hiding", "is-quick", "is-brief");
      if (mark) mark.classList.remove("is-visible");
      if (beat1) beat1.classList.remove("is-visible");
      if (beat2) beat2.classList.remove("is-visible");
      void loader.offsetWidth;
    }

    // Always plays in full — deliberately NOT shortened for
    // prefers-reduced-motion. This is a one-time entrance sequence, not a
    // loop or autoplay video, and Windows ships reduced-motion ON by default
    // in many setups; gating it here would mean most Windows visitors never
    // see the slow load at all (see 07-windows-troubleshooting.md gotcha).
    //
    // The loader is opaque by default in CSS (not shown via a JS-added class),
    // so on the very first page load it's already covering the screen before
    // this function even runs — no flash of the page underneath is possible.
    // "is-out" is only ever added AFTER a hide, so removing it here is a no-op
    // the first time and a quick fade-back-in on later slide transitions.
    resetLoader();
    loader.classList.remove("is-out");
    void loader.offsetWidth;
    loader.classList.add("is-playing");

    var contentDuration;

    if (isFirstPlay) {
      // ~4s total, two beats, no dead time between them. .is-brief switches
      // the beats and curtain to their own (short but not abrupt) transition
      // durations — see CSS.
      loader.classList.add("is-brief");
      // Beat 1: mark + tagline — fades in smoothly, holds ~2s on screen
      // (fade-in + hold + fade-out together), then fades out.
      schedule(function () { if (beat1) beat1.classList.add("is-visible"); }, 150);
      schedule(function () { if (beat1) beat1.classList.remove("is-visible"); }, 1600);
      // Beat 2: mark + "JADE HAUS ARQ." wordmark, ~1s, starting as beat 1
      // finishes clearing — then straight into the curtain opening onto the
      // first photo.
      schedule(function () { if (beat2) beat2.classList.add("is-visible"); }, 1750);
      schedule(function () { if (beat2) beat2.classList.remove("is-visible"); }, 2650);

      contentDuration = 3150;
    } else {
      // Slide-to-slide navigation: the intro is a one-time first
      // impression, not something to replay on every click — this is just a
      // quick brand flash (mark only, fast fade) so moving around the site
      // stays snappy. .is-quick switches the mark and curtain to much
      // shorter transition durations (see CSS).
      loader.classList.add("is-quick");
      schedule(function () { if (mark) mark.classList.add("is-visible"); }, 60);
      schedule(function () { if (mark) mark.classList.remove("is-visible"); }, 550);

      contentDuration = 950;
    }

    // Exit: cortina se desliza de derecha a izquierda, lento y suave
    var hideBuffer = isFirstPlay ? 2200 : 900;
    schedule(function () {
      safe(onContentDone, "loader:onContentDone");
      loader.classList.add("is-hiding");
      schedule(function () {
        loader.classList.add("is-out");
        resetLoader();
        safe(onFullyHidden, "loader:onFullyHidden");
      }, hideBuffer);
    }, contentDuration);
  }

  /* -----------------------------------------------------------
     Slide reveal / un-reveal (replays every time a slide is shown)
  ----------------------------------------------------------- */
  function revealSlide(slideEl) {
    if (!slideEl) return;
    // Transición simple: elementos aparecen gradualmente
    var els = $$("[data-reveal], [data-reveal-mask]", slideEl);

    // Delay para que empiece mientras el loader se va
    var initialDelay = 500;

    els.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add("is-revealed");
      }, initialDelay + (i * 80));
    });
    if (slideEl.getAttribute("data-slide") === "1") safe(triggerCountUp, "triggerCountUp");
  }
  function unrevealSlide(slideEl) {
    if (!slideEl) return;
    $$("[data-reveal], [data-reveal-mask]", slideEl).forEach(function (el) { el.classList.remove("is-revealed"); });
    $$("[data-count-to]", slideEl).forEach(function (el) { el.textContent = "0"; });
  }
  // Small vanilla tween (no GSAP dependency — that was 72KB parsed/executed
  // on every page load just for this one count-up effect).
  function easeOutPower2(t) { return 1 - (1 - t) * (1 - t); }
  function triggerCountUp() {
    $$("[data-count-to]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (reduced) { el.textContent = target; return; }
      var duration = 1300;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min(1, (ts - start) / duration);
        el.textContent = Math.round(target * easeOutPower2(progress));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* -----------------------------------------------------------
     Slideshow controller — one slide visible at a time, no free scroll.
     Navigation only via menu/footer links, or auto-advance when idle.
  ----------------------------------------------------------- */
  var slides = [];
  var currentIndex = 0;
  var AUTO_ADVANCE_MS = 8000;
  var autoTimer = null;
  var autoBar = null;

  function updateNavForSlide(i) {
    var nav = $(".nav");
    if (nav) nav.classList.toggle("is-scrolled", i !== 0);
    document.documentElement.setAttribute("data-active-slide", String(i));
  }

  // Auto-cycling between sections (Inicio → Nosotros → Catálogo → Contacto
  // → …) is deliberately gone — that's what made closing a catálogo feel
  // like "the page reloaded": the timer would restart, and if it fired
  // before you navigated again, the full loader played for an auto-advance
  // you never asked for. Home now has its own independent 3-photo loop
  // (see startHeroLoop) instead. These two functions are kept as harmless
  // no-ops rather than removed outright — they're called from over a dozen
  // places (panel open/close, slide changes, etc.) and turning them into
  // no-ops here is far lower-risk than touching every call site.
  function clearAutoAdvance() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    if (autoBar) {
      autoBar.classList.remove("is-filling");
      void autoBar.offsetWidth;
    }
  }
  function startAutoAdvance() {
    clearAutoAdvance();
  }

  // Home's own independent background loop — the 3 category photos
  // crossfading in a continuous rotation, each with its own slow Ken Burns
  // breathe (CSS). Runs once, forever, from boot — separate from slide
  // navigation entirely, so opening/closing panels or moving between
  // sections never touches it. Deliberately NOT gated by
  // prefers-reduced-motion, same reasoning as the intro loader: this is the
  // only way the other 2 categories are ever shown on Home at all (it's
  // content rotation, not just decoration), and Windows ships
  // reduced-motion ON by default in many setups — gating it would mean most
  // Windows visitors never see anything but the first photo.
  var HERO_LOOP_MS = 6500;
  var heroLoopTimer = null;
  function startHeroLoop() {
    // On mobile/tablet the loop is just 3 photos — az-geo/az-clasico carry
    // data-desktop-only and are display:none there (see the 1024px rule in
    // styles.css) — excluding them here too, not just visually hiding them,
    // so the loop never spends one of its 6.5s beats "showing" a hidden
    // slide (which would look like the loop randomly going blank).
    var isMobile = window.matchMedia("(max-width: 1024px)").matches;
    var heroImgs = $$(".hero-media-img").filter(function (img) {
      return !(isMobile && img.hasAttribute("data-desktop-only"));
    });
    if (heroImgs.length < 2) return;
    var i = 0;
    (function tick() {
      heroLoopTimer = setTimeout(function () {
        i = (i + 1) % heroImgs.length;
        heroImgs.forEach(function (img, di) { img.classList.toggle("is-active", di === i); });
        tick();
      }, HERO_LOOP_MS);
    })();
  }

  function showSlide(index, opts) {
    if (!slides.length) return;
    opts = opts || {};
    index = ((index % slides.length) + slides.length) % slides.length;
    if (index === currentIndex && !opts.force) { startAutoAdvance(); return; }
    clearAutoAdvance();
    playLoader(function () {
      var outgoing = slides[currentIndex];
      outgoing.classList.remove("is-active");
      safe(function () { unrevealSlide(outgoing); }, "unrevealSlide");
      currentIndex = index;
      var incoming = slides[currentIndex];
      incoming.classList.add("is-active");
      updateNavForSlide(currentIndex);
      // Swapped in now (while still hidden behind the loader), but not
      // revealed yet — see the reveal call in the onFullyHidden callback below.
    }, function () {
      // Wait until the loader has fully wiped away before revealing content,
      // so the two motions read as one clean beat instead of the page-wipe
      // and the per-element fade-ins fighting for attention at the same time.
      safe(function () { revealSlide(slides[currentIndex]); }, "revealSlide");
      startAutoAdvance();
    });
  }

  // Direct jump to a slide with NO loader (no JH mark, no curtain) — just a
  // quick crossfade. Used by the header's "go to catálogo" button, which is
  // meant to feel immediate, not like re-running the intro. .slide itself
  // stays at transition:0s everywhere else (that's what keeps the loader-
  // driven crossfade from ever bleeding through the curtain wipe) — the
  // fade here comes from a class added only for this one transition, then
  // removed once it's done so it can't affect the loader-based path later.
  // From the Hero specifically, the "go to catálogo" jump uses a shared-
  // element style transition instead of a plain crossfade: the hero photo
  // itself visually shrinks from filling the screen down into the exact
  // spot the Celosías card sits in the catalog, while the dark background
  // and the other two cards fade in around it — the same photo "becomes"
  // the card instead of one screen just replacing another.
  function heroToCatalogoTransition() {
    // Whichever of the 3 rotating hero photos is currently showing — that's
    // the one the user is actually looking at right now, so that's the one
    // that should visually "become" the card.
    var heroImg = $(".hero-media-img.is-active") || $(".hero-media-img");
    var catalogoSlide = slides[2];
    var celosiasCard = catalogoSlide && $('.cat-card', catalogoSlide);
    // showSlideDirect(2, true) below, not showSlideDirect(2) — currentIndex
    // is still 0 at this point, and showSlideDirect's own index===2 &&
    // currentIndex===0 special case would otherwise call straight back into
    // this same function, an infinite loop. The `true` skips that check.
    if (!heroImg || !catalogoSlide || !celosiasCard) { showSlideDirect(2, true); return; }

    // The flip only reads right when the active slide is the Celosías one —
    // celosiasCard is always the first .cat-card (Celosías), so flying any
    // of the other rotating hero photos (geométricos, clásicos, or the
    // ambiance shots with no card of their own) into it lands on a visibly
    // different photo, a jarring mismatch/"jump" right as it lands. Checked
    // against the <img> tag's own src ATTRIBUTE (always "hero-celosias.webp"
    // for this slide, written once in the HTML), not currentSrc — currentSrc
    // reflects whichever <source> the browser picked for the viewport (the
    // mobile crop can be a completely different filename with no shared
    // naming pattern to the desktop one, e.g. hero-terracota-pileta-mobile.
    // webp), so it can't be used to identify which slide this is.
    var activeFile = heroImg.getAttribute("src").split("/").pop();
    if (activeFile !== "hero-celosias.webp") { showSlideDirect(2, true); return; }

    clearAutoAdvance();
    var outgoing = slides[currentIndex];
    outgoing.classList.remove("is-active");
    safe(function () { unrevealSlide(outgoing); }, "unrevealSlide");
    currentIndex = 2;
    catalogoSlide.classList.add("is-active");
    updateNavForSlide(currentIndex);

    // Hide just the Celosías card (not the rest of the slider, which fades
    // in normally below) until the ghost image lands. Opacity (not
    // visibility) so the handoff below can crossfade instead of popping —
    // the real card carries the dark gradient + "Celosías" label the bare
    // ghost photo doesn't, so swapping them instantly looked like a jarring
    // flash of text and shadow appearing out of nowhere.
    celosiasCard.style.opacity = "0";
    celosiasCard.style.transition = "none";
    // The heading gets its normal graceful fade-in. The slider wrapper
    // itself, though, skips straight to visible instead of running its own
    // 1s fade — that fade is meant for a plain slide entrance, and here it
    // was compounding with the Celosías card's own crossfade below (both
    // animating opacity on the same element at once), muddying the photo
    // during the handoff instead of a clean, deliberate reveal.
    var heading = $("h2[data-reveal]", catalogoSlide);
    var sliderWrap = $(".slider--catalogo", catalogoSlide);
    setTimeout(function () {
      safe(function () { if (heading) heading.classList.add("is-revealed"); }, "revealSlide:heading");
    }, 200);
    if (sliderWrap) {
      // Mark it revealed (so the normal system takes over correctly next
      // time this slide enters/exits the ordinary way) but hold it at
      // opacity 1 with no transition for now, then drop the inline override
      // once the handoff below is done — otherwise this lingering inline
      // style would permanently block its own [data-reveal] fade on every
      // later visit to this slide via the regular loader-based navigation.
      sliderWrap.classList.add("is-revealed");
      sliderWrap.style.transition = "none";
      sliderWrap.style.opacity = "1";
    }

    var toRect = celosiasCard.getBoundingClientRect();
    // The hero's own container (not a plain viewport rect) — .hero-media is
    // deliberately oversized (top:-18%, height:136%) and clipped so the
    // photo can breathe/zoom without ever showing an edge. Using ITS real
    // rect as the starting point, instead of assuming the ghost should just
    // "cover the viewport," is what fixed the worst of this: a viewport-
    // cover scale forced onto a portrait-card-shaped box was blowing up
    // into an absurd, over-zoomed crop wherever the screen was much wider
    // than the card (see the FLIP scale/translate math this replaced).
    var heroMedia = $(".hero-media");
    var fromRect = heroMedia ? heroMedia.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    var ghost = document.createElement("img");
    ghost.src = heroImg.currentSrc || heroImg.src;
    ghost.setAttribute("aria-hidden", "true");
    ghost.className = "hero-flip-ghost";
    ghost.style.left = fromRect.left + "px";
    ghost.style.top = fromRect.top + "px";
    ghost.style.width = fromRect.width + "px";
    ghost.style.height = fromRect.height + "px";
    document.body.appendChild(ghost);
    void ghost.offsetWidth;

    // Animating left/top/width/height directly (not transform) so
    // object-fit:cover can keep re-computing the crop as the box actually
    // reshapes — the photo reframes smoothly and continuously as it goes,
    // the same way an image resizing on any ordinary web page would, rather
    // than a fixed crop being stretched to fit a shape it was never meant
    // for. This is a single fixed-position overlay element, not a whole
    // layout — the extra reflow cost here is negligible.
    var flightStarted = false;
    function startFlight() {
      if (flightStarted) return;
      flightStarted = true;
      ghost.classList.add("is-flying");
      ghost.style.left = toRect.left + "px";
      ghost.style.top = toRect.top + "px";
      ghost.style.width = toRect.width + "px";
      ghost.style.height = toRect.height + "px";
    }
    // A forced reflow alone isn't reliably enough for the browser to have
    // actually painted the starting box before the transition kicks in —
    // double rAF is the standard fix, with a short setTimeout fallback in
    // case rAF is starved on a backgrounded/unfocused tab (the flag stops
    // whichever fires second from re-triggering it).
    requestAnimationFrame(function () { requestAnimationFrame(startFlight); });
    setTimeout(startFlight, 60);

    // Once the flight visually lands (not just "however long .9s should
    // take" — a backgrounded tab or an overloaded device can pause or slow
    // the transition itself, not just timers, and cleaning up on a blind
    // delay in that case can strand things mid-fade with opacity stuck
    // between 0 and 1), crossfade the ghost out and the real card in
    // together (.3s) instead of swapping instantly — the gradient overlay
    // and "Celosías" label ease in with the photo instead of snapping on.
    var landed = false;
    function onLanded() {
      if (landed) return;
      landed = true;
      celosiasCard.style.transition = "opacity .3s var(--ease-soft)";
      celosiasCard.style.opacity = "1";
      ghost.style.transition = "opacity .3s var(--ease-soft)";
      ghost.style.opacity = "0";

      var handedOff = false;
      function finishHandoff() {
        if (handedOff) return;
        handedOff = true;
        // A CSS transition that's still "running" (even frozen, paused by a
        // backgrounded tab or a slow device that never gave it a chance to
        // progress) keeps governing the rendered value as its own Animation
        // object even after the inline styles that started it are cleared —
        // cancelling it explicitly is what actually hands control back to
        // the plain cascade (opacity: 1, nothing else sets it), instead of
        // risking the card staying visually stuck wherever the transition
        // happened to freeze.
        safe(function () { celosiasCard.getAnimations().forEach(function (a) { a.cancel(); }); }, "flip:cancelAnim");
        celosiasCard.style.opacity = "";
        celosiasCard.style.transition = "";
        if (sliderWrap) { sliderWrap.style.opacity = ""; sliderWrap.style.transition = ""; }
        ghost.remove();
        startAutoAdvance();
      }
      celosiasCard.addEventListener("transitionend", finishHandoff, { once: true });
      setTimeout(finishHandoff, 500);
    }
    ghost.addEventListener("transitionend", onLanded, { once: true });
    setTimeout(onLanded, 1100);
  }

  // Header "rectangle" button, from the Hero specifically: the current hero
  // photo visually shrinks — same shared-element ghost technique as the
  // Hero → Catálogo jump above — down into the button's own position, then
  // the side menu opens. Per spec this button must lead to the exact same
  // menu the hamburger opens, not straight into catálogo content, so unlike
  // heroToCatalogoTransition there's no slide swap here: the Hero stays put
  // underneath, and openMenu (shared with the hamburger) takes it from there.
  function heroToMenuTransition(triggerBtn, openMenuFn) {
    var heroImg = $(".hero-media-img.is-active") || $(".hero-media-img");
    var heroMedia = $(".hero-media");
    if (!heroImg || !heroMedia || !triggerBtn) { openMenuFn(); return; }

    var fromRect = heroMedia.getBoundingClientRect();
    var toRect = triggerBtn.getBoundingClientRect();

    var ghost = document.createElement("img");
    ghost.src = heroImg.currentSrc || heroImg.src;
    ghost.setAttribute("aria-hidden", "true");
    ghost.className = "hero-flip-ghost";
    ghost.style.borderRadius = "10px";
    ghost.style.left = fromRect.left + "px";
    ghost.style.top = fromRect.top + "px";
    ghost.style.width = fromRect.width + "px";
    ghost.style.height = fromRect.height + "px";
    document.body.appendChild(ghost);
    void ghost.offsetWidth;

    var flightStarted = false;
    function startFlight() {
      if (flightStarted) return;
      flightStarted = true;
      ghost.classList.add("is-flying");
      ghost.style.left = toRect.left + "px";
      ghost.style.top = toRect.top + "px";
      ghost.style.width = toRect.width + "px";
      ghost.style.height = toRect.height + "px";
      ghost.style.opacity = "0";
    }
    requestAnimationFrame(function () { requestAnimationFrame(startFlight); });
    setTimeout(startFlight, 60);

    var landed = false;
    function onLanded() {
      if (landed) return;
      landed = true;
      safe(function () { ghost.getAnimations().forEach(function (a) { a.cancel(); }); }, "flip:cancelAnim");
      ghost.remove();
      openMenuFn();
    }
    ghost.addEventListener("transitionend", onLanded, { once: true });
    setTimeout(onLanded, 1100);
  }

  function showSlideDirect(index, skipFlip) {
    if (!slides.length) return;
    index = ((index % slides.length) + slides.length) % slides.length;
    if (index === currentIndex) return;
    if (!skipFlip && index === 2 && currentIndex === 0) { heroToCatalogoTransition(); return; }
    clearAutoAdvance();
    var outgoing = slides[currentIndex];
    var incoming = slides[index];
    outgoing.classList.add("is-direct-swap");
    incoming.classList.add("is-direct-swap");
    void incoming.offsetWidth;
    outgoing.classList.remove("is-active");
    safe(function () { unrevealSlide(outgoing); }, "unrevealSlide");
    currentIndex = index;
    incoming.classList.add("is-active");
    updateNavForSlide(currentIndex);
    setTimeout(function () {
      outgoing.classList.remove("is-direct-swap");
      incoming.classList.remove("is-direct-swap");
      safe(function () { revealSlide(slides[currentIndex]); }, "revealSlide");
      startAutoAdvance();
    }, 650);
  }

  function initSlideshow() {
    slides = $$(".slide").sort(function (a, b) {
      return parseInt(a.getAttribute("data-slide"), 10) - parseInt(b.getAttribute("data-slide"), 10);
    });
    if (!slides.length) return;
    // Locked slideshow: page-level scroll is off, navigation is menu/auto-advance only.
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    autoBar = $("[data-auto-progress]");
    var activeInHtml = slides.filter(function (s) { return s.classList.contains("is-active"); })[0];
    currentIndex = activeInHtml ? slides.indexOf(activeInHtml) : 0;
    updateNavForSlide(currentIndex);

    window.__showSlide = showSlide;
    window.__showSlideDirect = showSlideDirect;
    window.__clearAutoAdvance = clearAutoAdvance;
    window.__startAutoAdvance = startAutoAdvance;
    window.__heroToMenuTransition = heroToMenuTransition;
    window.__getCurrentIndex = function () { return currentIndex; };

    safe(startHeroLoop, "startHeroLoop");
  }

  /* -----------------------------------------------------------
     Side panels (menu + catalog) — shared open/close plumbing
  ----------------------------------------------------------- */
  var openPanel = null;
  var lastFocused = null;

  function trapFocus(e, panelEl) {
    if (e.key !== "Tab") return;
    var focusables = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', panelEl)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openPanelEl(panelEl, backdrop, triggerBtn, useBackdrop) {
    if (openPanel === panelEl) return;
    if (openPanel) closePanelEl(openPanel, backdrop, false);
    safe(clearAutoAdvance, "clearAutoAdvance");
    lastFocused = triggerBtn || document.activeElement;
    void panelEl.offsetWidth;
    panelEl.classList.add("is-open");
    panelEl.setAttribute("aria-hidden", "false");
    if (useBackdrop !== false) backdrop.classList.add("is-active");
    openPanel = panelEl;
  }

  function closePanelEl(panelEl, backdrop, restoreFocus) {
    panelEl.classList.remove("is-open");
    panelEl.setAttribute("aria-hidden", "true");
    if (openPanel === panelEl) {
      backdrop.classList.remove("is-active");
      openPanel = null;
      safe(startAutoAdvance, "startAutoAdvance");
    }
    if (restoreFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function initPanels() {
    var backdrop = $("[data-panel-backdrop]");
    var menuPanel = $("[data-menu-panel]");
    var catalogPanel = $("[data-catalog-panel]");
    var menuOpenBtn = $("[data-menu-open]");
    var nav = $(".nav");
    if (!backdrop || !menuPanel || !catalogPanel) return;

    // One button in the header (3 bars → X) controls BOTH panels. Neither
    // panel has its own separate close icon — that used to leave two close
    // controls fighting for the same top-right corner (the header button and
    // a panel-local one). Now: click it to open the menu; if a panel is
    // already open (menu or catalog), the same click closes it.
    function setBtnState(isOpen) {
      if (!menuOpenBtn) return;
      menuOpenBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuOpenBtn.setAttribute("aria-label", isOpen ? "Cerrar" : "Abrir menú");
    }

    function openMenu() {
      setBtnState(true);
      openPanelEl(menuPanel, backdrop, menuOpenBtn, false);
      if (nav) nav.classList.add("is-panel-open");
      setTimeout(function () { menuOpenBtn.focus(); }, 400);
    }
    function closeMenu() {
      setBtnState(false);
      closePanelEl(menuPanel, backdrop);
      if (nav) nav.classList.remove("is-panel-open");
    }
    function openCatalog(id, triggerBtn) {
      $$(".cat-panel-category", catalogPanel).forEach(function (block) {
        block.classList.toggle("is-active", block.getAttribute("data-cat-category") === id);
      });
      // Always start from the first product, regardless of where the
      // slider was left the last time this category was open.
      $$("[data-slider]", catalogPanel).forEach(function (s) {
        if (s.__resetToStart) safe(s.__resetToStart, "slider:resetToStart");
      });
      setBtnState(true);
      openPanelEl(catalogPanel, backdrop, triggerBtn);
      if (nav) nav.classList.add("is-panel-open");
      setTimeout(function () { menuOpenBtn.focus(); }, 400);
    }
    function closeCatalog() {
      setBtnState(false);
      closePanelEl(catalogPanel, backdrop);
      if (nav) nav.classList.remove("is-panel-open");
    }

    menuOpenBtn && menuOpenBtn.addEventListener("click", function () {
      if (openPanel === menuPanel) closeMenu();
      else if (openPanel === catalogPanel) closeCatalog();
      else openMenu();
    });
    window.__openMenu = openMenu;

    // Catalog category open buttons
    $$("[data-cat-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openCatalog(btn.getAttribute("data-cat-open"), btn);
      });
    });

    // Any link that targets a slide (menu, footer nav, logos) — intercepted
    // so navigation always goes through the loader + slideshow controller.
    $$("[data-slide-link]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var idx = parseInt(link.getAttribute("data-slide-link"), 10);
        if (openPanel === menuPanel) closeMenu();
        if (openPanel === catalogPanel) closeCatalog();
        if (window.__showSlide) window.__showSlide(idx);
      });
    });

    // Separate "go to catálogo" button in the header — its own control, own
    // job, independent of the menu toggle beside it. Jumps straight to the
    // Catálogo slide with no loader (no JH mark, no curtain) — just a quick
    // crossfade, since this is meant to feel immediate, not like replaying
    // the intro every time. From the Hero specifically this is
    // heroToCatalogoTransition's shared-element shrink straight into the
    // Celosías card. Closes any open panel first, same as the other
    // navigation above.
    var catalogoBtn = $("[data-nav-catalogo]");
    catalogoBtn && catalogoBtn.addEventListener("click", function () {
      if (openPanel === menuPanel) closeMenu();
      if (openPanel === catalogPanel) closeCatalog();
      if (window.__showSlideDirect) window.__showSlideDirect(2);
    });

    // Backdrop click closes whichever is open (catalog only — menu skips the backdrop, see openMenu).
    backdrop.addEventListener("click", function () {
      if (openPanel === menuPanel) closeMenu();
      else if (openPanel === catalogPanel) closeCatalog();
    });

    // Escape key + focus trap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && openPanel) {
        if (openPanel === menuPanel) closeMenu(); else closeCatalog();
        return;
      }
      if (openPanel) trapFocus(e, openPanel);
    });

    window.__closeCatalogPanel = closeCatalog;
  }

  /* -----------------------------------------------------------
     Sliders (catalog product carousels)
  ----------------------------------------------------------- */
  function initSliders() {
    $$("[data-slider]").forEach(function (slider) {
      var track = $("[data-slider-track]", slider);
      var slides = $$("[data-slider-slide]", track);
      var prevBtn = $("[data-slider-prev]", slider);
      var nextBtn = $("[data-slider-next]", slider);
      var dots = $$("[data-slider-dot]", slider);
      var scrollbar = $("[data-slider-scrollbar]", slider);
      var thumb = $("[data-slider-thumb]", scrollbar);
      if (!track || !slides.length) return;

      var current = 0;
      // Button/dot navigation used to hand off to the browser's own
      // scrollTo({behavior:"smooth"}), which fights on two fronts once a
      // tap lands before the previous one settled: (1) iOS Safari doesn't
      // reliably redirect a second in-flight smooth scrollTo call, and
      // (2) .product-slide's scroll-snap-stop:always (there so a fast
      // finger swipe can't fling past more than one slide) forces the
      // browser to physically stop at every intermediate snap point on a
      // multi-step jump instead of landing cleanly. Both together are what
      // read as "the movement gets stuck / skips a product going right,
      // needs a second tap going left."
      //
      // Driving the animation by hand instead — rAF loop writing
      // track.scrollLeft directly, with scroll-snap-type off for its whole
      // duration — sidesteps both: a plain scrollLeft write isn't subject
      // to snap-stop or to the browser's own smooth-scroll interruption
      // handling at all, and a new tap just retargets the same loop from
      // wherever it currently is, deterministically, in this code instead
      // of leaving it up to the browser.
      var rafId = null;
      var animFrom = 0, animTo = 0, animStart = 0;
      var ANIM_MS = 380;
      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
      function stepAnim(ts) {
        if (!animStart) animStart = ts;
        var t = Math.min(1, (ts - animStart) / ANIM_MS);
        track.scrollLeft = animFrom + (animTo - animFrom) * easeOutCubic(t);
        if (t < 1) {
          rafId = requestAnimationFrame(stepAnim);
        } else {
          rafId = null;
          track.style.scrollSnapType = "";
        }
      }
      function goTo(i, instant) {
        current = Math.max(0, Math.min(slides.length - 1, i));
        var slide = slides[current];
        // slide.offsetLeft turned out NOT to be reliably relative to the
        // track itself here (offsetParent bubbles up past the track to
        // whichever ancestor is actually positioned) — it was consistently
        // off by a fixed amount, which is exactly the ~37px drift that kept
        // showing up at the first/last slide no matter how the animation
        // itself was fixed. getBoundingClientRect() gives true on-screen
        // coordinates for both, so their difference is unambiguous
        // regardless of the offsetParent chain, then added to the track's
        // own current scrollLeft to get an absolute scroll target. Centers
        // the target slide within the track's own visible width — for
        // full-width slides (product sliders) this lands the same as a
        // plain left-align since there's no extra room either side; for
        // narrower slides (the catalogo overview) it's what lets the
        // previous and next cards peek in symmetrically on both sides.
        var slideRect = slide.getBoundingClientRect();
        var trackRect = track.getBoundingClientRect();
        var rawLeft = track.scrollLeft + (slideRect.left - trackRect.left) - (track.clientWidth - slide.offsetWidth) / 2;
        var maxScroll = track.scrollWidth - track.clientWidth;
        var centeredLeft = Math.max(0, Math.min(maxScroll, rawLeft));
        if (rafId) cancelAnimationFrame(rafId);
        if (instant || reduced) {
          rafId = null;
          track.style.scrollSnapType = "";
          track.scrollLeft = centeredLeft;
        } else {
          track.style.scrollSnapType = "none";
          animFrom = track.scrollLeft;
          animTo = centeredLeft;
          animStart = 0;
          rafId = requestAnimationFrame(stepAnim);
        }
        setActive(current);
        // Same reasoning as the drag handler below: don't rely solely on the
        // track's native "scroll" event to redraw the bar — it doesn't fire
        // reliably for every scrollTo call in every browser, and a button
        // press landing on the right slide while the bar itself stays put
        // reads as broken even though the navigation actually worked.
        updateThumb();
      }
      function setActive(i) {
        dots.forEach(function (d, di) { d.classList.toggle("is-active", di === i); });
        slides.forEach(function (s, si) { s.classList.toggle("is-current", si === i); });
        if (prevBtn) prevBtn.classList.toggle("is-edge", i === 0);
        if (nextBtn) nextBtn.classList.toggle("is-edge", i === slides.length - 1);
      }

      // A native finger swipe moves the track directly, completely bypassing
      // goTo() — without this, "current" (and therefore what the very next
      // prev/next tap treats as its starting point) would go stale the
      // moment someone swipes instead of using the arrows. That's what made
      // the arrows feel "stuck": swipe forward three products, then tap
      // "prev" once — the button, still thinking you're on product 1, tries
      // to go to product 0 instead of stepping back one from where you
      // actually are, so it looks like nothing happened (or the wrong thing
      // happened) until you tap it several more times to "catch up."
      function syncCurrentFromScroll() {
        var trackRect = track.getBoundingClientRect();
        var centerX = trackRect.left + trackRect.width / 2;
        var closest = 0, closestDist = Infinity;
        slides.forEach(function (s, i) {
          var r = s.getBoundingClientRect();
          var dist = Math.abs((r.left + r.width / 2) - centerX);
          if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        if (closest !== current) {
          current = closest;
          setActive(current);
        }
      }
      // Only react to scroll/scrollend when nothing here is mid-flight (no
      // active rAF animation from goTo) — otherwise a "scrollend" firing
      // partway through the hand-rolled animation above (a brief gap
      // between frames can look like idle scroll activity to the browser)
      // would read the in-transit position as the destination and stomp
      // `current` with the wrong slide right before the animation actually
      // finishes there itself.
      var scrollSyncTimer = null;
      track.addEventListener("scroll", function () {
        if (rafId) return;
        clearTimeout(scrollSyncTimer);
        scrollSyncTimer = setTimeout(syncCurrentFromScroll, 120);
      }, { passive: true });
      track.addEventListener("scrollend", function () {
        if (rafId) return;
        clearTimeout(scrollSyncTimer);
        syncCurrentFromScroll();
      });

      // Continuous draggable bar (catalogo overview) instead of dots — the
      // thumb's width/position are derived straight from the track's real
      // scroll position, so it's always correct whether the user dragged
      // the bar itself, swiped the track, or a dot/button call moved it.
      function updateThumb() {
        if (!scrollbar || !thumb) return;
        var maxScroll = track.scrollWidth - track.clientWidth;
        var widthPct = Math.min(100, (track.clientWidth / track.scrollWidth) * 100);
        var scrollPct = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
        thumb.style.width = widthPct + "%";
        thumb.style.left = (scrollPct * (100 - widthPct)) + "%";
      }
      if (scrollbar && thumb) {
        var dragging = false;
        function scrollToClientX(clientX) {
          var rect = scrollbar.getBoundingClientRect();
          var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          var maxScroll = track.scrollWidth - track.clientWidth;
          track.scrollLeft = ratio * maxScroll;
          // Don't rely solely on the track's native "scroll" event to redraw
          // the thumb — setting scrollLeft programmatically doesn't reliably
          // fire one in every browser, so update it directly right here too.
          updateThumb();
        }
        scrollbar.addEventListener("pointerdown", function (e) {
          dragging = true;
          safe(function () { scrollbar.setPointerCapture(e.pointerId); }, "scrollbar:capture");
          scrollToClientX(e.clientX);
        });
        scrollbar.addEventListener("pointermove", function (e) {
          if (!dragging) return;
          scrollToClientX(e.clientX);
        });
        scrollbar.addEventListener("pointerup", function () { dragging = false; });
        scrollbar.addEventListener("pointercancel", function () { dragging = false; });
        track.addEventListener("scroll", updateThumb, { passive: true });
      }

      prevBtn && prevBtn.addEventListener("click", function () { goTo(current - 1); });
      nextBtn && nextBtn.addEventListener("click", function () { goTo(current + 1); });
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { goTo(i); });
      });
      // Tapping a neighboring (dimmed) card brings it into focus instead of
      // just sitting there dark — clicking its own CTA/link still works normally.
      slides.forEach(function (s, i) {
        s.addEventListener("click", function (e) {
          if (i === current) return;
          if (e.target.closest("a, button")) return;
          goTo(i);
        });
      });

      setActive(0);
      updateThumb();
      // Exposed so the catalog panel can snap back to the first product
      // every time this category is opened, instead of resuming wherever
      // it was left. Instant, not smooth — this happens while the panel
      // itself is still fading in, and a smooth scroll here could still be
      // mid-flight when the user's first real tap on next/prev arrives,
      // leaving two scrollTo calls fighting each other (looked like the
      // first tap "did nothing," or landed the track half-scrolled between
      // two products with a sliver of each visible).
      slider.__resetToStart = function () { goTo(0, true); updateThumb(); };

      // Sync active dot/edges on manual scroll/swipe
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            var idx = slides.indexOf(entry.target);
            if (idx > -1) { current = idx; setActive(idx); }
          }
        });
      }, { root: track, threshold: [0.6] });
      slides.forEach(function (s) { io.observe(s); });
    });
  }

  /* -----------------------------------------------------------
     (Nosotros shows all copy directly — no expand/collapse.)
  ----------------------------------------------------------- */

  /* -----------------------------------------------------------
     Consult buttons -> jump to Contacto slide + prefill message
  ----------------------------------------------------------- */
  function initConsultButtons() {
    var messageField = $("#f-message");
    var nameField = $("#f-name");
    $$("[data-consult]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var product = btn.getAttribute("data-consult");
        if (messageField) {
          messageField.value = "Quiero más información sobre: " + product;
          messageField.dispatchEvent(new Event("input"));
        }
        if (window.__closeCatalogPanel) window.__closeCatalogPanel();
        setTimeout(function () {
          if (window.__showSlide) window.__showSlide(3);
          setTimeout(function () { nameField && nameField.focus(); }, reduced ? 300 : 2400);
        }, 350);
      });
    });
  }

  /* -----------------------------------------------------------
     Contact form — submit to javisastre@gmail.com CC sveronicareyes@gmail.com
  ----------------------------------------------------------- */
  function initContactForm() {
    var form = $("[data-contact-form]");
    var success = $("[data-contact-success]");
    if (!form || !success) return;
    var submitBtn = $('[type="submit"]', form);
    var msg = $("[data-contact-success-msg]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return;

      form.classList.add("is-sending");
      if (submitBtn) submitBtn.disabled = true;

      var nameVal = (form.elements.name ? form.elements.name.value : "").trim();
      var emailVal = (form.elements.email ? form.elements.email.value : "").trim();
      var phoneVal = (form.elements.phone ? form.elements.phone.value : "").trim();
      var messageVal = (form.elements.message ? form.elements.message.value : "").trim();

      var subject = encodeURIComponent("Consulta de " + nameVal + " — Jade Haus Arq.");
      var bodyText = encodeURIComponent(
        "Nombre: " + nameVal + "\n" +
        "Email: " + emailVal + "\n" +
        "Teléfono: " + phoneVal + "\n\n" +
        "Mensaje:\n" + messageVal
      );

      var mailtoUrl = "mailto:javisastre@gmail.com?cc=sveronicareyes@gmail.com&subject=" + subject + "&body=" + bodyText;

      setTimeout(function () {
        var firstName = nameVal.split(/\s+/)[0] || "Muchas gracias";
        if (msg) msg.textContent = firstName + ", recibimos tu consulta. Te contactaremos a la brevedad.";
        form.classList.remove("is-sending");
        form.classList.add("is-sent");
        success.setAttribute("aria-hidden", "false");
        success.classList.add("is-visible");
        try {
          window.location.href = mailtoUrl;
        } catch (err) {}
      }, 700);
    });
  }

  function initEmailLinks() {
    $$('a[href*="fjsastre@fernandosastre.com"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isMobile) {
          e.preventDefault();
          var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=fjsastre@fernandosastre.com&su=" + encodeURIComponent("Consulta — Jade Haus Arq.");
          window.open(gmailUrl, "_blank", "noopener");
        }
      });
    });
  }

  /* -----------------------------------------------------------
     Boot
  ----------------------------------------------------------- */
  function boot() {
    safe(initSlideshow, "initSlideshow");
    safe(initPanels, "initPanels");
    safe(initSliders, "initSliders");
    safe(initConsultButtons, "initConsultButtons");
    safe(initContactForm, "initContactForm");
    safe(initEmailLinks, "initEmailLinks");

    // Failsafe: whatever else happens (a slow asset, a JS error, anything),
    // the page is guaranteed to become visible on its own within a few
    // seconds — it can never stay stuck hidden behind the loader.
    var revealed = false;
    function forceReveal() {
      if (revealed) return;
      revealed = true;
      document.documentElement.classList.add("is-ready");
      var loaderEl = $("[data-loader]");
      if (loaderEl) {
        loaderEl.classList.add("is-out");
        loaderEl.style.opacity = "0";
        loaderEl.style.pointerEvents = "none";
      }
      safe(function () { revealSlide(slides[currentIndex]); }, "revealSlide");
      safe(startAutoAdvance, "startAutoAdvance");
    }
    // Must stay comfortably longer than the loader's own natural runtime —
    // the first page load runs the two-beat intro (contentDuration 3150ms +
    // 650ms hide = 3800ms), the longest case this ever has to cover. This is
    // a true last-resort failsafe, not a second timer racing the real one.
    var watchdog = setTimeout(forceReveal, 5500);

    safe(function () {
      playLoader(function () {}, function () {
        // Reveal content only once the loader has fully wiped away, so the
        // page-wipe and the content fading in read as two clean beats
        // instead of racing each other on top of one another.
        if (revealed) return;
        revealed = true;
        clearTimeout(watchdog);
        document.documentElement.classList.add("is-ready");
        safe(function () { revealSlide(slides[currentIndex]); }, "revealSlide");
        safe(startAutoAdvance, "startAutoAdvance");
      });
    }, "playLoader:boot");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
