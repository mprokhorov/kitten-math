// Генераторы заданий по темам и уровням.
import { CATS } from './cats.js';

export const SLOT = '?';

// ---------- утилиты ----------
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function plural(n, f) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return f[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return f[1];
  return f[2];
}

// Винительный падеж: «нашёл 1 рыбку», «съели 21 конфету»
function accN(n, o) { return n % 10 === 1 && n % 100 !== 11 ? (o.acc || o.f[0]) : plural(n, o.f); }

export const OBJS = [
  { e: '🐟', f: ['рыбка', 'рыбки', 'рыбок'], acc: 'рыбку', food: true },
  { e: '🍎', f: ['яблоко', 'яблока', 'яблок'], food: true },
  { e: '⭐', f: ['звёздочка', 'звёздочки', 'звёздочек'], acc: 'звёздочку' },
  { e: '🍓', f: ['ягодка', 'ягодки', 'ягодок'], acc: 'ягодку', food: true },
  { e: '🎈', f: ['шарик', 'шарика', 'шариков'] },
  { e: '🧶', f: ['клубок', 'клубка', 'клубков'] },
  { e: '🍬', f: ['конфета', 'конфеты', 'конфет'], acc: 'конфету', food: true },
  { e: '🌼', f: ['цветок', 'цветка', 'цветков'] },
  { e: '🦋', f: ['бабочка', 'бабочки', 'бабочек'], alive: true },
  { e: '🐭', f: ['мышка', 'мышки', 'мышек'], alive: true },
];
const obj = () => pick(OBJS);
const thing = () => pick(OBJS.filter((o) => !o.alive)); // для задачек: то, что можно взять и разложить
const twoObjs = () => { const s = shuffle(OBJS); return [s[0], s[1]]; };
const CAT_IDS = Object.keys(CATS);
const twoCats = () => { const s = shuffle(CAT_IDS); return [CATS[s[0]], CATS[s[1]]]; };
const v = (cat, m, f) => (cat.fem ? f : m);
const razy = (n) => plural(n, ['раз', 'раза', 'раз']);

const WORDS = { '+': 'плюс', '−': 'минус', '×': 'умножить на', '÷': 'разделить на', '=': 'равно', '(': '', ')': '' };
function sayTokens(tokens) {
  return tokens.map((t) => (t === SLOT ? 'какое число' : WORDS[t] ?? String(t))).filter(Boolean).join(' ');
}
export function exprSpeak(tokens) {
  const n = tokens.length;
  if (tokens[n - 1] === SLOT && tokens[n - 2] === '=') {
    return 'Сколько будет ' + sayTokens(tokens.slice(0, -2)) + '?';
  }
  const s = sayTokens(tokens);
  return s.charAt(0).toUpperCase() + s.slice(1) + '?';
}

// Варианты ответа: правильный + 3 правдоподобных, по возрастанию
export function makeChoices(ans, extra = []) {
  const set = new Set([ans]);
  const cands = shuffle([...extra, ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ...(ans >= 15 ? [ans + 10, ans - 10] : [])]);
  for (const c of cands) {
    if (set.size >= 4) break;
    if (Number.isInteger(c) && c >= (ans > 0 ? 1 : 0)) set.add(c);
  }
  let k = 4;
  while (set.size < 4) set.add(ans + k++);
  return [...set].sort((a, b) => a - b);
}

// Базовая сборка задания-выражения
function expr(tokens, answer, o = {}) {
  return {
    tokens, answer,
    speak: o.speak || exprSpeak(tokens),
    input: o.pad ? 'pad' : 'choices',
    choices: o.pad ? null : makeChoices(answer, o.extra),
    visual: o.visual || null,
    showVisual: !!o.showVisual,
    hint: o.hint || null,
    bubble: o.bubble || null,
    prompt: o.prompt || null,
    story: o.story || null,
  };
}

