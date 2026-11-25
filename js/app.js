import { CATS, catSVG } from './cats.js';
import { TOPICS, topicById, SLOT, pick } from './tasks.js';

// ================= Состояние =================
const KEY = 'kitten-math-v1';
const DEFAULTS = { fish: 0, solved: 0, progress: {}, settings: { sound: true, unlockAll: false, perRound: 8 } };
let S = load();
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s) return { ...DEFAULTS, ...s, settings: { ...DEFAULTS.settings, ...s.settings } };
  } catch { /* приватный режим и т.п. */ }
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* нет хранилища */ } }

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const CAT_ORDER = ['kompot', 'karamelka', 'korzhik'];

// ================= Мягкие звуки и котячьи голоса =================
let actx = null;
function ac() {
  if (!actx) { const C = window.AudioContext || window.webkitAudioContext; if (C) actx = new C(); }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function bell(f, t0, dur, vol = 0.12, f2) {
  const a = ac(); if (!a) return;
  const t = a.currentTime + t0;
  const o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
  o1.type = 'sine'; o2.type = 'triangle';
  o1.frequency.setValueAtTime(f, t);
  o2.frequency.setValueAtTime(f * 2, t);
  if (f2) {
    o1.frequency.exponentialRampToValueAtTime(f2, t + dur);
    o2.frequency.exponentialRampToValueAtTime(f2 * 2, t + dur);
  }
  const g2 = a.createGain();
  g2.gain.value = 0.16;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o1.connect(g); o2.connect(g2).connect(g); g.connect(a.destination);
  o1.start(t); o2.start(t); o1.stop(t + dur + 0.04); o2.stop(t + dur + 0.04);
}
const CAT_PITCH = {
  kompot:    { f0: 380, fp: 540, f1: 350, dur: 0.34 },
  korzhik:   { f0: 500, fp: 720, f1: 460, dur: 0.28 },
  karamelka: { f0: 630, fp: 900, f1: 590, dur: 0.25 },
};
function kittenNote(t0, f0, fp, f1, dur, vol = 0.13) {
  const a = ac(); if (!a) return;
  const t = a.currentTime + t0;
  // Мягкий тембр: чистая основа + тёплая 2-я гармоника через плавный формантный фильтр («ми-и-у»)
  const o1 = a.createOscillator(), o2 = a.createOscillator();
  const g2 = a.createGain(), lp = a.createBiquadFilter(), g = a.createGain();
  o1.type = 'sine'; o2.type = 'triangle';
  g2.gain.value = 0.28;
  lp.type = 'lowpass'; lp.Q.value = 1.6;
  lp.frequency.setValueAtTime(f0 * 1.6, t);
  lp.frequency.exponentialRampToValueAtTime(fp * 2.4, t + dur * 0.42);
  lp.frequency.exponentialRampToValueAtTime(f1 * 1.5, t + dur);

  o1.frequency.setValueAtTime(f0, t);
  o1.frequency.exponentialRampToValueAtTime(fp, t + dur * 0.42);
  o1.frequency.exponentialRampToValueAtTime(f1, t + dur);
  o2.frequency.setValueAtTime(f0 * 2, t);
  o2.frequency.exponentialRampToValueAtTime(fp * 2, t + dur * 0.42);
  o2.frequency.exponentialRampToValueAtTime(f1 * 2, t + dur);

  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.035, dur * 0.22));
  g.gain.exponentialRampToValueAtTime(vol * 0.72, t + dur * 0.65);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  o1.connect(lp); o2.connect(g2).connect(lp); lp.connect(g).connect(a.destination);
  o1.start(t); o2.start(t); o1.stop(t + dur + 0.04); o2.stop(t + dur + 0.04);
}
const SFX = {
  tap() { bell(640, 0, 0.07, 0.07, 740); },
  pop() { bell(720, 0, 0.09, 0.09, 1180); },
  hint() { [523, 659, 784].forEach((f, i) => bell(f, i * 0.06, 0.22, 0.08)); },
  ok(catId) {
    [523, 659, 784, 1047].forEach((f, i) => bell(f, i * 0.075, 0.28, 0.11));
    const p = CAT_PITCH[catId] || CAT_PITCH.korzhik;
    kittenNote(0.24, p.f0 * 1.05, p.fp * 1.12, p.fp * 0.98, 0.18, 0.09);
  },
  bad() { bell(330, 0, 0.16, 0.1, 270); bell(270, 0.13, 0.22, 0.08, 220); },
  meow(catId) {
    const p = CAT_PITCH[catId] || CAT_PITCH.korzhik;
    const j = 0.96 + Math.random() * 0.08;
    kittenNote(0, p.f0 * j, p.fp * j, p.f1 * j, p.dur, 0.14);
  },
  miumiu(catId) {
    const p = CAT_PITCH[catId] || CAT_PITCH.karamelka;
    [0.95, 1.06, 1.18].forEach((k, i) => {
      kittenNote(i * 0.19, p.f0 * k, p.fp * k, p.f1 * k, 0.17, 0.12);
    });
  },
  win() {
    [523, 659, 784, 659, 784, 1047].forEach((f, i) => bell(f, i * 0.11, 0.32, 0.1));
    SFX.miumiu('karamelka');
  },
};
function play(name, arg) { if (S.settings.sound) SFX[name]?.(arg); }

