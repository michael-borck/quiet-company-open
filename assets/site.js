// SPDX-License-Identifier: MIT
// Quiet Company: page behaviour. Builds the gallery, the quiz and the buddy card
// from assets/buddies.js. No dependencies, no tracking, no network calls.
(function () {
  "use strict";
  var S = window.QUIET_COMPANY;
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
  function gallery(root) {
    HEAD_IDS.forEach(function (id) {
      var a = el("a", "tile");
      a.href = buddyUrl(id, "seated");
      a.appendChild(picture("assets/figures/head-" + id + ".webp", "", 270, 300));
      a.appendChild(el("span", "tile-name", S.HEADS[id].name));
      root.appendChild(a);
    });
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
      a.href = buddyUrl(head, id);
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
    [["Height", body === "seated" ? "about 11 cm" : "about 14 cm"], ["Material", "Matte PLA, printed to order"],
     ["Finishes", "Still / Shadow / Becoming"], ["Head", "Arrives separate. Push it on; it fits all three poses"]].forEach(function (r) {
      var li = el("li"); li.appendChild(el("span", null, r[0])); li.appendChild(el("span", null, r[1])); specs.appendChild(li);
    });
    copy.appendChild(specs);
    copy.appendChild(el("p", "small", "Shop opening soon. The picture is a preview render, not a photo."));

    var links = el("p", "links");
    var again = el("a", "back", q.get("from") === "quiz" ? "Take the quiz again" : "Take the quiz"); again.href = "quiz.html";
    var all = el("a", "back", "All heads"); all.href = "index.html#heads";
    links.appendChild(again); links.appendChild(all);
    copy.appendChild(links);

    root.appendChild(art); root.appendChild(copy);
  }

  // ---- quiz ---------------------------------------------------------------
  function quiz(root) {
    var answers = [], total = S.QUESTIONS.length + 1;
    function show(i) {
      root.textContent = "";
      var last = i === S.QUESTIONS.length;
      var item = last ? S.BODY_QUESTION : S.QUESTIONS[i];
      root.appendChild(el("p", "eyebrow", "Question " + (i + 1) + " of " + total));
      var h = el("h1", "quiz-q", item.q); h.tabIndex = -1; root.appendChild(h);
      var list = el("div", "options");
      item.a.forEach(function (opt, k) {
        var btn = el("button", "option", opt[0]);
        btn.type = "button";
        btn.addEventListener("click", function () {
          if (last) {
            location.href = buddyUrl(S.match(answers), opt[1]) + "&from=quiz";
          } else {
            answers[i] = k; show(i + 1);
          }
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