// ---------- СЧЁТ ----------
function countTask(min, max) {
  const o = obj(); const n = rnd(min, max);
  return {
    tokens: [SLOT], answer: n, input: 'choices', choices: makeChoices(n),
    prompt: `Сколько ${o.f[2]}?`, speak: `Сколько здесь ${o.f[2]}? Посчитай!`,
    visual: { type: 'objects', n, e: o.e }, showVisual: true, bubble: 'Посчитай!',
    hint: 'Показывай пальчиком на каждую и считай вслух.',
  };
}
function countTens(min, max, pad) {
  const n = rnd(min, max);
  return {
    tokens: [SLOT], answer: n, input: pad ? 'pad' : 'choices', choices: pad ? null : makeChoices(n, [n + 10, n - 10]),
    prompt: 'Сколько кубиков? В полоске — 10.',
    speak: 'Сколько всего кубиков? В каждой полоске десять кубиков.',
    visual: { type: 'tens', n }, showVisual: true, bubble: 'Считай десятками!',
    hint: `Сначала посчитай полоски: ${Math.floor(n / 10)} по 10. Потом отдельные кубики.`,
  };
}

// ---------- СРАВНЕНИЕ ----------
const CMP_LABELS = { '<': 'меньше', '=': 'равно', '>': 'больше' };
function cmpOf(a, b) { return a < b ? '<' : a > b ? '>' : '='; }
function compareTask(max, showVisual, min = 1) {
  let a = rnd(min, max), b = rnd(min, max);
  if (Math.random() < 0.2) b = a;
  else if (max > 20 && Math.random() < 0.5) b = Math.floor(a / 10) * 10 + rnd(0, 9);
  const o = obj();
  return {
    tokens: [a, SLOT, b], answer: cmpOf(a, b), input: 'compare', choices: ['<', '=', '>'], labels: CMP_LABELS,
    speak: `Сравни ${a} и ${b}. Какой знак поставить: больше, меньше или равно?`,
    visual: max <= 20 ? { type: 'compare', a, b, e: o.e } : null, showVisual,
    hint: max > 20 ? 'Сначала сравни десятки. Если они одинаковые — сравни единицы. Клювик смотрит на меньшее число!' : 'Клювик знака всегда смотрит на меньшее число.',
    bubble: 'Где больше?',
  };
}
function compareExpr() {
  const plus = Math.random() < 0.6;
  let a, b, val;
  if (plus) { a = rnd(1, 10); b = rnd(1, 10); val = a + b; } else { a = rnd(5, 20); b = rnd(1, a); val = a - b; }
  const c = Math.max(0, val + pick([-2, -1, 0, 0, 1, 2]));
  const op = plus ? '+' : '−';
  return {
    tokens: [a, op, b, SLOT, c], answer: cmpOf(val, c), input: 'compare', choices: ['<', '=', '>'], labels: CMP_LABELS,
    speak: `Сравни: ${a} ${WORDS[op]} ${b} и ${c}.`, visual: null, showVisual: false,
    hint: `Сначала посчитай: ${a} ${op} ${b} = ${val}`, bubble: 'Сначала посчитай!',
  };
}

// ---------- СЛОЖЕНИЕ ----------
function addSmall(maxSum, showVisual, minSum = 2) {
  const s = rnd(minSum, maxSum); const a = rnd(1, s - 1); const b = s - a;
  const [o1, o2] = twoObjs();
  let hint = 'Посчитай всё вместе!';
  if (s > 10) {
    const big = Math.max(a, b), small = Math.min(a, b), need = 10 - big;
    if (need > 0 && need < small) hint = `Дополни до десяти: ${big} + ${need} = 10, и ещё ${small - need}.`;
  }
  return expr([a, '+', b, '=', SLOT], s, {
    visual: { type: 'add', a, b, e1: o1.e, e2: o2.e }, showVisual, hint, bubble: 'Сложи!',
  });
}
function addHintBig(a, b) {
  const bt = b - (b % 10), bo = b % 10;
  if (bt && bo) return `${a} + ${bt} = ${a + bt}, потом ещё + ${bo}.`;
  if (bt) return `Считай десятками: ${Math.floor(a / 10)} дес. + ${bt / 10} дес.`;
  const need = 10 - (a % 10);
  if (bo > need) return `Дополни до круглого: ${a} + ${need} = ${a + need}, и ещё + ${bo - need}.`;
  return `Десятки не меняются, сложи единицы: ${a % 10} + ${bo}.`;
}
function addBig(two) {
  let a, b;
  if (!two) {
    if (Math.random() < 0.3) { a = rnd(1, 8) * 10; b = rnd(1, 9 - a / 10) * 10; }
    else { a = rnd(11, 89); b = rnd(2, 9); if (a + b > 100) a = 100 - b - rnd(0, 10); }
  } else { a = rnd(11, 79); b = rnd(11, 99 - a); }
  return expr([a, '+', b, '=', SLOT], a + b, { pad: true, hint: addHintBig(a, b), bubble: 'Сложи!' });
}

