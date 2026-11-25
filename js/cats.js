// Герои «Три кота», нарисованные в SVG в стиле мультфильма:
// Компот — старший брат (бирюзовый колпак с помпоном, бирюзовая рубашка, тёмно-зелёные шортики)
// Карамелька — младшая сестрёнка (красный бантик, реснички, красное платьице)
// Коржик — средний брат (матросская бескозырка с якорем, тельняшка, голубые шортики)

export const CATS = {
  kompot: {
    id: 'kompot', name: 'Компот', gen: 'Компота', dat: 'Компоту', fem: false,
    fur: '#F78506', furLight: '#FFE0B2', line: '#5C2406',
    intro: 'Я Компот! Я люблю умножать, делить и решать хитрые задачки!',
  },
  karamelka: {
    id: 'karamelka', name: 'Карамелька', gen: 'Карамельки', dat: 'Карамельке', fem: true,
    fur: '#F78506', furLight: '#FFE0B2', line: '#5C2406',
    intro: 'Я Карамелька! Я знаю, что надо делать — давай считать вместе!',
  },
  korzhik: {
    id: 'korzhik', name: 'Коржик', gen: 'Коржика', dat: 'Коржику', fem: false,
    fur: '#F78506', furLight: '#FFE0B2', line: '#5C2406',
    intro: 'Я Коржик! Я умею складывать и вычитать!',
  },
};

const DARK = '#221006';
const MOUTH_FILL = '#8E3415';
const TONGUE = '#E85C5C';
const SHOE = '#6D3110';
const PAW = '#5C2406';

let clipSeq = 0;

function tail(c, x = 140, y = 216) {
  const d = `M${x} ${y} C ${x + 34} ${y + 6}, ${x + 48} ${y - 26}, ${x + 34} ${y - 54}`;
  return `
    <path d="${d}" stroke="${c.line}" stroke-width="17" fill="none" stroke-linecap="round"/>
    <path d="${d}" stroke="${c.fur}" stroke-width="11.5" fill="none" stroke-linecap="round"/>
    <path d="${d}" stroke="${c.line}" stroke-width="11.5" fill="none" stroke-dasharray="6 10" stroke-dashoffset="-3"/>`;
}

function pawFingers(x, y, dir) {
  // Три милых тонких пальчика в стиле «Три кота»
  const d = dir;
  return `
    <g stroke="${PAW}" stroke-width="3.2" stroke-linecap="round">
      <line x1="${x}" y1="${y}" x2="${x + d * 8}" y2="${y - 5}"/>
      <line x1="${x}" y1="${y}" x2="${x + d * 9}" y2="${y + 1}"/>
      <line x1="${x}" y1="${y}" x2="${x + d * 6}" y2="${y + 7}"/>
    </g>`;
}

function shoes(lx, rx, y = 256) {
  return `
    <ellipse cx="${lx - 4}" cy="${y}" rx="12" ry="6.5" fill="${SHOE}" stroke="${DARK}" stroke-width="2.2"/>
    <ellipse cx="${rx + 4}" cy="${y}" rx="12" ry="6.5" fill="${SHOE}" stroke="${DARK}" stroke-width="2.2"/>`;
}

function bodyKompot(c) {
  return `
    ${tail(c, 146, 214)}
    <!-- ножки и тёмно-зелёные шортики -->
    <g stroke-linecap="round">
      <line x1="82" y1="226" x2="82" y2="253" stroke="${PAW}" stroke-width="6"/>
      <line x1="118" y1="226" x2="118" y2="253" stroke="${PAW}" stroke-width="6"/>
    </g>
    <rect x="72" y="218" width="20" height="24" rx="3" fill="#2E6A36" stroke="#194020" stroke-width="2.8"/>
    <rect x="108" y="218" width="20" height="24" rx="3" fill="#2E6A36" stroke="#194020" stroke-width="2.8"/>
    ${shoes(82, 118, 256)}
    <!-- ручки с бирюзовыми рукавами -->
    <g class="arm arm-l">
      <path d="M56 164 L28 190 L38 202 L62 184 Z" fill="#4FA990" stroke="#265C4E" stroke-width="3" stroke-linejoin="round"/>
      <line x1="33" y1="196" x2="22" y2="205" stroke="${PAW}" stroke-width="4.5" stroke-linecap="round"/>
      ${pawFingers(22, 205, -1)}
    </g>
    <g class="arm arm-r">
      <path d="M144 164 L172 190 L162 202 L138 184 Z" fill="#4FA990" stroke="#265C4E" stroke-width="3" stroke-linejoin="round"/>
      <line x1="167" y1="196" x2="178" y2="205" stroke="${PAW}" stroke-width="4.5" stroke-linecap="round"/>
      ${pawFingers(178, 205, 1)}
    </g>
    <!-- пухлая бирюзовая рубашка-туника -->
    <path d="M56 152 Q100 144 144 152 L152 222 Q100 232 48 222 Z" fill="#4FA990" stroke="#265C4E" stroke-width="3.2" stroke-linejoin="round"/>
    <!-- воротничок и 2 пуговки -->
    <path d="M64 154 L94 176 L100 166 L106 176 L136 154" fill="none" stroke="#265C4E" stroke-width="2.8" stroke-linejoin="round"/>
    <circle cx="100" cy="183" r="3.6" fill="#265C4E"/>
    <circle cx="100" cy="196" r="3.6" fill="#265C4E"/>`;
}

