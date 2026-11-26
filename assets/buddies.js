// SPDX-License-Identifier: MIT
// Quiet Company: the line-up, the quiz and the card for each buddy.
// One file, no dependencies, no tracking, nothing sent anywhere.
// The CODE in this file is MIT. The card TEXT (taglines, practices, quiz
// wording) is copyright Quiet Company, all rights reserved. See LICENSE.
(function () {
  "use strict";

  // Three poses of the same monk body. Any head fits any body.
  var BODIES = {
    seated:   { name: "Sitting",  word: "Stillness", line: "Sitting with it. Nothing to fix for the next five minutes." },
    standing: { name: "Standing", word: "Patience",  line: "Hands tucked into the sleeves. Nothing to reach for; you can wait." },
    walking:  { name: "Walking",  word: "Journey",   line: "Mid step, staff in hand. You are allowed to be on the way." }
  };

  // Four families. The gallery filters by them and the quiz picks one first.
  var FAMILIES = {
    characters: { name: "Characters" },
    people:     { name: "People" },
    animals:    { name: "Animals" },
    creatures:  { name: "Creatures" }
  };

  // f = family. t = traits: [energy, company, heart, wildness], each from -2 to 2.
  //   energy   -2 calm ........ lively 2
  //   company  -2 solo ........ pack 2
  //   heart    -2 thinks ...... feels 2
  //   wildness -2 steady ...... wild 2
  var HEADS = {
    robot:     { name: "The Robot",     f: "characters", t: [-1, -1, -2, -2], tag: "For the one who has a system for that.",
                 practice: "Pick one thing on the list. Do it badly, on purpose. Notice that the list survives." },
    astronaut: { name: "The Astronaut", f: "characters", t: [0, -2, -1, 1],   tag: "For the one who needs a little space.",
                 practice: "Look at the furthest thing you can see for one slow breath. Everything nearer just got smaller." },
    diver:     { name: "The Diver",     f: "characters", t: [-2, -2, 0, 0],   tag: "For the one who goes deep and forgets to come up.",
                 practice: "Before the next long dive into work, tell one person when you plan to surface." },
    knight:    { name: "The Knight",    f: "characters", t: [0, 1, 0, -2],    tag: "For the one who always has to save the group chat.",
                 practice: "Name what you are guarding today. Then take the helmet off for ten minutes anyway." },
    wizard:    { name: "The Wizard",    f: "characters", t: [-1, -1, -2, 1],  tag: "For the one who gives advice you actually take.",
                 practice: "Ask one question today where you would normally give an answer." },
    pirate:    { name: "The Pirate",    f: "characters", t: [2, 1, 0, 2],     tag: "For the one whose plan is a direction, not a map.",
                 practice: "Choose one rule you follow out of habit. Decide, properly this time, whether to keep it." },
    viking:    { name: "The Viking",    f: "characters", t: [2, 2, 1, 1],     tag: "For the one who is loud because they care.",
                 practice: "Say the kind thing at the volume you would say the funny thing." },
    alien:     { name: "The Alien",     f: "characters", t: [0, -2, 0, 2],    tag: "For the one who is still working out the customs here.",
                 practice: "Notice one ordinary thing as if you had just landed. A tap. A queue. A dog." },
    monk:      { name: "The Monk",      f: "characters", t: [-2, 0, 0, -1],   tag: "For the one who is fine, actually.",
                 practice: "Sit. Count ten breaths. If you lose count, that was the practice." },
    panda:     { name: "The Panda",     f: "animals", t: [-1, 0, 1, 0], tag: "For the one who treats lunch as a discipline.",
                 practice: "Eat one thing today without a screen. Chew like it is the only meeting you have." },
    penguin:   { name: "The Penguin",   f: "animals", t: [1, 2, 0, 0], tag: "For the one who turns up, every time, slightly overdressed.",
                 practice: "Stand closer to your people than is strictly necessary. That is how the cold works." },
    elephant:  { name: "The Elephant",  f: "animals", t: [-2, 1, -1, -1], tag: "For the one who remembers everyone's birthday.",
                 practice: "Let one old thing go today. You may keep the birthdays." },
    husky:     { name: "The Husky",     f: "animals", t: [1, 1, -1, 1], tag: "For the one who would like to go outside now.",
                 practice: "Walk until your thoughts fall into step. Then one more block." },
    dog:       { name: "The Dog",       f: "animals", t: [2, 2, 1, 1], tag: "For the one who is pleased to see you, specifically.",
                 practice: "Greet the next person you meet as if they had been gone all day." },
    cat:       { name: "The Cat",       f: "animals", t: [-2, -2, 0, 0], tag: "For the one who will come over when they are ready.",
                 practice: "Find the warmest spot in the room. Sit in it. Owe no one an explanation." },
    lion:      { name: "The Lion",      f: "animals", t: [1, 1, -2, 0], tag: "For the one everyone looks at when it goes quiet.",
                 practice: "Lead one thing today by going second." },
    bunny:     { name: "The Bunny",     f: "animals", t: [1, -1, 1, 1], tag: "For the one with eleven tabs open, all of them feelings.",
                 practice: "Before the next hop, put both feet down. Count to three. Then hop." },
    frog:      { name: "The Frog",      f: "animals", t: [-1, -2, 0, 2], tag: "For the one who does nothing for hours, then everything at once.",
                 practice: "Sit on your lily pad until you actually want to jump. Not before." },
    cobra:     { name: "The Cobra",     f: "animals", t: [1, -2, -2, 1], tag: "For the one who looks intense but is only concentrating.",
                 practice: "Unclench the jaw. Lower the shoulders. You can strike later if it still matters." },
    owl:       { name: "The Owl",       f: "animals", t: [-2, -2, -2, 0], tag: "For the one who does their best thinking at 2 am.",
                 practice: "Write the 2 am thought down and close the notebook. It will keep until morning." },
    pig:       { name: "The Pig",       f: "animals", t: [0, 0, 2, 2], tag: "For the one who is having a lovely time, thank you.",
                 practice: "Enjoy one thing today all the way to the end, without improving it." },
    monkey:    { name: "The Monkey",    f: "animals", t: [2, 0, -2, 2], tag: "For the one whose mind has already left the room.",
                 practice: "When the mind swings off, say 'thinking' and come back. No scolding. Monkeys hate scolding." },
    octopus:   { name: "The Octopus",   f: "animals", t: [0, -1, -2, 1], tag: "For the one doing eight things, six of them well.",
                 practice: "Put seven arms down. Give the eighth thing everything." },
    fish:      { name: "The Fish",      f: "animals", t: [0, 1, 1, 1], tag: "For the one who goes where the group goes, and is happy there.",
                 practice: "Stop swimming for one breath. Notice the water is still holding you up." },
    giraffe:   { name: "The Giraffe",   f: "animals", t: [-1, -1, 0, -1], tag: "For the one who saw it coming from a long way off.",
                 practice: "Bring your head down to where everyone else is for one conversation today." },
    jester:    { name: "The Jester",    f: "characters", t: [0, 2, -1, 2],    tag: "For the one who says the true thing as a joke.",
                 practice: "Say one true thing today without the joke. The bells can stay on." },
    unicorn:   { name: "The Unicorn",   f: "creatures", t: [2, 0, 2, 1], tag: "For the one who is told they can't be real, and turns up anyway.",
                 practice: "Do one thing today exactly the way you would if nobody was watching." },
    cyclops:   { name: "The Cyclops",   f: "creatures", t: [-1, 0, -1, 0], tag: "For the one who can only look at one thing at a time.",
                 practice: "Pick the one thing. Look at it until it is done." },
    minotaur:  { name: "The Minotaur",  f: "creatures", t: [0, 1, -2, -1], tag: "For the one who knows the way out and stays to help.",
                 practice: "Walk someone through the part you already know by heart." },
    ghost:     { name: "The Ghost",     f: "creatures", t: [-1, -1, 1, -1], tag: "For the one who was here the whole time.",
                 practice: "Say one thing in the next meeting before anyone asks you." },
    mummy:     { name: "The Mummy",     f: "creatures", t: [-1, 0, -1, 1], tag: "For the one holding it together, loosely.",
                 practice: "Unwind one thing you wrapped up too tight." },
    dragon:    { name: "The Dragon",    f: "creatures", t: [2, -2, 0, 1],    tag: "For the one sitting on a pile of unfinished projects.",
                 practice: "Pick one treasure from the hoard and give it away finished." },
    elf:       { name: "The Elf",       f: "creatures", t: [0, 1, 1, -1], tag: "For the one who makes the thing and lets someone else hand it over.",
                 practice: "Sign your work today." },
    orc:       { name: "The Orc",       f: "creatures", t: [-1, 1, -2, 2], tag: "For the one who looks cross and is only thinking.",
                 practice: "Tell one person what the face means." },
    troll:     { name: "The Troll",     f: "creatures", t: [-1, -1, 1, 1], tag: "For the one who is happy under the bridge, thanks.",
                 practice: "Let one person cross today without the riddle." },
    zeus:      { name: "Zeus",          f: "characters", t: [1, 1, -1, 0],    tag: "For the one whose mood sets the weather in the room.",
                 practice: "Before you thunder, count to five. Most storms pass on their own." },
    beard:     { name: "The Beard",     f: "people", t: [-1, 1, -1, 0],  tag: "For the one who says 'let me think about that' and then does.",
                 practice: "Give the next question a full breath before you answer it." },
    longhair:  { name: "The Long Hair", f: "people", t: [-2, -2, 1, 2], tag: "For the one who lets things take as long as they take.",
                 practice: "Do one thing today at the speed it wants to go." },
    bun:       { name: "The Bun",       f: "people", t: [0, 0, 0, -1],   tag: "For the one with everything tied up and out of the way.",
                 practice: "Let one thing down today. It can go back up tomorrow." },
    ponytail:  { name: "The Ponytail",  f: "people", t: [2, 1, 0, 0],    tag: "For the one already halfway out the door.",
                 practice: "Stop in the doorway. One breath. Then go." },
    curls:     { name: "The Curls",     f: "people", t: [0, 2, 1, 1],    tag: "For the one who will not be brushed into line.",
                 practice: "Leave one thing today exactly as untidy as it wants to be." },
    glasses:   { name: "The Glasses",   f: "people", t: [-2, -2, -2, -1], tag: "For the one who read the terms and conditions.",
                 practice: "Take them off. Let the room go soft for one minute." }
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

  // Asked first. It picks the family; the six questions above then pick the head within it.
  var FAMILY_QUESTION = { q: "Who would you rather share a desk with?", a: [
    ["Someone with a story to tell", "characters"],
    ["Someone who could be sitting across from you", "people"],
    ["An animal that asks no questions", "animals"],
    ["Something that, strictly speaking, should not exist", "creatures"] ] };

  var BODY_QUESTION = { q: "And where are you at the moment?", a: [
    ["Sitting with it", "seated"],
    ["Standing by, in no hurry", "standing"],
    ["On my way somewhere", "walking"] ] };

  // Largest swing each trait can get from the questions, so answers scale to -2..2.
  var SPAN = [0, 0, 0, 0];
  QUESTIONS.forEach(function (q) {
    for (var i = 0; i < 4; i++) {
      SPAN[i] += Math.max.apply(null, q.a.map(function (a) { return Math.abs(a[1][i]); }));
    }
  });

  // answers: one option index per trait question. family: optional family id.
  // Returns the heads (of that family, or all of them) ordered from closest to furthest.
  function rank(answers, family) {
    var v = [0, 0, 0, 0];
    answers.forEach(function (pick, qi) {
      var d = QUESTIONS[qi].a[pick][1];
      for (var i = 0; i < 4; i++) v[i] += d[i];
    });
    for (var i = 0; i < 4; i++) v[i] = 2 * v[i] / SPAN[i] * api.stretch;
    var scored = [];
    Object.keys(HEADS).forEach(function (id, order) {
      if (family && HEADS[id].f !== family) return;
      var t = HEADS[id].t, d = 0;
      for (var i = 0; i < 4; i++) d += (t[i] - v[i]) * (t[i] - v[i]);
      scored.push([d, order, id]);
    });
    scored.sort(function (a, b) { return Math.abs(a[0] - b[0]) > 1e-9 ? a[0] - b[0] : a[1] - b[1]; });
    return scored.map(function (x) { return x[2]; });
  }
  function match(answers, family) { return rank(answers, family)[0]; }

  // stretch: nobody answers at the extreme on every question, so answers are
  // scaled up before matching. Tuned so every head comes up within its family (see docs/QUIZ.md).
  var api = { stretch: 2.6, BODIES: BODIES, HEADS: HEADS, QUESTIONS: QUESTIONS, BODY_QUESTION: BODY_QUESTION,
              FAMILIES: FAMILIES, FAMILY_QUESTION: FAMILY_QUESTION, rank: rank, match: match };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.QUIET_COMPANY = api;
})();