// ---------- ВЫЧИТАНИЕ ----------
function subSmall(maxA, showVisual, minA = 2) {
  const a = rnd(minA, maxA); const b = rnd(1, a - 1 > 0 ? a - 1 : 1);
  const o = obj();
  let hint = `Было ${a}, убери ${b}. Сколько осталось?`;
  if (a > 10 && b > a - 10) hint = `Сначала до десяти: ${a} − ${a - 10} = 10, и ещё − ${b - (a - 10)}.`;
  return expr([a, '−', b, '=', SLOT], a - b, {
    visual: { type: 'sub', a, b, e: o.e }, showVisual, hint, bubble: 'Вычти!',
  });
}
function subHintBig(a, b) {
  const bt = b - (b % 10), bo = b % 10;
  if (bt && bo) return `${a} − ${bt} = ${a - bt}, потом ещё − ${bo}.`;
  if (bt) return `Считай десятками: ${Math.floor(a / 10)} дес. − ${bt / 10} дес.`;
  const toRound = a % 10;
  if (bo > toRound && toRound > 0) return `Сначала до круглого: ${a} − ${toRound} = ${a - toRound}, и ещё − ${bo - toRound}.`;
  return `Десятки не меняются, вычти единицы: ${a % 10} − ${bo}.`;
}
function subBig(two) {
  let a, b;
  if (!two) {
    if (Math.random() < 0.3) { a = rnd(3, 10) * 10; b = rnd(1, a / 10 - 1) * 10; }
    else { a = rnd(12, 99); b = rnd(2, 9); }
  } else { a = rnd(30, 99); b = rnd(11, a - 5); }
  return expr([a, '−', b, '=', SLOT], a - b, { pad: true, hint: subHintBig(a, b), bubble: 'Вычти!' });
}

// ---------- НАЙДИ ЧИСЛО ----------
function missingAddSub(max, pad, onlyPlus) {
  const kind = onlyPlus ? rnd(0, 1) : rnd(0, 3);
  const c = rnd(onlyPlus ? 2 : 3, max);
  const a = rnd(1, c - 1), b = c - a;
  let tokens, answer, hint;
  switch (kind) {
    case 0: tokens = [SLOT, '+', b, '=', c]; answer = a; hint = `Какое число вместе с ${b} даёт ${c}? Посчитай от ${b} до ${c}.`; break;
    case 1: tokens = [a, '+', SLOT, '=', c]; answer = b; hint = `Сколько не хватает от ${a} до ${c}?`; break;
    case 2: tokens = [SLOT, '−', b, '=', a]; answer = c; hint = `Было неизвестно сколько, убрали ${b}, осталось ${a}. Сложи: ${a} + ${b}.`; break;
    default: tokens = [c, '−', SLOT, '=', a]; answer = b; hint = `Сколько убрали из ${c}, чтобы осталось ${a}?`;
  }
  const o = obj();
  const visual = onlyPlus ? { type: 'bond', known: kind === 0 ? b : a, total: c, e: o.e } : null;
  return expr(tokens, answer, { pad, visual, showVisual: !!visual, hint, bubble: 'Какое число спряталось?' });
}
function missingMulDiv() {
  const a = rnd(2, 9), b = rnd(2, 9), p = a * b;
  const kind = rnd(0, 3);
  let tokens, answer, hint;
  switch (kind) {
    case 0: tokens = [SLOT, '×', b, '=', p]; answer = a; hint = `Сколько раз по ${b} будет ${p}? Или раздели: ${p} ÷ ${b}.`; break;
    case 1: tokens = [a, '×', SLOT, '=', p]; answer = b; hint = `Раздели: ${p} ÷ ${a}.`; break;
    case 2: tokens = [SLOT, '÷', b, '=', a]; answer = p; hint = `Умножь: ${a} × ${b}.`; break;
    default: tokens = [p, '÷', SLOT, '=', a]; answer = b; hint = `На сколько надо умножить ${a}, чтобы получилось ${p}?`;
  }
  return expr(tokens, answer, { pad: true, hint, bubble: 'Какое число спряталось?' });
}

