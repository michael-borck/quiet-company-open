// SPDX-License-Identifier: MIT
// Quiet Company: page behaviour. Builds the gallery, the quiz and the buddy card
// from assets/buddies.js. No dependencies, no tracking, no network calls.
(function () {
  "use strict";
  var S = window.QUIET_COMPANY;
  // Seated height in mm for the heads that stand well above the rest; standing and walking add 25.
  var TALL_MM = { fish: 116, glasses: 118, cyclops: 123, longhair: 122, beard: 123, ponytail: 124, curls: 130, bun: 134, troll: 122, husky: 123, lion: 123, robot: 123, quiff: 125, ghost: 125, minotaur: 126, 
                  alien: 128, jester: 131, dragon: 132, bunny: 140, elf: 140, wizard: 140, giraffe: 148, unicorn: 155 };
  var HEAD_IDS = Object.keys(S.HEADS), BODY_IDS = Object.keys(S.BODIES);

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function picture(src, alt, w, h) {
    var i = el("img");
    i.src = src; i.alt = alt; i.width = w; i.height = h; i.loading = "lazy"; i.decoding = "async";
    return i;
  }
  function buddyUrl(head, body) { return "buddy.html?head=" + head + "&body=" + body; }

  // ---- home: poses and heads ------------------------------------------------
  function tile(id, body) {
    var a = el("a", "tile");
    a.href = buddyUrl(id, body);
    a.appendChild(picture("assets/figures/head-" + id + ".webp", "", 270, 300));
    a.appendChild(el("span", "tile-name", S.HEADS[id].name));
    return a;
  }
  // The heads grouped by family, with a row of filter buttons above them.
  function gallery(root) {
    var families = Object.keys(S.FAMILIES), tiles = [], buttons = [];
    var bar = el("div", "filters");
    bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Show heads by family");
    function show(family) {
      tiles.forEach(function (t) { t.node.hidden = !!family && t.family !== family; });
      buttons.forEach(function (b) { b.node.setAttribute("aria-pressed", b.family === family ? "true" : "false"); });
    }
    function button(label, family, count) {
      var b = el("button", "filter", label + " ");
      b.type = "button";
      b.appendChild(el("span", "count", String(count)));
      b.addEventListener("click", function () { show(family); });
      buttons.push({ node: b, family: family });
      bar.appendChild(b);
    }
    button("All", null, HEAD_IDS.length);
    families.forEach(function (f) {
      var ids = HEAD_IDS.filter(function (id) { return S.HEADS[id].f === f; });
      button(S.FAMILIES[f].name, f, ids.length);
      ids.forEach(function (id) { var t = tile(id, "seated"); tiles.push({ node: t, family: f }); });
    });
    root.parentNode.insertBefore(bar, root);
    tiles.forEach(function (t) { root.appendChild(t.node); });
    show(null);
  }
  function poses(root) {
    BODY_IDS.forEach(function (id) {
      var b = S.BODIES[id], d = el("div", "pose");
      d.appendChild(picture("assets/figures/body-" + id + ".webp", "", 300, 300));
      d.appendChild(el("h3", null, b.name));
      d.appendChild(el("p", null, b.line));
      root.appendChild(d);
    });
  }

  // ---- buddy card ---------------------------------------------------------
  function buddy(root) {
    var q = new URLSearchParams(location.search);
    var head = q.get("head"), body = q.get("body") || "seated";
    if (!S.HEADS[head] || !S.BODIES[body]) {
      root.appendChild(el("h1", null, "No buddy here yet."));
      var p = el("p", "lede"); p.appendChild(document.createTextNode("Take "));
      var a = el("a", null, "the quiz"); a.href = "quiz.html"; p.appendChild(a);
      p.appendChild(document.createTextNode(" to find yours."));
      root.appendChild(p);
      return;
    }
    var h = S.HEADS[head], b = S.BODIES[body];
    document.title = h.name + ", " + b.name.toLowerCase() + " | Quiet Company";

    var art = el("div", "figure-art buddy-art");
    art.appendChild(picture("assets/figures/" + head + "-" + body + ".webp",
      h.name + ", " + b.name.toLowerCase() + ". Preview render.", 312, 528));
    var copy = el("div", "figure-copy");
    copy.appendChild(el("p", "eyebrow", q.get("from") === "quiz" ? "Your buddy" : b.word));
    copy.appendChild(el("h1", null, h.name));
    copy.appendChild(el("p", "lede", h.tag));

    var sw = el("div", "switch");
    sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Pose");
    BODY_IDS.forEach(function (id) {
      var a = el("a", id === body ? "on" : null, S.BODIES[id].name);
      a.href = buddyUrl(head, id) + (q.get("from") === "quiz" ? "&from=quiz&alt=" + encodeURIComponent(q.get("alt") || "") : "");
      if (id === body) a.setAttribute("aria-current", "true");
      sw.appendChild(a);
    });
    copy.appendChild(sw);
    copy.appendChild(el("p", null, b.line));

    copy.appendChild(el("h2", null, "The practice"));
    var pr = el("div", "practice"); pr.appendChild(el("p", null, h.practice)); copy.appendChild(pr);

    copy.appendChild(el("h2", null, "How to use it"));
    copy.appendChild(el("p", null, "Stuck on something? Explain it to your buddy out loud, from the start. It will not answer. You usually will."));

    copy.appendChild(el("h2", null, "Details"));
    var specs = el("ul", "specs");
    [["Height", "about " + Math.round(((TALL_MM[head] || 113) + (body === "seated" ? 0 : 25)) / 10) + " cm"], ["Material", "Matte PLA, printed to order"],
     ["Finishes", "Still / Shadow / Becoming"], ["Head", "Arrives separate. Push it on; it fits all three poses"]].forEach(function (r) {
      var li = el("li"); li.appendChild(el("span", null, r[0])); li.appendChild(el("span", null, r[1])); specs.appendChild(li);
    });
    copy.appendChild(specs);
    copy.appendChild(el("p", "small", "Shop opening soon. The picture is a preview render, not a photo."));

    var links = el("p", "links");
    var again = el("a", "back", q.get("from") === "quiz" ? "Take the quiz again" : "Take the quiz"); again.href = "quiz.html";
    var all = el("a", "back", "All heads"); all.href = "index.html#heads";
    links.appendChild(again); links.appendChild(all);

    // From the quiz: the two next-closest heads, in the same pose.
    var alts = (q.get("alt") || "").split(",").filter(function (id) { return S.HEADS[id] && id !== head; }).slice(0, 2);
    if (alts.length) {
      copy.appendChild(el("h2", null, "Close behind"));
      copy.appendChild(el("p", null, alts.length > 1 ? "Your answers also came near these two. Heads lift off and swap, so either can take a turn on the same body." : "Your answers also came near this one. Heads lift off and swap, so it can take a turn on the same body."));
      var row = el("div", "alts");
      alts.forEach(function (id) { row.appendChild(tile(id, body)); });
      copy.appendChild(row);
    }
    copy.appendChild(links);

    root.appendChild(art); root.appendChild(copy);
  }

  // ---- quiz ---------------------------------------------------------------
  // First question picks the family, the next six pick the head within it,
  // the last picks the pose. The result page also shows the two runners-up.
  function quiz(root) {
    var steps = [S.FAMILY_QUESTION].concat(S.QUESTIONS, [S.BODY_QUESTION]);
    var picks = [], total = steps.length;
    function finish() {
      var family = S.FAMILY_QUESTION.a[picks[0]][1];
      var ranked = S.rank(picks.slice(1, total - 1), family);
      var body = S.BODY_QUESTION.a[picks[total - 1]][1];
      location.href = buddyUrl(ranked[0], body) + "&from=quiz&alt=" + ranked.slice(1, 3).join(",");
    }
    function show(i) {
      root.textContent = "";
      var item = steps[i];
      root.appendChild(el("p", "eyebrow", "Question " + (i + 1) + " of " + total));
      var h = el("h1", "quiz-q", item.q); h.tabIndex = -1; root.appendChild(h);
      var list = el("div", "options");
      item.a.forEach(function (opt, k) {
        var btn = el("button", "option", opt[0]);
        btn.type = "button";
        btn.addEventListener("click", function () {
          picks[i] = k;
          if (i === total - 1) finish(); else show(i + 1);
        });
        list.appendChild(btn);
      });
      root.appendChild(list);
      if (i > 0) {
        var back = el("button", "back plain", "Back");
        back.type = "button";
        back.addEventListener("click", function () { show(i - 1); });
        root.appendChild(back);
      }
      h.focus();
    }
    show(0);
  }

  var hooks = { "js-gallery": gallery, "js-poses": poses, "js-buddy": buddy, "js-quiz": quiz };
  Object.keys(hooks).forEach(function (id) {
    var n = document.getElementById(id);
    if (n) hooks[id](n);
  });
})();