function bodyKaramelka(c) {
  return `
    ${tail(c, 130, 222)}
    <!-- тонкие ножки и туфельки -->
    <g stroke="${PAW}" stroke-width="5" stroke-linecap="round">
      <line x1="88" y1="224" x2="88" y2="253"/>
      <line x1="112" y1="224" x2="112" y2="253"/>
    </g>
    ${shoes(88, 112, 256)}
    <!-- весёлые тонкие ручки в стороны -->
    <g class="arm arm-l">
      <path d="M80 176 Q58 176 42 168" stroke="${PAW}" stroke-width="4.8" fill="none" stroke-linecap="round"/>
      ${pawFingers(42, 168, -1)}
    </g>
    <g class="arm arm-r">
      <path d="M120 176 Q142 176 158 168" stroke="${PAW}" stroke-width="4.8" fill="none" stroke-linecap="round"/>
      ${pawFingers(158, 168, 1)}
    </g>
    <!-- красное платьице-трапеция -->
    <path d="M84 156 Q100 150 116 156 L136 226 Q100 234 64 226 Z" fill="#E52822" stroke="#7C1410" stroke-width="3.2" stroke-linejoin="round"/>`;
}

function bodyKorzhik(c) {
  const cid = `korzhik-shirt-${++clipSeq}`;
  const slCid = `korzhik-sl-${clipSeq}`;
  const srCid = `korzhik-sr-${clipSeq}`;
  const stripes = (y0, y1, step = 9) => {
    let out = '';
    for (let y = y0; y <= y1; y += step) {
      out += `<rect x="20" y="${y}" width="160" height="4.5" fill="#72C1EE"/>`;
    }
    return out;
  };
  return `
    ${tail(c, 134, 218)}
    <!-- ножки -->
    <g stroke="${PAW}" stroke-width="5.2" stroke-linecap="round">
      <line x1="85" y1="224" x2="85" y2="253"/>
      <line x1="115" y1="224" x2="115" y2="253"/>
    </g>
    ${shoes(85, 115, 256)}
    <!-- голубые шортики -->
    <path d="M72 204 L128 204 L132 232 L104 232 L100 222 L96 232 L68 232 Z" fill="#4FA3D9" stroke="#28648C" stroke-width="3" stroke-linejoin="round"/>
    <!-- полосатые рукава и тонкие ручки -->
    <defs>
      <clipPath id="${cid}"><path d="M70 154 Q100 146 130 154 L134 210 Q100 216 66 210 Z"/></clipPath>
      <clipPath id="${slCid}"><path d="M70 158 L46 172 L53 186 L74 176 Z"/></clipPath>
      <clipPath id="${srCid}"><path d="M130 158 L154 172 L147 186 L126 176 Z"/></clipPath>
    </defs>
    <g class="arm arm-l">
      <line x1="50" y1="180" x2="34" y2="192" stroke="${PAW}" stroke-width="4.6" stroke-linecap="round"/>
      ${pawFingers(34, 192, -1)}
      <path d="M70 158 L46 172 L53 186 L74 176 Z" fill="#fff"/>
      <g clip-path="url(#${slCid})">${stripes(156, 190, 8)}</g>
      <path d="M70 158 L46 172 L53 186 L74 176 Z" fill="none" stroke="#2E6485" stroke-width="2.8" stroke-linejoin="round"/>
    </g>
    <g class="arm arm-r">
      <line x1="150" y1="180" x2="166" y2="192" stroke="${PAW}" stroke-width="4.6" stroke-linecap="round"/>
      ${pawFingers(166, 192, 1)}
      <path d="M130 158 L154 172 L147 186 L126 176 Z" fill="#fff"/>
      <g clip-path="url(#${srCid})">${stripes(156, 190, 8)}</g>
      <path d="M130 158 L154 172 L147 186 L126 176 Z" fill="none" stroke="#2E6485" stroke-width="2.8" stroke-linejoin="round"/>
    </g>
    <!-- полосатая тельняшка -->
    <path d="M70 154 Q100 146 130 154 L134 210 Q100 216 66 210 Z" fill="#fff"/>
    <g clip-path="url(#${cid})">${stripes(150, 214, 9.5)}</g>
    <path d="M70 154 Q100 146 130 154 L134 210 Q100 216 66 210 Z" fill="none" stroke="#2E6485" stroke-width="3" stroke-linejoin="round"/>`;
}