// ---------- ЗАКОНОМЕРНОСТИ ----------
function seqTask(seq, slotIdx, hint, pad) {
  const answer = seq[slotIdx];
  const tokens = [];
  seq.forEach((x, i) => { if (i) tokens.push(','); tokens.push(i === slotIdx ? SLOT : x); });
  return {
    tokens, answer, input: pad ? 'pad' : 'choices', choices: pad ? null : makeChoices(answer),
    speak: 'Какое число спряталось? ' + seq.map((x, i) => (i === slotIdx ? 'хм-м' : x)).join(', ') + '.',
    visual: null, showVisual: false, hint, bubble: 'Найди закономерность!', seq: true,
  };
}
function stepHint(d) {
  if (d > 0) return `Каждое следующее число на ${d} больше.`;
  return `Каждое следующее число на ${-d} меньше.`;
}
function patternTask(level) {
  const len = 5;
  if (level === 1) {
    const d = pick([1, 1, 1, -1, 2]);
    const start = d > 0 ? rnd(0, 6) : rnd(6, 12);
    const seq = Array.from({ length: len }, (_, i) => start + d * i);
    return seqTask(seq, Math.random() < 0.7 ? len - 1 : rnd(1, 3), stepHint(d));
  }
  if (level === 2) {
    const d = pick([2, 3, 2, -2, 3, -3]);
    const start = d > 0 ? rnd(0, 12) : rnd(15, 30);
    const seq = Array.from({ length: len }, (_, i) => start + d * i);
    return seqTask(seq, rnd(1, len - 1), stepHint(d));
  }
  if (level === 3) {
    const d = pick([4, 5, 10, -5, -10, 6, 11]);
    const start = d > 0 ? rnd(0, 100 - d * 4) : rnd(-d * 4, 100);
    const seq = Array.from({ length: len }, (_, i) => start + d * i);
    return seqTask(seq, rnd(1, len - 1), stepHint(d), true);
  }
  const kind = rnd(0, 2);
  if (kind === 0) {
    const s = rnd(1, 3); const seq = Array.from({ length: len }, (_, i) => s * 2 ** i);
    return seqTask(seq, rnd(2, len - 1), 'Каждое число в 2 раза больше предыдущего.', true);
  }
  if (kind === 1) {
    const s = rnd(1, 6); const seq = [s]; for (let i = 1; i < len; i++) seq.push(seq[i - 1] + i);
    return seqTask(seq, rnd(2, len - 1), 'Прибавляем сначала 1, потом 2, потом 3…', true);
  }
  const up = rnd(3, 5), down = rnd(1, 2); const s = rnd(1, 10);
  const seq = [s]; for (let i = 1; i < len + 1; i++) seq.push(seq[i - 1] + (i % 2 ? up : -down));
  return seqTask(seq, rnd(3, len), `По очереди: +${up}, потом −${down}.`, true);
}

// ---------- УМНОЖЕНИЕ ----------
function mulHint(a, b) {
  if (a <= 5) return `${a} ${razy(a)} по ${b}: ` + Array(a).fill(b).join(' + ') + '.';
  return `5 × ${b} = ${5 * b}, и ещё ${a - 5} × ${b} = ${(a - 5) * b}. Сложи!`;
}
function mulGroups(pers, maxG, showVisual, pad) {
  const b = pick(pers), a = rnd(2, maxG);
  const o = obj();
  return expr([a, '×', b, '=', SLOT], a * b, {
    pad, extra: [a * (b + 1), (a + 1) * b, a + b],
    speak: `Сколько будет ${a} умножить на ${b}? Это ${a} ${razy(a)} по ${b}.`,
    visual: a * b <= 60 ? { type: 'mul', groups: a, per: b, e: o.e } : null, showVisual,
    hint: mulHint(a, b), bubble: `${a} ${razy(a)} по ${b}`,
  });
}
function mulBig() {
  if (Math.random() < 0.2) {
    const a = rnd(2, 99), z = pick([0, 1]);
    return expr([a, '×', z, '=', SLOT], a * z, { pad: true, hint: z ? 'Если умножить на 1, число не меняется!' : 'Если умножить на 0, получится 0!', bubble: 'Хитрый пример!' });
  }
  const a = rnd(11, 25), b = rnd(2, 4);
  const t = a - (a % 10), o = a % 10;
  return expr([a, '×', b, '=', SLOT], a * b, {
    pad: true, hint: `${t} × ${b} = ${t * b}, и ${o} × ${b} = ${o * b}. Сложи!`, bubble: 'Большое умножение!',
  });
}

