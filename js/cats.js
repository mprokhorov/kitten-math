// Три котёнка-героя, нарисованные в SVG.
// Рыжик — старший брат-умник (очки, синий свитер)
// Ромашка — сестрёнка (цветок на ушке, розовое платье)
// Тимка — младший братишка (красная кепка, зелёная футболка)

export const CATS = {
  ryzhik: {
    id: 'ryzhik', name: 'Рыжик', gen: 'Рыжика', dat: 'Рыжику', fem: false,
    fur: '#F5841F', furLight: '#FFC48A', line: '#9A4A0C',
    intro: 'Я Рыжик! Я люблю умножать и делить.',
  },
  romashka: {
    id: 'romashka', name: 'Ромашка', gen: 'Ромашки', dat: 'Ромашке', fem: true,
    fur: '#F99A3C', furLight: '#FFD3A3', line: '#A1520F',
    intro: 'Я Ромашка! Давай считать вместе!',
  },
  timka: {
    id: 'timka', name: 'Тимка', gen: 'Тимки', dat: 'Тимке', fem: false,
    fur: '#F07A1A', furLight: '#FFC08A', line: '#94440A',
    intro: 'Я Тимка! Я умею складывать и вычитать!',
  },
};

const DARK = '#2B1A12';

function tail(c) {
  const d = 'M128 222 C 178 230, 196 190, 176 158';
  return `
    <path d="${d}" stroke="${c.line}" stroke-width="19" fill="none" stroke-linecap="round"/>
    <path d="${d}" stroke="${c.fur}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="${d}" stroke="${c.line}" stroke-width="13" fill="none" stroke-dasharray="7 11" stroke-dashoffset="-4"/>`;
}

function legs(c, short) {
  const top = short ? 212 : 222;
  return `
    <g stroke-linecap="round">
      <path d="M88 ${top} V252" stroke="${c.line}" stroke-width="15"/>
      <path d="M112 ${top} V252" stroke="${c.line}" stroke-width="15"/>
      <path d="M88 ${top} V252" stroke="${c.fur}" stroke-width="10"/>
      <path d="M112 ${top} V252" stroke="${c.fur}" stroke-width="10"/>
    </g>
    <ellipse cx="84" cy="256" rx="13" ry="7" fill="${DARK}"/>
    <ellipse cx="116" cy="256" rx="13" ry="7" fill="${DARK}"/>`;
}

function arms(c, sleeve) {
  return `
    <g class="arm arm-l">
      <path d="M72 160 Q52 176 44 200" stroke="${c.line}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M72 160 Q52 176 44 200" stroke="${c.fur}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M74 158 Q62 166 57 176" stroke="${sleeve}" stroke-width="15" fill="none" stroke-linecap="round"/>
      <circle cx="43" cy="203" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
    </g>
    <g class="arm arm-r">
      <path d="M128 160 Q148 176 156 200" stroke="${c.line}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M128 160 Q148 176 156 200" stroke="${c.fur}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M126 158 Q138 166 143 176" stroke="${sleeve}" stroke-width="15" fill="none" stroke-linecap="round"/>
      <circle cx="157" cy="203" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
    </g>`;
}

function body(c) {
  if (c.id === 'ryzhik') {
    return `
      ${legs(c)}
      ${arms(c, '#3F7FD8')}
      <path d="M68 150 Q100 140 132 150 L142 226 Q100 236 58 226 Z" fill="#3F7FD8" stroke="#24508F" stroke-width="3" stroke-linejoin="round"/>
      <path d="M64 192 L76 182 L88 192 L100 182 L112 192 L124 182 L136 192" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <path d="M62 212 L138 212" stroke="#24508F" stroke-width="3"/>`;
  }
  if (c.id === 'romashka') {
    return `
      ${legs(c)}
      ${arms(c, '#FF5C8A')}
      <path d="M78 150 Q100 142 122 150 L150 228 Q100 240 50 228 Z" fill="#FF5C8A" stroke="#C02D5A" stroke-width="3" stroke-linejoin="round"/>
      <g fill="#fff" opacity=".9">
        <circle cx="90" cy="175" r="4"/><circle cx="112" cy="168" r="4"/><circle cx="104" cy="195" r="4"/>
        <circle cx="78" cy="208" r="4"/><circle cx="126" cy="204" r="4"/><circle cx="96" cy="222" r="4"/><circle cx="134" cy="224" r="3.5"/><circle cx="64" cy="224" r="3.5"/>
      </g>`;
  }
  // timka
  return `
    ${legs(c, true)}
    ${arms(c, '#3DBE6B')}
    <path d="M70 202 L130 202 L134 222 L104 222 L100 214 L96 222 L66 222 Z" fill="#2F4A8A" stroke="#1C2E59" stroke-width="3" stroke-linejoin="round"/>
    <path d="M70 150 Q100 142 130 150 L134 206 Q100 212 66 206 Z" fill="#3DBE6B" stroke="#24834A" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 162 l5.3 10.8 11.9 1.7 -8.6 8.4 2 11.8 -10.6 -5.6 -10.6 5.6 2 -11.8 -8.6 -8.4 11.9 -1.7z" fill="#FFD23F" stroke="#D9A400" stroke-width="2" stroke-linejoin="round"/>`;
}

