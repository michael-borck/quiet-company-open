// SPDX-License-Identifier: MIT
// Stillpoint: the line-up, the quiz and the card for each buddy.
// One file, no dependencies, no tracking, nothing sent anywhere.
// The CODE in this file is MIT. The card TEXT (taglines, practices, quiz
// wording) is copyright Stillpoint Studio, all rights reserved. See LICENSE.
(function () {
  "use strict";

  // Three poses of the same monk body. Any head fits any body.
  var BODIES = {
    seated:   { name: "Sitting",  word: "Stillness", line: "Sitting with it. Nothing to fix for the next five minutes." },
    standing: { name: "Welcoming", word: "Welcome",  line: "Arms open, palms up. Nothing to hand over; you are just glad they came." },
    walking:  { name: "Walking",  word: "Journey",   line: "Mid step, staff in hand. You are allowed to be on the way." }
  };

  // t = traits: [energy, company, heart, wildness], each from -2 to 2.
  //   energy   -2 calm ........ lively 2
  //   company  -2 solo ........ pack 2
  //   heart    -2 thinks ...... feels 2
  //   wildness -2 steady ...... wild 2
  var HEADS = {
    robot:     { name: "The Robot",     t: [-1, -1, -2, -2], tag: "For the one who has a system for that.",
                 practice: "Pick one thing on the list. Do it badly, on purpose. Notice that the list survives." },
    astronaut: { name: "The Astronaut", t: [0, -2, -1, 1],   tag: "For the one who needs a little space.",
                 practice: "Look at the furthest thing you can see for one slow breath. Everything nearer just got smaller." },
    diver:     { name: "The Diver",     t: [-2, -2, 0, 0],   tag: "For the one who goes deep and forgets to come up.",
                 practice: "Before the next long dive into work, tell one person when you plan to surface." },
    knight:    { name: "The Knight",    t: [0, 1, 0, -2],    tag: "For the one who always has to save the group chat.",
                 practice: "Name what you are guarding today. Then take the helmet off for ten minutes anyway." },
    wizard:    { name: "The Wizard",    t: [-1, -1, -2, 1],  tag: "For the one who gives advice you actually take.",
                 practice: "Ask one question today where you would normally give an answer." },
    pirate:    { name: "The Pirate",    t: [2, 1, 0, 2],     tag: "For the one whose plan is a direction, not a map.",
                 practice: "Choose one rule you follow out of habit. Decide, properly this time, whether to keep it." },
    viking:    { name: "The Viking",    t: [2, 2, 1, 1],     tag: "For the one who is loud because they care.",
                 practice: "Say the kind thing at the volume you would say the funny thing." },
    alien:     { name: "The Alien",     t: [0, -2, 0, 2],    tag: "For the one who is still working out the customs here.",
                 practice: "Notice one ordinary thing as if you had just landed. A tap. A queue. A dog." },
    monk:      { name: "The Monk",      t: [-2, 0, 0, -1],   tag: "For the one who is fine, actually.",
                 practice: "Sit. Count ten breaths. If you lose count, that was the practice." },
    panda:     { name: "The Panda",     t: [-2, 1, 2, -1],   tag: "For the one who treats lunch as a discipline.",
                 practice: "Eat one thing today without a screen. Chew like it is the only meeting you have." },
    penguin:   { name: "The Penguin",   t: [1, 2, 1, -1],    tag: "For the one who turns up, every time, slightly overdressed.",
                 practice: "Stand closer to your people than is strictly necessary. That is how the cold works." },
    elephant:  { name: "The Elephant",  t: [-2, 2, 0, -2],   tag: "For the one who remembers everyone's birthday.",
                 practice: "Let one old thing go today. You may keep the birthdays." },
    husky:     { name: "The Husky",     t: [2, 2, 0, 0],     tag: "For the one who would like to go outside now.",
                 practice: "Walk until your thoughts fall into step. Then one more block." },
    dog:       { name: "The Dog",       t: [1, 2, 2, 0],     tag: "For the one who is pleased to see you, specifically.",
                 practice: "Greet the next person you meet as if they had been gone all day." },
    cat:       { name: "The Cat",       t: [-1, -2, 1, 1],   tag: "For the one who will come over when they are ready.",
                 practice: "Find the warmest spot in the room. Sit in it. Owe no one an explanation." },
    lion:      { name: "The Lion",      t: [1, 2, -2, -1],   tag: "For the one everyone looks at when it goes quiet.",
                 practice: "Lead one thing today by going second." },
    bunny:     { name: "The Bunny",     t: [2, 0, 2, 0],     tag: "For the one with eleven tabs open, all of them feelings.",
                 practice: "Before the next hop, put both feet down. Count to three. Then hop." },
    frog:      { name: "The Frog",      t: [-2, -1, 1, 2],   tag: "For the one who does nothing for hours, then everything at once.",
                 practice: "Sit on your lily pad until you actually want to jump. Not before." },
    cobra:     { name: "The Cobra",     t: [1, -2, -1, 0],   tag: "For the one who looks intense but is only concentrating.",
                 practice: "Unclench the jaw. Lower the shoulders. You can strike later if it still matters." },
    owl:       { name: "The Owl",       t: [-2, -2, -2, -1], tag: "For the one who does their best thinking at 2 am.",
                 practice: "Write the 2 am thought down and close the notebook. It will keep until morning." },
    pig:       { name: "The Pig",       t: [0, 1, 2, 2],     tag: "For the one who is having a lovely time, thank you.",
                 practice: "Enjoy one thing today all the way to the end, without improving it." },
    monkey:    { name: "The Monkey",    t: [2, 1, -1, 2],    tag: "For the one whose mind has already left the room.",
                 practice: "When the mind swings off, say 'thinking' and come back. No scolding. Monkeys hate scolding." },
    octopus:   { name: "The Octopus",   t: [1, 0, -2, 2],    tag: "For the one doing eight things, six of them well.",
                 practice: "Put seven arms down. Give the eighth thing everything." }
  };

  // Each answer nudges the traits: [energy, company, heart, wildness].
  var QUESTIONS = [
    { q: "A free Saturday morning. You…", a: [
      ["stay exactly where you are, with a book", [-2, 0, 0, 0]],
      ["go for a long walk, alone", [-1, -1, 0, 0]],
      ["see who is around for breakfast", [1, 1, 0, 0]],
      ["are already out the door; the plan can catch up", [2, 0, 0, 1]] ] },
    { q: "The group chat has 47 unread messages.", a: [
      ["Muted. Months ago.", [0, -2, 0, 0]],
      ["You read all of them and reply to none", [0, -1, -1, 0]],
      ["You reply once, with the perfect picture", [0, 1, 0, 1]],
      ["You sent thirty of them", [1, 2, 0, 0]] ] },
    { q: "A friend is having a rough week. You…", a: [
      ["send a plan, with steps", [0, 0, -2, 0]],
      ["send the article that explains it", [0, -1, -1, 0]],
      ["listen, mostly", [-1, 0, 1, 0]],
      ["turn up with snacks", [0, 0, 2, 0]] ] },
    { q: "Flat-pack furniture arrives.", a: [
      ["Instructions, in order, start to finish", [0, 0, 0, -2]],
      ["Sort the screws first, then think", [0, 0, -1, -1]],
      ["Glance at the picture and begin", [0, 0, 0, 1]],
      ["There were instructions?", [1, 0, 0, 2]] ] },
    { q: "Pick a seat.", a: [
      ["The quiet corner", [-1, -1, 0, 0]],
      ["By the window, watching", [0, -1, -1, 0]],
      ["The middle of the long table", [0, 2, 0, 0]],
      ["The floor, next to the dog", [0, 0, 1, 1]] ] },
    { q: "Your desk, right now.", a: [
      ["Clear. One pen.", [-1, 0, 0, -2]],
      ["Organised chaos; you know where everything is", [0, 0, -1, 1]],
      ["Plants, snacks, a card from someone", [0, 0, 1, 0]],
      ["What desk?", [1, 0, 0, 2]] ] }
  ];

  var BODY_QUESTION = { q: "And where are you at the moment?", a: [
    ["Sitting with it", "seated"],
    ["Glad to see whoever walks in", "standing"],
    ["On my way somewhere", "walking"] ] };

  // Largest swing each trait can get from the questions, so answers scale to -2..2.
  var SPAN = [0, 0, 0, 0];
  QUESTIONS.forEach(function (q) {
    for (var i = 0; i < 4; i++) {
      SPAN[i] += Math.max.apply(null, q.a.map(function (a) { return Math.abs(a[1][i]); }));
    }
  });

  // answers: one option index per question. Returns the closest head.
  function match(answers) {
    var v = [0, 0, 0, 0];
    answers.forEach(function (pick, qi) {
      var d = QUESTIONS[qi].a[pick][1];
      for (var i = 0; i < 4; i++) v[i] += d[i];
    });
    for (var i = 0; i < 4; i++) v[i] = 2 * v[i] / SPAN[i] * api.stretch;
    var best = null, bestD = Infinity;
    Object.keys(HEADS).forEach(function (id) {
      var t = HEADS[id].t, d = 0;
      for (var i = 0; i < 4; i++) d += (t[i] - v[i]) * (t[i] - v[i]);
      if (d < bestD - 1e-9) { bestD = d; best = id; }
    });
    return best;
  }

  // stretch: nobody answers at the extreme on every question, so answers are
  // scaled up before matching. Tuned so every head comes up (see docs/QUIZ.md).
  var api = { stretch: 2.6, BODIES: BODIES, HEADS: HEADS, QUESTIONS: QUESTIONS, BODY_QUESTION: BODY_QUESTION, match: match };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.STILLPOINT = api;
})();