// ---------- ДЕЛЕНИЕ ----------
function divShare(ks, maxQ, showVisual, pad, minQ = 1) {
  const k = pick(ks), q = rnd(minQ, maxQ), n = k * q;
  const o = obj();
  const who = k <= 3 ? `${k} котятами` : `${k} друзьями`;
  return expr([n, '÷', k, '=', SLOT], q, {
    pad, extra: [q * 2, n - k],
    speak: `Раздели ${n} ${plural(n, o.f)} поровну между ${who}. Сколько получит каждый?`,
    visual: n <= 50 ? { type: 'div', n, k, e: o.e } : null, showVisual,
    hint: `Какое число умножить на ${k}, чтобы получилось ${n}? Раздавай по одной по очереди.`,
    bubble: 'Раздели поровну!',
  });
}
function divBig() {
  const k = rnd(2, 6), q = rnd(11, Math.floor(99 / k)), n = k * q;
  const qt = q - (q % 10), qo = q % 10;
  const hint = qo
    ? `${k * qt} ÷ ${k} = ${qt}, и ${k * qo} ÷ ${k} = ${qo}. Сложи!`
    : `${n / 10} ÷ ${k} = ${q / 10}, значит ${n} ÷ ${k} = ${q / 10} десятка.`;
  return expr([n, '÷', k, '=', SLOT], q, { pad: true, hint, bubble: 'Большое деление!' });
}