function body(c) {
  if (c.id === 'kompot') return bodyKompot(c);
  if (c.id === 'karamelka') return bodyKaramelka(c);
  return bodyKorzhik(c);
}

function mouthMarkup(cx, y, w, h) {
  const lx = cx - w, rx = cx + w;
  return `
    <g class="mouth">
      <path class="m-happy" d="M${lx} ${y} Q${cx} ${y + h * 0.42} ${rx} ${y} Q${cx + w * 0.72} ${y + h} ${cx} ${y + h} Q${cx - w * 0.72} ${y + h} ${lx} ${y} Z" fill="${MOUTH_FILL}" stroke="${DARK}" stroke-width="2.8" stroke-linejoin="round"/>
      <g class="m-wow" display="none">
        <path d="M${lx - 2} ${y - 2} Q${cx} ${y + 3} ${rx + 2} ${y - 2} Q${cx + w * 0.8} ${y + h * 1.25} ${cx} ${y + h * 1.25} Q${cx - w * 0.8} ${y + h * 1.25} ${lx - 2} ${y - 2} Z" fill="${MOUTH_FILL}" stroke="${DARK}" stroke-width="2.8" stroke-linejoin="round"/>
        <ellipse cx="${cx}" cy="${y + h * 0.95}" rx="${w * 0.42}" ry="${h * 0.28}" fill="${TONGUE}"/>
      </g>
      <path class="m-sad" display="none" d="M${lx + 5} ${y + h * 0.75} Q${cx} ${y + 2} ${rx - 5} ${y + h * 0.75}" fill="none" stroke="${DARK}" stroke-width="3.2" stroke-linecap="round"/>
    </g>`;
}

function headKompot(c) {
  const L = c.line;
  return `
    <g class="head">
      <!-- острые треугольные уши -->
      <path d="M40 88 L28 30 L80 58 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M46 76 L39 44 L70 60 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M160 88 L172 30 L120 58 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M154 76 L161 44 L130 60 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/>
      <!-- крупная пухлая голова Компота -->
      <ellipse cx="100" cy="105" rx="68" ry="54" fill="${c.fur}" stroke="${L}" stroke-width="3.4"/>
      <!-- полоски на щеках -->
      <g stroke="#7A2E08" stroke-width="4.2" stroke-linecap="round">
        <path d="M35 98 L54 92"/><path d="M33 108 L55 103"/><path d="M36 118 L54 114"/>
        <path d="M165 98 L146 92"/><path d="M167 108 L145 103"/><path d="M164 118 L146 114"/>
      </g>
      <!-- небольшие белые глаза-арочки (фирменный взгляд Компота) -->
      <g class="eyes">
        <path d="M68 94 Q70 74 82 76 Q92 78 90 93 Z" fill="#fff" stroke="${DARK}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M110 93 Q108 78 118 76 Q130 74 132 94 Z" fill="#fff" stroke="${DARK}" stroke-width="2.2" stroke-linejoin="round"/>
        <g class="pupils">
          <circle cx="81" cy="86" r="3.4" fill="${DARK}"/>
          <circle cx="119" cy="86" r="3.4" fill="${DARK}"/>
        </g>
      </g>
      <!-- большой чёрный нос-овал -->
      <ellipse cx="100" cy="108" rx="17" ry="11.5" fill="${DARK}"/>
      ${mouthMarkup(100, 125, 29, 24)}
      <!-- длинные чёрные усы -->
      <g stroke="${DARK}" stroke-width="1.8" stroke-linecap="round">
        <path d="M52 108 L12 104"/><path d="M51 114 L10 116"/><path d="M53 120 L15 128"/>
        <path d="M148 108 L188 104"/><path d="M149 114 L190 116"/><path d="M147 120 L185 128"/>
      </g>
      <!-- фирменный бирюзовый колпак с помпоном -->
      <g class="hat">
        <path d="M90 50 C 86 24, 66 6, 42 8 C 28 9, 20 18, 22 27 C 24 24, 30 20, 38 20 C 52 20, 58 34, 57 52 Z" fill="#4FA990" stroke="#265C4E" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="22" cy="28" r="6.5" fill="#2E5D55" stroke="#1E3F39" stroke-width="2"/>
        <!-- отворот с вертикальными полосками -->
        <rect x="52" y="45" width="44" height="17" rx="5" transform="rotate(-10 74 53)" fill="#4FA990" stroke="#265C4E" stroke-width="2.8"/>
        <g stroke="#265C4E" stroke-width="2" transform="rotate(-10 74 53)">
          <line x1="61" y1="46" x2="61" y2="61"/><line x1="70" y1="46" x2="70" y2="61"/>
          <line x1="79" y1="46" x2="79" y2="61"/><line x1="88" y1="46" x2="88" y2="61"/>
        </g>
      </g>
    </g>`;
}