function head(c) {
  const L = c.line;
  return `
    <g class="head">
      <!-- уши -->
      <path d="M44 84 L46 20 L94 50 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M54 72 L56 36 L82 54 Z" fill="${c.furLight}"/>
      <path d="M156 84 L154 20 L106 50 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M146 72 L144 36 L118 54 Z" fill="${c.furLight}"/>
      <!-- голова -->
      <path d="M100 42 C 150 42, 170 72, 168 102 C 166 140, 136 156, 100 156 C 64 156, 34 140, 32 102 C 30 72, 50 42, 100 42 Z" fill="${c.fur}" stroke="${L}" stroke-width="3.5"/>
      <!-- полоски -->
      <g stroke="${L}" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M90 46 q3 8 0 14"/><path d="M100 44 v16"/><path d="M110 46 q-3 8 0 14"/>
        <path d="M34 104 l18 3"/><path d="M35 116 l17 -1"/>
        <path d="M166 104 l-18 3"/><path d="M165 116 l-17 -1"/>
      </g>
      <!-- мордочка -->
      <ellipse cx="100" cy="124" rx="24" ry="17" fill="${c.furLight}" opacity=".55"/>
      <g class="eyes">
        <ellipse cx="78" cy="92" rx="13" ry="15" fill="#fff" stroke="${L}" stroke-width="2.5"/>
        <ellipse cx="122" cy="92" rx="13" ry="15" fill="#fff" stroke="${L}" stroke-width="2.5"/>
        <g class="pupils">
          <circle cx="81" cy="95" r="6.5" fill="${DARK}"/><circle cx="83" cy="92" r="2.2" fill="#fff"/>
          <circle cx="119" cy="95" r="6.5" fill="${DARK}"/><circle cx="121" cy="92" r="2.2" fill="#fff"/>
        </g>
      </g>
      ${c.fem ? `<g stroke="${DARK}" stroke-width="2.5" stroke-linecap="round">
        <path d="M66 80 l-6 -5"/><path d="M71 76 l-3 -6"/><path d="M134 80 l6 -5"/><path d="M129 76 l3 -6"/></g>` : ''}
      <ellipse cx="100" cy="112" rx="10" ry="7" fill="${DARK}"/>
      <g class="mouth" stroke="${DARK}" stroke-width="3" fill="none" stroke-linecap="round">
        <path class="m-happy" d="M84 124 Q92 136 100 124 Q108 136 116 124"/>
        <ellipse class="m-wow" display="none" cx="100" cy="132" rx="7" ry="9" fill="#8A2C1C" stroke-width="2.5"/>
        <path class="m-sad" display="none" d="M88 134 Q100 126 112 134"/>
      </g>
      <g stroke="#3a2a22" stroke-width="1.6" stroke-linecap="round">
        <path d="M60 116 L22 108"/><path d="M60 121 L20 121"/><path d="M60 126 L23 134"/>
        <path d="M140 116 L178 108"/><path d="M140 121 L180 121"/><path d="M140 126 L177 134"/>
      </g>
    </g>`;
}

function accessory(c) {
  if (c.id === 'ryzhik') {
    return `
      <g class="glasses" fill="rgba(255,255,255,.18)" stroke="#2B2B3A" stroke-width="3.5">
        <circle cx="78" cy="93" r="19"/><circle cx="122" cy="93" r="19"/>
        <path d="M97 90 Q100 86 103 90" fill="none"/>
        <path d="M59 90 L42 84" fill="none"/><path d="M141 90 L158 84" fill="none"/>
      </g>`;
  }
  if (c.id === 'romashka') {
    let petals = '';
    for (let i = 0; i < 8; i++) {
      petals += `<ellipse cx="148" cy="30" rx="5.5" ry="12" transform="rotate(${i * 45} 148 42) translate(0 0)" fill="#fff" stroke="#ddd" stroke-width="1"/>`;
    }
    return `<g class="flower">${petals}<circle cx="148" cy="42" r="7.5" fill="#FFC928" stroke="#E0A000" stroke-width="1.5"/></g>`;
  }
  return `
    <g class="cap">
      <path d="M64 58 Q100 8 136 58 Z" fill="#E8333A" stroke="#A3161C" stroke-width="3" stroke-linejoin="round"/>
      <path d="M128 52 Q160 48 176 60 Q154 66 126 60 Z" fill="#E8333A" stroke="#A3161C" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="100" cy="32" r="5" fill="#A3161C"/>
      <path d="M80 50 Q100 30 120 50" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>
    </g>`;
}

// Полный котёнок (по умолчанию) или только голова (opts.headOnly)
export function catSVG(id, opts = {}) {
  const c = CATS[id];
  const vb = opts.headOnly ? '18 4 164 158' : '0 0 200 268';
  const parts = opts.headOnly
    ? head(c) + accessory(c)
    : tail(c) + body(c) + head(c) + accessory(c);
  return `<svg class="cat cat-${id}${opts.cls ? ' ' + opts.cls : ''}" data-cat="${id}" data-mood="happy" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-label="${c.name}">${parts}</svg>`;
}