// ---------- ЗАДАЧКИ ----------
function story(text, answer, o = {}) {
  return {
    tokens: [SLOT], answer, story: text, speak: text,
    input: o.pad ? 'pad' : 'choices', choices: o.pad ? null : makeChoices(answer),
    visual: o.visual || null, showVisual: !!o.showVisual, hint: o.hint || null, bubble: 'Реши задачку!',
    storyCats: o.cats || null,
  };
}
function storyAddSub(max, showVisual) {
  const [A, B] = twoCats(); const o = thing(); const f = (n) => plural(n, o.f); const fa = (n) => accN(n, o); const pl = o.f[2];
  const he = v(A, 'он', 'она'), him = v(A, 'ему', 'ей');
  const kind = rnd(0, 4);
  if (kind <= 1) {
    const s = rnd(3, max), a = rnd(2, s - 1), b = s - a;
    const vis = { type: 'add', a, b, e1: o.e, e2: o.e };
    const text = kind === 0
      ? `У ${A.gen} было ${a} ${f(a)}. ${B.name} ${v(B, 'дал', 'дала')} ${him} ещё ${b}. Сколько ${pl} стало у ${A.gen}?`
      : `${A.name} ${v(A, 'нашёл', 'нашла')} ${a} ${fa(a)}, а ${B.name} — ${b} ${fa(b)}. Сколько ${pl} они нашли вместе?`;
    return story(text, s, { visual: vis, showVisual, hint: `Сложи: ${a} + ${b}.`, cats: [A.id, B.id] });
  }
  if (kind <= 3) {
    const a = rnd(3, max), b = rnd(1, a - 1);
    const vis = { type: 'sub', a, b, e: o.e };
    const text = kind === 2
      ? `У ${A.gen} было ${a} ${f(a)}. ${he[0].toUpperCase() + he.slice(1)} ${v(A, 'подарил', 'подарила')} ${B.dat} ${b} ${fa(b)}. Сколько ${pl} осталось у ${A.gen}?`
      : `На столе лежало ${a} ${f(a)}. Котята взяли ${b} ${fa(b)}. Сколько ${pl} осталось на столе?`;
    return story(text, a - b, { visual: vis, showVisual, hint: `Вычти: ${a} − ${b}.`, cats: [A.id, B.id] });
  }
  const a = rnd(4, max), b = rnd(1, a - 1);
  const text = `У ${A.gen} ${a} ${f(a)}, а у ${B.gen} — ${b} ${f(b)}. На сколько больше у ${A.gen}?`;
  return story(text, a - b, { visual: { type: 'compare', a, b, e: o.e }, showVisual, hint: `Узнай разницу: ${a} − ${b}.`, cats: [A.id, B.id] });
}
function storyMulDiv() {
  const o = thing(); const f = (n) => plural(n, o.f); const pl = o.f[2];
  const [A] = twoCats();
  const kind = rnd(0, 3);
  if (kind === 0) {
    const k = rnd(2, 5), b = rnd(2, 5);
    return story(`У каждого из ${k} котят по ${b} ${f(b)}. Сколько всего ${pl}?`, k * b,
      { visual: { type: 'mul', groups: k, per: b, e: o.e }, hint: `${k} ${razy(k)} по ${b}: ${k} × ${b}.` });
  }
  if (kind === 1) {
    const k = rnd(2, 5), b = rnd(2, 5);
    return story(`На ${k} тарелках лежит по ${b} ${f(b)}. Сколько всего ${pl}?`, k * b,
      { visual: { type: 'mul', groups: k, per: b, e: o.e }, hint: `Умножь: ${k} × ${b}.` });
  }
  const k = rnd(2, 3), q = rnd(2, 5), n = k * q;
  if (kind === 2) {
    return story(`${n} ${f(n)} разделили поровну между ${k} котятами. Сколько ${pl} досталось каждому?`, q,
      { visual: { type: 'div', n, k, e: o.e }, hint: `Раздели: ${n} ÷ ${k}.` });
  }
  return story(`${A.name} ${v(A, 'разложил', 'разложила')} ${n} ${f(n)} на ${k} тарелки поровну. Сколько ${pl} на каждой тарелке?`, q,
    { visual: { type: 'div', n, k, e: o.e }, hint: `Раздели: ${n} ÷ ${k}.`, cats: [A.id] });
}
function storyTwoStep() {
  const [A, B] = twoCats(); const o = thing(); const f = (n) => plural(n, o.f); const fa = (n) => accN(n, o); const pl = o.f[2];
  const kind = rnd(0, 2);
  if (kind === 0) {
    const a = rnd(3, 12), b = rnd(2, 8), c = rnd(1, a + b - 1);
    return story(`У ${A.gen} было ${a} ${f(a)}. ${v(A, 'Он', 'Она')} ${v(A, 'нашёл', 'нашла')} ещё ${b}, а потом ${v(A, 'отдал', 'отдала')} ${B.dat} ${c}. Сколько ${pl} стало у ${A.gen}?`,
      a + b - c, { pad: true, hint: `Сначала ${a} + ${b} = ${a + b}, потом вычти ${c}.`, cats: [A.id, B.id] });
  }
  if (kind === 1) {
    const k = rnd(2, 4), b = rnd(2, 5), c = rnd(1, k * b - 1);
    const verb = o.food ? 'Котята съели' : 'Котята подарили друзьям';
    return story(`В ${k} корзинках лежит по ${b} ${f(b)}. ${verb} ${c} ${fa(c)}. Сколько ${pl} осталось?`,
      k * b - c, { pad: true, hint: `Сначала ${k} × ${b} = ${k * b}, потом вычти ${c}.` });
  }
  const a = rnd(2, 9), more = rnd(2, 6);
  return story(`У ${A.gen} ${a} ${f(a)}, а у ${B.gen} на ${more} больше. Сколько ${pl} у них вместе?`,
    a + a + more, { pad: true, hint: `У ${B.gen}: ${a} + ${more} = ${a + more}. Теперь сложи ${a} и ${a + more}.`, cats: [A.id, B.id] });
}