function headKaramelka(c) {
  const L = c.line;
  return `
    <g class="head">
      <!-- 3 тонкие волосинки на макушке -->
      <g stroke="${DARK}" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M98 56 Q96 38 92 32"/>
        <path d="M102 55 Q104 37 108 30"/>
        <path d="M106 56 Q112 42 118 36"/>
      </g>
      <!-- большие острые ушки -->
      <path d="M52 84 L38 24 L84 62 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M56 74 L48 39 L76 63 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M148 84 L162 24 L116 62 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M144 74 L152 39 L124 63 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- круглая рыжая голова -->
      <ellipse cx="100" cy="108" rx="55" ry="49" fill="${c.fur}" stroke="${L}" stroke-width="3.2"/>
      <!-- полоски на щеках -->
      <g stroke="#7A2E08" stroke-width="3.8" stroke-linecap="round">
        <path d="M47 102 L65 98"/><path d="M46 111 L66 108"/><path d="M49 120 L65 117"/>
        <path d="M153 102 L135 98"/><path d="M154 111 L134 108"/><path d="M151 120 L135 117"/>
      </g>
      <!-- большие круглые глаза с ресничками -->
      <g class="eyes">
        <g stroke="${DARK}" stroke-width="2.1" stroke-linecap="round">
          <line x1="72" y1="86" x2="65" y2="78"/><line x1="80" y1="83" x2="78" y2="74"/><line x1="88" y1="85" x2="90" y2="76"/>
          <line x1="112" y1="85" x2="110" y2="76"/><line x1="120" y1="83" x2="122" y2="74"/><line x1="128" y1="86" x2="135" y2="78"/>
        </g>
        <circle cx="81" cy="99" r="14.5" fill="#fff" stroke="${DARK}" stroke-width="2.2"/>
        <circle cx="119" cy="99" r="14.5" fill="#fff" stroke="${DARK}" stroke-width="2.2"/>
        <g class="pupils">
          <circle cx="83" cy="99" r="5.2" fill="${DARK}"/><circle cx="85" cy="97" r="1.7" fill="#fff"/>
          <circle cx="117" cy="99" r="5.2" fill="${DARK}"/><circle cx="119" cy="97" r="1.7" fill="#fff"/>
        </g>
      </g>
      <!-- чёрный носик -->
      <ellipse cx="100" cy="117" rx="9" ry="6.2" fill="${DARK}"/>
      ${mouthMarkup(100, 127, 19, 19)}
      <!-- усы -->
      <g stroke="${DARK}" stroke-width="1.6" stroke-linecap="round">
        <path d="M58 112 L22 106"/><path d="M57 118 L20 118"/><path d="M58 124 L24 130"/>
        <path d="M142 112 L178 106"/><path d="M143 118 L180 118"/><path d="M142 124 L176 130"/>
      </g>
      <!-- большой красный бант -->
      <g class="bow" transform="rotate(8 106 54)">
        <path d="M104 54 C 92 38, 70 36, 70 54 C 70 70, 92 68, 104 57 Z" fill="#E52822" stroke="#7C1410" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M108 54 C 120 38, 142 36, 142 54 C 142 70, 120 68, 108 57 Z" fill="#E52822" stroke="#7C1410" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M84 52 L98 55 M84 58 L98 56 M128 52 L114 55 M128 58 L114 56" stroke="#7C1410" stroke-width="1.8" stroke-linecap="round"/>
        <rect x="99" y="47" width="14" height="16" rx="5" fill="#E52822" stroke="#7C1410" stroke-width="2.6"/>
      </g>
    </g>`;
}

