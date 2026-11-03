(function () {
  "use strict";

  /* ---------- Event details (single source of truth) ---------- */
  var EVENT = {
    title: "Brar Mortgages Partner Appreciation Evening",
    // 6:00 PM Mountain Time (MST, UTC-7 in December) → 01:00 UTC next day.
    // End time assumed 10:00 PM MT.
    startUtc: "20261212T010000Z",
    endUtc: "20261212T050000Z",
    tz: "America/Edmonton",
    location: "Four Points by Sheraton Edmonton South, 7230 Argyll Rd NW, Edmonton, AB T6C 4A6",
    details: "Thank you for your partnership! A special evening of celebration, connection & appreciation.\n\nRSVP: https://forms.gle/dehSAAB57XDKFnya6"
  };

  var gcal = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(EVENT.title) +
    "&dates=" + EVENT.startUtc + "/" + EVENT.endUtc +
    "&ctz=" + encodeURIComponent(EVENT.tz) +
    "&location=" + encodeURIComponent(EVENT.location) +
    "&details=" + encodeURIComponent(EVENT.details);
  document.getElementById("gcalLink").href = gcal;
  document.getElementById("mapsLink").href =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(EVENT.location);

  /* ---------- Logo fallbacks ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("img[data-fallback]"), function (img) {
    var wrap = img.closest(".logo-wrap");
    function fail() { if (wrap) wrap.classList.add("is-missing"); }
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  });

  /* ---------- Elements ---------- */
  var stage = document.getElementById("stage");
  var lid = document.getElementById("lid");
  var cardScroll = document.getElementById("cardScroll");
  var title = document.getElementById("inviteTitle");
  var replayBtn = document.getElementById("replayBtn");
  var sparkles = document.getElementById("sparkles");

  var reduceMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var timers = [];
  var busy = false;
  var isOpen = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function add(c) { stage.classList.add(c); }
  function remove(c) { stage.classList.remove(c); }

  /* ---------- Sparkles + light confetti ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  (function buildParticles() {
    var frag = document.createDocumentFragment();
    var vmin = Math.min(window.innerWidth, window.innerHeight);
    var i, el, ang, dist;
    for (i = 0; i < 26; i++) {
      el = document.createElement("span");
      el.className = "sparkle";
      ang = rand(0, Math.PI * 2);
      dist = rand(0.22, 0.6) * vmin;
      el.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      el.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      el.style.setProperty("--s", rand(10, 24) + "px");
      el.style.setProperty("--d", rand(0, 0.45).toFixed(2) + "s");
      el.style.setProperty("--dur", rand(1.1, 1.8).toFixed(2) + "s");
      frag.appendChild(el);
    }
    var colors = ["#e6c56f", "#c9a24b", "#f4e3b1", "#d42532", "#fffaf2"];
    for (i = 0; i < 22; i++) {
      el = document.createElement("span");
      el.className = "confetti";
      el.style.setProperty("--x", rand(2, 98).toFixed(1) + "%");
      el.style.setProperty("--c", colors[i % colors.length]);
      el.style.setProperty("--d", rand(0.1, 0.9).toFixed(2) + "s");
      el.style.setProperty("--dur", rand(2.4, 3.6).toFixed(2) + "s");
      el.style.setProperty("--drift", rand(-70, 70).toFixed(0) + "px");
      el.style.setProperty("--rot", rand(-540, 540).toFixed(0) + "deg");
      frag.appendChild(el);
    }
    sparkles.appendChild(frag);
  })();

  /* ---------- Open / close ---------- */
  function finishOpen() {
    busy = false;
    isOpen = true;
    cardScroll.setAttribute("aria-hidden", "false");
    lid.setAttribute("aria-hidden", "true");
    lid.tabIndex = -1;
    title.setAttribute("tabindex", "-1");
    try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); }
  }

  function open() {
    if (busy || isOpen) return;
    busy = true;
    clearTimers();
    cardScroll.scrollTop = 0;

    if (reduceMQ.matches) {
      add("rm");
      add("s2"); add("s3"); add("s4");
      later(finishOpen, 600);
      return;
    }
    remove("rm");
    add("s1");                       // bow loosens, ribbon slides off (~0.6s)
    later(function () { add("s2"); }, 480);   // lid lifts & flies off (~0.6s)
    later(function () { add("s3"); }, 900);   // golden glow + sparkles
    later(function () { add("s4"); }, 1250);  // card pops up (~0.8s)
    later(finishOpen, 2100);
  }

  function close(thenReopen) {
    if (busy || !isOpen) return;
    busy = true;
    isOpen = false;
    clearTimers();
    cardScroll.setAttribute("aria-hidden", "true");
    lid.removeAttribute("aria-hidden");
    lid.tabIndex = 0;

    var done = function () {
      remove("closing");
      busy = false;
      if (thenReopen) later(open, reduceMQ.matches ? 250 : 550);
      else lid.focus();
    };

    if (reduceMQ.matches) {
      remove("s4"); remove("s3"); remove("s2"); remove("s1");
      later(done, 550);
      return;
    }
    add("closing");
    remove("s4");                                         // card sinks back into box
    later(function () { remove("s3"); }, 380);            // light dims
    later(function () { remove("s2"); }, 420);            // lid comes back down
    later(function () { remove("s1"); }, 980);            // ribbon slides back, bow re-ties
    later(done, 1550);
  }

  lid.addEventListener("click", open);
  replayBtn.addEventListener("click", function () { close(true); });
})();