// ---------- ПРОФЕССОР ----------
function mix(level) {
  if (level === 1) {
    if (Math.random() < 0.5) {
      const a = rnd(2, 10), b = rnd(1, 10 - Math.min(a, 9)), c = rnd(1, a + b - 1);
      return expr([a, '+', b, '−', c, '=', SLOT], a + b - c, { hint: `Слева направо: ${a} + ${b} = ${a + b}, потом − ${c}.`, bubble: 'По порядку!' });
    }
    const a = rnd(5, 15), b = rnd(1, a - 1), c = rnd(1, 8);
    return expr([a, '−', b, '+', c, '=', SLOT], a - b + c, { hint: `Слева направо: ${a} − ${b} = ${a - b}, потом + ${c}.`, bubble: 'По порядку!' });
  }
  if (level === 2) {
    const a = rnd(2, 5), b = rnd(2, 5), c = rnd(1, 10);
    if (Math.random() < 0.5 || c > a * b) return expr([a, '×', b, '+', c, '=', SLOT], a * b + c, { pad: true, hint: `Сначала ${a} × ${b} = ${a * b}, потом + ${c}.`, bubble: 'Два шага!' });
    return expr([a, '×', b, '−', c, '=', SLOT], a * b - c, { pad: true, hint: `Сначала ${a} × ${b} = ${a * b}, потом − ${c}.`, bubble: 'Два шага!' });
  }
  if (level === 3) {
    const b = rnd(2, 5), c = rnd(2, 5);
    if (Math.random() < 0.6) {
      const a = rnd(1, 20);
      return expr([a, '+', b, '×', c, '=', SLOT], a + b * c, { pad: true, hint: `Умножение главнее! Сначала ${b} × ${c} = ${b * c}, потом прибавь к ${a}.`, bubble: 'Что сначала?' });
    }
    const a = rnd(b * c, b * c + 20);
    return expr([a, '−', b, '×', c, '=', SLOT], a - b * c, { pad: true, hint: `Умножение главнее! Сначала ${b} × ${c} = ${b * c}, потом вычти из ${a}.`, bubble: 'Что сначала?' });
  }
  if (level === 4) {
    const kind = rnd(0, 2);
    if (kind === 0) {
      const a = rnd(1, 6), b = rnd(1, 9 - a), c = rnd(2, 5);
      return expr(['(', a, '+', b, ')', '×', c, '=', SLOT], (a + b) * c, { pad: true, hint: `Сначала скобки: ${a} + ${b} = ${a + b}, потом × ${c}.`, bubble: 'Скобки — первые!' });
    }
    if (kind === 1) {
      const a = rnd(4, 12), b = rnd(1, a - 1), c = rnd(2, 5);
      if ((a - b) * c > 60) return mix(4);
      return expr(['(', a, '−', b, ')', '×', c, '=', SLOT], (a - b) * c, { pad: true, hint: `Сначала скобки: ${a} − ${b} = ${a - b}, потом × ${c}.`, bubble: 'Скобки — первые!' });
    }
    const a = rnd(2, 9), b = rnd(2, 9);
    return expr([100, '−', a, '×', b, '=', SLOT], 100 - a * b, { pad: true, hint: `Сначала ${a} × ${b} = ${a * b}, потом 100 − ${a * b}.`, bubble: 'Что сначала?' });
  }
  // level 5 — загадки Компота
  const kind = rnd(0, 5);
  if (kind === 0) {
    const n = rnd(3, 50) * 2;
    return story(`Чему равна половина от ${n}?`, n / 2, { pad: true, hint: `Половина — это разделить на 2: ${n} ÷ 2.` });
  }
  if (kind === 1) {
    const n = rnd(6, 49);
    return story(`Удвой число ${n}. Сколько получится?`, n * 2, { pad: true, hint: `Удвоить — значит сложить само с собой: ${n} + ${n}.` });
  }
  if (kind === 2) {
    const x = rnd(2, 30), a = rnd(2, 20);
    return story(`Я задумал число, прибавил к нему ${a} и получил ${x + a}. Какое число я задумал?`, x, { pad: true, hint: `Сделай наоборот: ${x + a} − ${a}.`, cats: ['kompot'] });
  }
  if (kind === 3) {
    const x = rnd(2, 10), k = rnd(2, 5);
    return story(`Я задумал число, умножил его на ${k} и получил ${x * k}. Какое число я задумал?`, x, { pad: true, hint: `Сделай наоборот: ${x * k} ÷ ${k}.`, cats: ['kompot'] });
  }
  if (kind === 4) {
    const k = rnd(2, 9);
    return story(`Сколько лапок у ${k} котят?`, k * 4, { pad: true, hint: `У каждого котёнка 4 лапки: ${k} × 4.` });
  }
  const k = rnd(3, 10);
  return story(`Сколько ушек у ${k} котят?`, k * 2, { pad: true, hint: `У каждого котёнка 2 ушка: ${k} × 2.` });
}