function headKorzhik(c) {
  const L = c.line;
  return `
    <g class="head">
      <!-- тёмно-коричневый хохолок из 2 задорных прядок -->
      <path d="M106 55 L112 22 L120 53 Z" fill="${DARK}" stroke="${DARK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M118 57 L130 24 L132 58 Z" fill="${DARK}" stroke="${DARK}" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- крупные острые уши -->
      <path d="M50 82 L34 22 L84 58 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M54 71 L45 38 L75 59 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M150 82 L166 22 L116 58 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M146 71 L155 38 L125 59 Z" fill="${c.furLight}" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- круглая голова Коржика -->
      <ellipse cx="100" cy="105" rx="58" ry="51" fill="${c.fur}" stroke="${L}" stroke-width="3.2"/>
      <!-- полоски на щеках -->
      <g stroke="#7A2E08" stroke-width="4" stroke-linecap="round">
        <path d="M44 98 L62 94"/><path d="M43 108 L63 105"/><path d="M46 118 L62 115"/>
        <path d="M156 98 L138 94"/><path d="M157 108 L137 105"/><path d="M154 118 L138 115"/>
      </g>
      <!-- большие выразительные круглые глаза -->
      <g class="eyes">
        <circle cx="81" cy="95" r="16" fill="#fff" stroke="${DARK}" stroke-width="2.2"/>
        <circle cx="119" cy="95" r="16" fill="#fff" stroke="${DARK}" stroke-width="2.2"/>
        <g class="pupils">
          <circle cx="84" cy="96" r="6" fill="${DARK}"/><circle cx="86" cy="93.5" r="2" fill="#fff"/>
          <circle cx="116" cy="96" r="6" fill="${DARK}"/><circle cx="118" cy="93.5" r="2" fill="#fff"/>
        </g>
      </g>
      <!-- чёрный носик -->
      <ellipse cx="100" cy="115" rx="10" ry="7" fill="${DARK}"/>
      ${mouthMarkup(100, 125, 22, 21)}
      <!-- длинные чёрные усы -->
      <g stroke="${DARK}" stroke-width="1.7" stroke-linecap="round">
        <path d="M55 110 L18 103"/><path d="M54 116 L16 116"/><path d="M55 122 L20 129"/>
        <path d="M145 110 L182 103"/><path d="M146 116 L184 116"/><path d="M145 122 L180 129"/>
      </g>
      <!-- матросская шапочка-бескозырка с якорем и помпоном -->
      <g class="sailor-hat" transform="translate(66 36) rotate(-26)">
        <!-- чёрный помпон сверху -->
        <circle cx="0" cy="-16" r="5" fill="${DARK}"/>
        <!-- голубая тулья -->
        <path d="M-16 0 L-13 18 Q0 23 13 18 L16 0 Z" fill="#7CC4ED" stroke="#285878" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- белая верхушка-берет -->
        <ellipse cx="0" cy="-2" rx="22" ry="11" fill="#FFFFFF" stroke="#285878" stroke-width="2.5"/>
        <ellipse cx="0" cy="-3" rx="14" ry="5" fill="#E3F4FF"/>
        <!-- маленький тёмный якорь -->
        <g stroke="#1C394D" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="0" y1="5" x2="0" y2="16"/>
          <line x1="-4" y1="8.5" x2="4" y2="8.5"/>
          <path d="M-5.5 13 Q0 18.5 5.5 13"/>
        </g>
      </g>
    </g>`;
}

function head(c) {
  if (c.id === 'kompot') return headKompot(c);
  if (c.id === 'karamelka') return headKaramelka(c);
  return headKorzhik(c);
}

// Полный котёнок (по умолчанию) или только голова (opts.headOnly)
export function catSVG(id, opts = {}) {
  const c = CATS[id];
  const vb = opts.headOnly ? '12 4 176 160' : '0 0 200 268';
  const parts = opts.headOnly ? head(c) : body(c) + head(c);
  return `<svg class="cat cat-${id}${opts.cls ? ' ' + opts.cls : ''}" data-cat="${id}" data-mood="happy" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-label="${c.name}">${parts}</svg>`;
}