// ================= Мелочи UI =================
function animate(el, cls, ms = 700) {
  if (!el) return;
  el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}
function setMood(svg, mood, back = 0) {
  if (!svg) return;
  svg.dataset.mood = mood;
  if (back) setTimeout(() => { svg.dataset.mood = 'happy'; }, back);
}
function updateFish() { $$('.fish-count').forEach((el) => { el.textContent = S.fish; }); }
let toastTimer;
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
function confetti(n = 60) {
  const box = $('#confetti');
  const colors = ['#FF5C8A', '#FFD23F', '#3DBE6B', '#3F7FD8', '#F5841F', '#B388FF'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = pick(colors);
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * 0.4 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}
function flyFish(fromEl) {
  const target = $('#game .fish-pill');
  if (!fromEl || !target) return;
  const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'flyer'; f.textContent = '🐟';
  f.style.left = a.left + a.width / 2 + 'px'; f.style.top = a.top + a.height / 2 + 'px';
  document.body.appendChild(f);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    f.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.6)`;
    f.style.opacity = '0.2';
  }));
  setTimeout(() => { f.remove(); animate(target, 'pop', 400); updateFish(); }, 750);
}

// ================= Навигация =================
let current = 'home';
let aquaReturn = 'home';
function show(id) {
  if (id === 'aquarium') aquaReturn = current;
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  document.documentElement.classList.toggle('on-home', id === 'home');
  current = id;
  if (id === 'home') renderHome();
  if (id === 'topics') renderTopics();
  if (id === 'aquarium') renderAquarium();
  if (id === 'settings') renderSettings();
  updateFish();
}
document.addEventListener('click', (e) => {
  const g = e.target.closest('[data-go]');
  if (!g) return;
  play('tap');
  const to = g.dataset.go;
  show(to === 'back' ? aquaReturn : to);
});

// ================= Главный экран =================
function trioHTML() {
  return CAT_ORDER.map((id) => `<div class="cat-wrap" data-cat="${id}">${catSVG(id)}</div>`).join('');
}
function renderHome() {
  const trio = $('#trio');
  if (!trio.children.length) trio.innerHTML = trioHTML();
}
let catTapCount = 0;
function catTap(e) {
  const w = e.target.closest('.cat-wrap');
  if (!w) return;
  const id = w.dataset.cat;
  const svg = w.querySelector('svg');
  animate(svg, 'jump'); setMood(svg, 'wow', 900);
  catTapCount++;
  play(catTapCount % 3 === 0 ? 'miumiu' : 'meow', id);
  toast(CATS[id].intro);
}
$('#trio').addEventListener('click', catTap);
$('#resultTrio').addEventListener('click', catTap);

// Кнопка настроек: нужно удерживать (родительский «замок»)
(() => {
  const btn = $('#gearBtn'); let timer = 0;
  const start = (e) => { e.preventDefault(); btn.classList.add('holding'); timer = setTimeout(() => { btn.classList.remove('holding'); play('tap'); show('settings'); }, 1500); };
  const stop = () => { if (timer) { clearTimeout(timer); timer = 0; } btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
  btn.addEventListener('click', () => { if (current === 'home') toast('Для взрослых: удерживайте кнопку'); });
})();

// ================= Темы и уровни =================
function stars(tid) { return S.progress[tid] || []; }
function isUnlocked(t, i) {
  if (S.settings.unlockAll || i === 0) return true;
  const p = stars(t.id);
  return (p[i - 1] || 0) >= 2 || (p[i] || 0) > 0;
}
function catIcon(t) {
  if (t.cat === 'all') return `<span class="heads">${CAT_ORDER.map((id) => catSVG(id, { headOnly: true })).join('')}</span>`;
  return catSVG(t.cat, { headOnly: true });
}
function renderTopics() {
  $('#topicGrid').innerHTML = TOPICS.map((t) => {
    const got = stars(t.id).reduce((a, b) => a + (b || 0), 0);
    const max = t.levels.length * 3;
    return `<button class="topic" data-topic="${t.id}" style="--c:${t.color}">
      <span class="t-icon">${t.icon}</span>
      <span class="t-title">${t.title}</span>
      <span class="t-foot"><span class="t-cat">${catIcon(t)}</span><span class="t-stars">★ ${got}/${max}</span></span>
      <span class="t-bar"><i style="width:${(got / max) * 100}%"></i></span>
    </button>`;
  }).join('');
}
$('#topicGrid').addEventListener('click', (e) => {
  const b = e.target.closest('.topic'); if (!b) return;
  play('tap'); openLevels(b.dataset.topic);
});
let modalTopic = null;
function openLevels(tid) {
  const t = topicById(tid); modalTopic = t;
  $('#modalTitle').textContent = t.title;
  $('#modalCat').innerHTML = catIcon(t);
  const p = stars(t.id);
  $('#levelGrid').innerHTML = t.levels.map((L, i) => {
    const open = isUnlocked(t, i);
    const s = p[i] || 0;
    return `<button class="level ${open ? '' : 'locked'}" data-level="${i}" style="--c:${t.color}">
      <b>${open ? i + 1 : '🔒'}</b><span>${L.desc}</span>
      <em>${'★'.repeat(s)}<span class="dim">${'★'.repeat(3 - s)}</span></em></button>`;
  }).join('');
  $('#levelModal').classList.add('open');
}
function closeModal() { $('#levelModal').classList.remove('open'); }
$('#closeModal').addEventListener('click', () => { play('tap'); closeModal(); });
$('#levelModal').addEventListener('click', (e) => { if (e.target.id === 'levelModal') closeModal(); });
$('#levelGrid').addEventListener('click', (e) => {
  const b = e.target.closest('.level'); if (!b) return;
  if (b.classList.contains('locked')) { play('bad'); animate(b, 'shake', 500); toast('Сначала пройди прошлый уровень на 2 звезды ★★'); return; }
  play('tap'); startRound(modalTopic.id, Number(b.dataset.level));
});

// ================= Наглядность =================
function vsize(n) {
  if (n <= 5) return 'min(13vmin, 5.5rem)';
  if (n <= 10) return 'min(9.5vmin, 4.4rem)';
  if (n <= 20) return 'min(7vmin, 3.4rem)';
  if (n <= 40) return 'min(5.2vmin, 2.6rem)';
  return 'min(4.2vmin, 2rem)';
}
function items(n, e, cls = () => '') {
  let h = '<span class="grp">';
  for (let i = 0; i < n; i++) {
    if (i && i % 5 === 0) h += '</span><span class="grp">';
    h += `<span class="o ${cls(i)}" style="--d:${i * 40}ms">${e}</span>`;
  }
  return h + '</span>';
}
function visualHTML(v) {
  switch (v.type) {
    case 'objects':
      return `<div class="objset countable" style="--s:${vsize(v.n)}">${items(v.n, v.e)}</div>`;
    case 'tens': {
      const t = Math.floor(v.n / 10), o = v.n % 10;
      const rod = '<span class="rod">' + '<i></i>'.repeat(10) + '</span>';
      return `<div class="tens">${rod.repeat(t)}<span class="ones">${'<i></i>'.repeat(o)}</span></div>`;
    }
    case 'add':
      return `<div class="vrow" style="--s:${vsize(v.a + v.b)}"><div class="objset">${items(v.a, v.e1)}</div><span class="vop">+</span><div class="objset">${items(v.b, v.e2)}</div></div>`;
    case 'sub':
      return `<div class="objset" style="--s:${vsize(v.a)}">${items(v.a, v.e, (i) => (i >= v.a - v.b ? 'gone' : ''))}</div>`;
    case 'mul':
      return `<div class="plates" style="--s:${vsize(Math.max(v.per * v.groups, 12))}">${Array.from({ length: v.groups }, () => `<span class="plate">${items(v.per, v.e)}</span>`).join('')}</div>`;
    case 'div': {
      const heads = Array.from({ length: v.k }, (_, i) => `<div class="share"><div class="mini">${catSVG(CAT_ORDER[i % 3], { headOnly: true })}</div><div class="plate" data-plate="${i}"></div></div>`).join('');
      return `<div class="divbox" style="--s:${vsize(Math.max(v.n / 1.5, 6))}"><div class="objset pile">${items(v.n, v.e)}</div><p class="tiny">Нажимай на ${v.e} — и раздавай по очереди!</p><div class="shares">${heads}</div></div>`;
    }
    case 'compare':
      return `<div class="vrow cmp" style="--s:${vsize(Math.max(v.a, v.b) * 2)}"><div class="objset col">${items(v.a, v.e)}</div><span class="vop">?</span><div class="objset col">${items(v.b, v.e)}</div></div>`;
    case 'bond':
      return `<div class="objset" style="--s:${vsize(v.total)}">${items(v.total, '', (i) => (i < v.known ? 'filled' : 'empty'))}</div>`
        .replace(/<span class="o filled"([^>]*)><\/span>/g, `<span class="o"$1>${v.e}</span>`);
    default: return '';
  }
}
function showVisual(v) {
  const box = $('#visual');
  if (!v || box.dataset.shown === '1') return;
  box.innerHTML = visualHTML(v);
  box.dataset.shown = '1';
  box.dataset.type = v.type;
}
// Интерактив: пересчёт касанием и раздача при делении
$('#visual').addEventListener('click', (e) => {
  const o = e.target.closest('.o'); if (!o) return;
  const box = $('#visual');
  if (o.closest('.pile')) {
    const plates = box.querySelectorAll('.plate');
    const dealt = Number(box.dataset.dealt || 0);
    const plate = plates[dealt % plates.length];
    o.classList.remove('o'); o.classList.add('o', 'dealt');
    plate.appendChild(o); box.dataset.dealt = dealt + 1;
    play('pop');
    return;
  }
  if (o.closest('.countable') && !o.dataset.n) {
    const c = Number(box.dataset.counted || 0) + 1;
    box.dataset.counted = c; o.dataset.n = c; o.classList.add('counted');
    play('pop');
  }
});

// ================= Игра =================
const PRAISE = ['Молодец!', 'Верно!', 'Супер!', 'Умница!', 'Так держать!', 'Миу-миу-миу! Правильно!', 'Здорово!', 'Отлично!', 'Ты настоящий математик!'];
const AGAIN = ['Попробуй ещё!', 'Почти! Подумай ещё.', 'Не спеши, посчитай ещё раз.', 'Хм-м… Давай ещё разок!'];
const START = ['Давай решим!', 'Подумай!', 'Ты справишься!', 'Интересно, сколько?'];
let R = null;

function startRound(tid, lvl) {
  const t = topicById(tid);
  R = { t, lvl, i: 0, total: Number(S.settings.perRound) || 8, wrongTasks: 0, earned: 0, seen: new Set(), results: [], task: null, tries: 0, locked: false, pad: '', guideId: null };
  closeModal();
  show('game');
  nextTask();
}
function genTask() {
  const L = R.t.levels[R.lvl];
  let task;
  for (let k = 0; k < 40; k++) {
    task = L.gen();
    const key = JSON.stringify(task.tokens) + (task.story || '') + task.answer;
    if (!R.seen.has(key)) { R.seen.add(key); break; }
  }
  return task;
}
function renderDots() {
  $('#dots').innerHTML = Array.from({ length: R.total }, (_, i) => {
    const r = R.results[i];
    return `<i class="${r === true ? 'ok' : r === false ? 'meh' : i === R.i ? 'cur' : ''}"></i>`;
  }).join('');
}
function guideSVG() { return $('#guideCat svg'); }
function setGuide(id) {
  if (R.guideId === id) return;
  R.guideId = id;
  $('#guideCat').innerHTML = catSVG(id);
}
$('#guideCat').addEventListener('click', () => {
  const svg = guideSVG();
  if (!svg || !R?.guideId) return;
  animate(svg, 'jump'); setMood(svg, 'wow', 800);
  play('meow', R.guideId);
});
function bubble(text) {
  const b = $('#bubble'); b.textContent = text; animate(b, 'pop', 400);
}
function renderTokens(tokens, isSeq) {
  return tokens.map((t) => {
    if (t === SLOT) return '<span class="slot">?</span>';
    if (t === ',') return '<span class="comma"></span>';
    if (typeof t === 'number') return `<span class="${isSeq ? 'n seq' : 'n'}">${t}</span>`;
    if (t === '(' || t === ')') return `<span class="br">${t}</span>`;
    return `<span class="op">${t}</span>`;
  }).join('');
}
function nextTask() {
  if (R.i >= R.total) return finishRound();
  const T = R.task = genTask();
  R.tries = 0; R.locked = false; R.pad = '';
  renderDots();
  const gid = R.t.cat === 'all' ? (T.storyCats ? T.storyCats[0] : pick(CAT_ORDER)) : R.t.cat;
  setGuide(gid);

  const prompt = $('#prompt');
  prompt.textContent = T.story || T.prompt || '';
  prompt.className = 'prompt' + (T.story ? ' story' : '') + (prompt.textContent ? '' : ' empty');
  const ex = $('#expr');
  ex.innerHTML = renderTokens(T.tokens, T.seq);
  ex.className = 'expr' + (T.tokens.length > 7 ? ' long' : '') + (T.tokens.length === 1 ? ' solo' : '');
  const vis = $('#visual');
  vis.innerHTML = ''; vis.dataset.shown = ''; vis.dataset.dealt = ''; vis.dataset.counted = '';
  if (T.visual && T.showVisual) showVisual(T.visual);
  $('#hintText').textContent = '';
  $('#taskCard').classList.toggle('has-visual', !!(T.visual && T.showVisual));
  animate($('#taskCard'), 'enter', 500);

  bubble(T.bubble || pick(START));
  renderAnswers();
}
function renderAnswers() {
  const T = R.task, box = $('#answers');
  if (T.input === 'pad') {
    box.className = 'answers pad';
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'];
    box.innerHTML = keys.map((k) => {
      const cls = k === '✓' ? 'ok-key' : k === '⌫' ? 'del-key' : (k >= 1 && k <= 5 ? 'ka' : 'kb');
      return `<button class="key ${cls}" data-k="${k}">${k}</button>`;
    }).join('');
  } else {
    box.className = 'answers choices' + (T.input === 'compare' ? ' compare' : '');
    box.innerHTML = T.choices.map((c) => `<button class="ans" data-v="${c}">${c}${T.labels ? `<small>${T.labels[c]}</small>` : ''}</button>`).join('');
  }
}
function slotEl() { return $('#expr .slot'); }
function updatePadSlot() {
  const s = slotEl(); if (!s) return;
  s.textContent = R.pad || '?';
  s.classList.toggle('typing', !!R.pad);
}
$('#answers').addEventListener('click', (e) => {
  if (!R) return;
  const next = e.target.closest('.next-btn');
  if (next) { play('tap'); nextTask(); return; }
  if (R.locked) return;
  const ans = e.target.closest('.ans');
  if (ans) {
    if (ans.disabled) return;
    const v = R.task.input === 'compare' ? ans.dataset.v : Number(ans.dataset.v);
    check(v, ans);
    return;
  }
  const key = e.target.closest('.key');
  if (!key) return;
  const k = key.dataset.k;
  play('tap');
  if (k === '⌫') R.pad = R.pad.slice(0, -1);
  else if (k === '✓') { if (R.pad !== '') check(Number(R.pad), key); else animate(slotEl(), 'shake', 500); return; }
  else if (R.pad.length < 3) R.pad = (R.pad === '0' ? '' : R.pad) + k;
  updatePadSlot();
});
function check(v, btn) {
  const T = R.task;
  const svg = guideSVG();
  if (v === T.answer) {
    R.locked = true;
    const s = slotEl();
    s.textContent = T.answer; s.className = 'slot good';
    animate(s, 'pop', 500);
    if (btn && btn.classList.contains('ans')) btn.classList.add('good');
    play('ok', R.guideId);
    const first = R.tries === 0;
    if (first) { R.earned++; S.fish++; flyFish(s); }
    S.solved++; save();
    R.results[R.i] = first; R.i++;
    renderDots();
    setMood(svg, 'wow', 1100); animate(svg, 'jump');
    bubble(pick(PRAISE));
    if (T.visual && $('#visual').dataset.shown !== '1' && T.visual.type !== 'div') showVisual(T.visual);
    setTimeout(() => { if (current === 'game' && R && R.task === T) nextTask(); }, 1500);
    return;
  }
  // ошибка
  R.tries++;
  if (R.tries === 1) R.wrongTasks++;
  play('bad');
  setMood(svg, 'sad', 1200); animate(svg, 'shake', 600);
  if (btn && btn.classList.contains('ans')) { btn.classList.add('wrong'); btn.disabled = true; animate(btn, 'shake', 500); }
  if (T.input === 'pad') { R.pad = ''; updatePadSlot(); animate(slotEl(), 'shake', 500); }
  const maxTries = T.input === 'compare' ? 2 : 3;
  if (R.tries >= maxTries) return reveal();
  if (R.tries === 1) {
    bubble(pick(AGAIN));
    if (T.visual) showVisual(T.visual);
  } else {
    giveHint();
  }
}
function giveHint() {
  const T = R.task;
  if (T.visual) showVisual(T.visual);
  const h = T.hint || 'Подумай ещё. Можно посчитать на пальчиках!';
  $('#hintText').textContent = '💡 ' + h;
  bubble('Вот подсказка!');
}
function reveal() {
  const T = R.task;
  R.locked = true;
  const s = slotEl(); s.textContent = T.answer; s.className = 'slot reveal';
  R.results[R.i] = false; R.i++;
  renderDots();
  if (T.visual) showVisual(T.visual);
  const ansWord = T.input === 'compare' ? { '<': 'меньше', '>': 'больше', '=': 'равно' }[T.answer] : T.answer;
  bubble(`Правильный ответ: ${ansWord}. В следующий раз получится!`);
  $('#answers').className = 'answers';
  $('#answers').innerHTML = '<button class="big-btn next-btn">Дальше ▶</button>';
}
$('#hintBtn').addEventListener('click', () => { if (R?.task) { play('hint'); giveHint(); } });
$('#quitBtn').addEventListener('click', () => { play('tap'); R = null; show('topics'); });

function finishRound() {
  const t = R.t, lvl = R.lvl;
  const w = R.wrongTasks;
  const st = w === 0 ? 3 : w <= Math.ceil(R.total * 0.25) ? 2 : 1;
  const p = S.progress[t.id] || (S.progress[t.id] = []);
  p[lvl] = Math.max(p[lvl] || 0, st);
  let bonus = st === 3 ? 3 : 0;
  S.fish += bonus; save();

  show('result');
  const title = st === 3 ? 'Великолепно!' : st === 2 ? 'Отлично!' : 'Хорошо! Потренируемся ещё?';
  $('#resultTitle').textContent = title;
  $('#resultStars').innerHTML = [0, 1, 2].map((i) => `<span class="${i < st ? 'on' : ''}" style="--d:${0.3 + i * 0.35}s">★</span>`).join('');
  $('#resultFish').textContent = R.earned + bonus
    ? `+${R.earned + bonus} 🐟` + (bonus ? ' (бонус за 3 звезды!)' : '')
    : 'Рыбки ждут тебя в следующем раунде! 🐟';
  $('#resultTrio').innerHTML = trioHTML();
  $$('#resultTrio svg').forEach((s, i) => { if (st >= 2) { s.dataset.mood = 'wow'; s.style.animationDelay = i * 0.15 + 's'; s.classList.add('dance'); } });
  const hasNext = lvl + 1 < t.levels.length;
  const nextOpen = hasNext && isUnlocked(t, lvl + 1);
  const nb = $('#nextBtn');
  nb.style.display = nextOpen ? '' : 'none';
  $('#againBtn').classList.toggle('secondary', nextOpen);
  play('win');
  if (st >= 2) confetti(st === 3 ? 90 : 45);
}
$('#againBtn').addEventListener('click', () => { play('tap'); startRound(R.t.id, R.lvl); });
$('#nextBtn').addEventListener('click', () => { play('tap'); startRound(R.t.id, R.lvl + 1); });

// ================= Аквариум =================
const SPECIES = [
  { e: '🐟', at: 0 }, { e: '🐠', at: 15 }, { e: '🐡', at: 40 }, { e: '🦀', at: 70 },
  { e: '🐙', at: 110 }, { e: '🐢', at: 160 }, { e: '🦈', at: 230 }, { e: '🐳', at: 320 },
];
const SEAWEED_SVG = '<svg viewBox="0 0 64 80" width="56" height="70" aria-hidden="true"><path d="M22 78 C 12 58, 28 42, 16 20 C 12 12, 18 6, 24 14 C 34 32, 22 50, 30 78 Z" fill="#2EB85C" stroke="#1B7A3B" stroke-width="2.5"/><path d="M40 78 C 52 56, 36 38, 48 14 C 52 6, 44 4, 38 14 C 28 36, 42 54, 34 78 Z" fill="#46D66E" stroke="#1B7A3B" stroke-width="2.5"/></svg>';
const CORAL_SVG = '<svg viewBox="0 0 72 68" width="62" height="58" aria-hidden="true"><path d="M36 64 V32 M36 44 C26 42, 18 34, 16 22 M24 34 C16 32, 10 26, 8 18 M36 38 C46 36, 54 28, 56 16 M48 30 C56 28, 62 22, 64 14 M36 32 C34 22, 32 14, 36 8" fill="none" stroke="#FF6B7A" stroke-width="9" stroke-linecap="round"/><path d="M36 64 V32 M36 44 C26 42, 18 34, 16 22 M24 34 C16 32, 10 26, 8 18 M36 38 C46 36, 54 28, 56 16 M48 30 C56 28, 62 22, 64 14 M36 32 C34 22, 32 14, 36 8" fill="none" stroke="#FF949E" stroke-width="4" stroke-linecap="round"/></svg>';
function renderAquarium() {
  const tank = $('#tank');
  tank.querySelectorAll('.swim, .weed').forEach((n) => n.remove());
  const open = SPECIES.filter((s) => S.fish >= s.at);
  const count = Math.min(S.fish, 36);
  for (let i = 0; i < 5; i++) {
    const w = document.createElement('span'); w.className = 'weed'; w.innerHTML = i % 2 ? SEAWEED_SVG : CORAL_SVG;
    w.style.left = 6 + i * 21 + Math.random() * 6 + '%'; w.style.animationDelay = (-i * 0.7) + 's'; tank.appendChild(w);
  }
  for (let i = 0; i < count; i++) {
    const sp = i < open.length ? open[open.length - 1 - i] : open[Math.floor(Math.random() * open.length)];
    const f = document.createElement('span');
    const right = Math.random() < 0.5;
    f.className = 'swim' + (right ? ' right' : '') + (sp.e === '🦀' ? ' crawl' : '');
    f.textContent = sp.e;
    f.style.top = (sp.e === '🦀' ? 80 + Math.random() * 6 : 8 + Math.random() * 66) + '%';
    f.style.animationDuration = 9 + Math.random() * 14 + 's';
    f.style.animationDelay = -Math.random() * 20 + 's';
    f.style.fontSize = (sp.e === '🐳' || sp.e === '🦈' ? 3.4 : 2 + Math.random() * 1.2) + 'rem';
    tank.appendChild(f);
  }
  const next = SPECIES.find((s) => s.at > S.fish);
  $('#tankGoal').textContent = S.fish === 0
    ? 'Решай задачки — и в аквариуме появятся рыбки!'
    : next ? `Ещё ${next.at - S.fish} 🐟 — и в аквариум приплывёт ${next.e}!` : 'Все жители собраны! Ты супер-математик!';
}
$('#tank').addEventListener('click', (e) => {
  const f = e.target.closest('.swim'); if (!f) return;
  play('pop'); animate(f, 'spin', 800);
});

// ================= Настройки =================
function renderSettings() {
  $('#setSound').checked = S.settings.sound;
  $('#setUnlock').checked = S.settings.unlockAll;
  $('#setPerRound').value = String(S.settings.perRound);
  const total = TOPICS.reduce((a, t) => a + stars(t.id).reduce((x, y) => x + (y || 0), 0), 0);
  const max = TOPICS.reduce((a, t) => a + t.levels.length * 3, 0);
  $('#statsText').textContent = `★ ${total}/${max} · решено ${S.solved} · 🐟 ${S.fish}`;
}
$('#setSound').addEventListener('change', (e) => { S.settings.sound = e.target.checked; save(); });
$('#setUnlock').addEventListener('change', (e) => { S.settings.unlockAll = e.target.checked; save(); });
$('#setPerRound').addEventListener('change', (e) => { S.settings.perRound = Number(e.target.value); save(); });
$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Сбросить все звёзды и рыбок?')) return;
  S = JSON.parse(JSON.stringify({ ...DEFAULTS, settings: S.settings }));
  save(); renderSettings(); toast('Прогресс сброшен');
});

// ================= Старт =================
document.addEventListener('pointerdown', () => ac(), { once: true });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
show('home');

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