// ---------- ТЕМЫ ----------
export const TOPICS = [
  { id: 'count', title: 'Считаем', icon: '123', cat: 'karamelka', color: '#FFB347', levels: [
    { desc: 'до 5', gen: () => countTask(1, 5) },
    { desc: 'до 10', gen: () => countTask(3, 10) },
    { desc: 'до 20', gen: () => countTask(8, 20) },
    { desc: 'десятки до 50', gen: () => countTens(20, 50) },
    { desc: 'до 100', gen: () => countTens(30, 99, true) },
  ] },
  { id: 'compare', title: 'Больше-меньше', icon: '<>', cat: 'karamelka', color: '#B388FF', levels: [
    { desc: 'до 10', gen: () => compareTask(10, true) },
    { desc: 'до 20', gen: () => compareTask(20, false) },
    { desc: 'до 100', gen: () => compareTask(99, false, 10) },
    { desc: 'примеры', gen: () => compareExpr() },
  ] },
  { id: 'add', title: 'Сложение', icon: '+', cat: 'korzhik', color: '#4CD07D', levels: [
    { desc: 'до 5', gen: () => addSmall(5, true) },
    { desc: 'до 10', gen: () => addSmall(10, true, 4) },
    { desc: 'до 10 в уме', gen: () => addSmall(10, false, 4) },
    { desc: 'через десяток', gen: () => addSmall(18, false, 11) },
    { desc: 'до 100', gen: () => addBig(false) },
    { desc: 'двузначные', gen: () => addBig(true) },
  ] },
  { id: 'sub', title: 'Вычитание', icon: '−', cat: 'korzhik', color: '#FF7A7A', levels: [
    { desc: 'до 5', gen: () => subSmall(5, true) },
    { desc: 'до 10', gen: () => subSmall(10, true, 4) },
    { desc: 'до 10 в уме', gen: () => subSmall(10, false, 4) },
    { desc: 'до 20', gen: () => subSmall(20, false, 11) },
    { desc: 'до 100', gen: () => subBig(false) },
    { desc: 'двузначные', gen: () => subBig(true) },
  ] },
  { id: 'missing', title: 'Найди число', icon: '□', cat: 'korzhik', color: '#4FC3F7', levels: [
    { desc: 'состав числа', gen: () => missingAddSub(10, false, true) },
    { desc: 'до 20', gen: () => missingAddSub(20, false, false) },
    { desc: 'до 100', gen: () => missingAddSub(100, true, false) },
    { desc: '× и ÷', gen: () => missingMulDiv() },
  ] },
  { id: 'pattern', title: 'Закономерности', icon: '🧩', cat: 'karamelka', color: '#FFD54F', levels: [
    { desc: '+1 и −1', gen: () => patternTask(1) },
    { desc: 'шагами', gen: () => patternTask(2) },
    { desc: 'большие шаги', gen: () => patternTask(3) },
    { desc: 'хитрые', gen: () => patternTask(4) },
  ] },
  { id: 'mul', title: 'Умножение', icon: '×', cat: 'kompot', color: '#FF8A65', levels: [
    { desc: 'по 2', gen: () => mulGroups([2], 5, true) },
    { desc: 'по 2, 3, 5, 10', gen: () => mulGroups([2, 3, 5, 10], 5, true) },
    { desc: 'до 5 × 5', gen: () => mulGroups([2, 3, 4, 5], 5, false) },
    { desc: 'вся таблица', gen: () => { const t = mulGroups([2, 3, 4, 5, 6, 7, 8, 9], 9, false, true); return t; } },
    { desc: 'большие', gen: () => mulBig() },
  ] },
  { id: 'div', title: 'Деление', icon: '÷', cat: 'kompot', color: '#9575CD', levels: [
    { desc: 'на 2 и 3', gen: () => divShare([2, 3], 4, true) },
    { desc: 'до 5', gen: () => divShare([2, 3, 4, 5], 5, true) },
    { desc: 'до 50', gen: () => divShare([2, 3, 4, 5], 10, false, false, 2) },
    { desc: 'вся таблица', gen: () => divShare([2, 3, 4, 5, 6, 7, 8, 9], 9, false, true, 2) },
    { desc: 'большие', gen: () => divBig() },
  ] },
  { id: 'story', title: 'Задачки', icon: '📖', cat: 'all', color: '#81C784', levels: [
    { desc: 'до 10', gen: () => storyAddSub(10, true) },
    { desc: 'до 20', gen: () => storyAddSub(20, false) },
    { desc: '× и ÷', gen: () => storyMulDiv() },
    { desc: 'в 2 действия', gen: () => storyTwoStep() },
  ] },
  { id: 'mix', title: 'Профессор', icon: '🎓', cat: 'kompot', color: '#64B5F6', levels: [
    { desc: '+ и − подряд', gen: () => mix(1) },
    { desc: '× и +', gen: () => mix(2) },
    { desc: 'что сначала?', gen: () => mix(3) },
    { desc: 'скобки', gen: () => mix(4) },
    { desc: 'загадки', gen: () => mix(5) },
  ] },
];

export function topicById(id) { return TOPICS.find((t) => t.id === id); }
