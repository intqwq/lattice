// Local, deterministic teaching models. No network, code execution or assessment claims.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (value, digits = 3) => Number.isFinite(value) ? String(Number(value.toFixed(digits))).replace('-', '−') : '—';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
let instance = 0;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createUI(container, lang) {
  const zh = String(lang).startsWith('zh');
  const t = (en, cn) => zh ? cn : en;
  const id = `lattice-visual-${++instance}`;
  const removers = [];
  const heading = element('h3');
  const description = element('p');
  const stage = element('div', 'visual-stage');
  const controls = element('div', 'visual-controls');
  const result = element('div', 'visual-result');
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  result.setAttribute('aria-atomic', 'true');
  const note = element('p');
  note.textContent = t('Interactive teaching model. Values follow the stated assumptions; this is not measured laboratory evidence.', '交互教学模型。数值遵循明确假设，不是实验室实测证据。');
  container.classList.add('visual-card');
  container.replaceChildren(heading, description, stage, controls, result, note);
  const on = (node, event, callback) => { node.addEventListener(event, callback); removers.push(() => node.removeEventListener(event, callback)); };
  const ui = {
    id, t, stage, controls, result,
    setup(en, cn, detailEn, detailCn, noteEn, noteCn) {
      heading.textContent = t(en, cn);
      description.textContent = t(detailEn, detailCn);
      if (noteEn) note.textContent = t(noteEn, noteCn);
    },
    say(value) { result.textContent = value; },
    svg(markup, label, height = 235) {
      stage.innerHTML = `<svg viewBox="0 0 340 ${height}" role="img" aria-labelledby="${id}-title" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${esc(label)}</title>${markup}</svg>`;
    },
    range(en, cn, min, max, step, initial, update, unit = '') {
      const wrap = element('div');
      const label = element('label', 'range-label');
      const input = element('input');
      input.type = 'range'; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(initial);
      input.id = `${id}-control-${controls.children.length}`;
      label.htmlFor = input.id;
      label.append(element('span', '', t(en, cn)));
      const output = element('output', '', `${fmt(initial)}${unit}`);
      output.setAttribute('for', input.id);
      label.append(output);
      wrap.append(label, input); controls.append(wrap);
      const refresh = () => { output.textContent = `${fmt(Number(input.value))}${unit}`; input.setAttribute('aria-valuetext', output.textContent); };
      on(input, 'input', () => { refresh(); update(); });
      refresh();
      return { input, get value() { return Number(input.value); }, set(value) { input.value = String(value); refresh(); }, max(value) { input.max = String(value); refresh(); } };
    },
    select(en, cn, options, initial, update) {
      const label = element('label', 'range-label');
      label.style.flexWrap = 'wrap';
      label.append(element('span', '', t(en, cn)));
      const select = element('select', 'select');
      select.style.minWidth = '0'; select.style.maxWidth = '100%';
      select.setAttribute('aria-label', t(en, cn));
      for (const [value, english, chinese] of options) {
        const option = element('option', '', t(english, chinese)); option.value = value; select.append(option);
      }
      select.value = initial;
      label.append(select); controls.append(label); on(select, 'change', update);
      return select;
    },
    button(en, cn, callback) {
      const button = element('button', 'button-secondary', t(en, cn)); button.type = 'button';
      controls.append(button); on(button, 'click', callback); return button;
    },
    cleanup() { for (const remove of removers) remove(); }
  };
  return ui;
}

const text = (x, y, value, cls = '') => `<text x="${x}" y="${y}" text-anchor="middle"${cls ? ` class="${esc(cls)}"` : ''}>${esc(value)}</text>`;
const line = (x1, y1, x2, y2, color = 'var(--line)', width = 1.5, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const dot = (x, y, color = 'var(--accent)', r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
function arrow(x1, y1, x2, y2, color = 'var(--accent)', width = 2.5) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  if (distance < 0.01) return dot(x1, y1, color, 3);
  const ux = (x2 - x1) / distance, uy = (y2 - y1) / distance, size = Math.min(8, distance * 0.4);
  const bx = x2 - size * ux, by = y2 - size * uy;
  return `${line(x1, y1, bx, by, color, width)}<path d="M${x2},${y2} L${bx - uy * size / 2},${by + ux * size / 2} L${bx + uy * size / 2},${by - ux * size / 2} Z" fill="${color}"/>`;
}

function graph(ui, { xMin = -5, xMax = 5, yMin = -5, yMax = 5, xLabel = 'x', yLabel = 'y', xTicks = [-4, -2, 0, 2, 4], yTicks = [-4, -2, 2, 4], height = 250 } = {}) {
  const left = 38, top = 27, width = 270, bottom = height - 40, h = bottom - top;
  const X = x => left + (x - xMin) * width / (xMax - xMin);
  const Y = y => bottom - (y - yMin) * h / (yMax - yMin);
  const originY = Y(Math.max(yMin, Math.min(yMax, 0)));
  const originX = X(Math.max(xMin, Math.min(xMax, 0)));
  let base = `<defs><clipPath id="${ui.id}-plot"><rect x="${left}" y="${top}" width="${width}" height="${h}"/></clipPath></defs>`;
  for (const x of xTicks) base += `${line(X(x), top, X(x), bottom, 'var(--line)', 0.6)}${text(X(x), bottom + 17, fmt(x))}`;
  for (const y of yTicks) base += `${line(left, Y(y), left + width, Y(y), 'var(--line)', 0.6)}${text(left - 18, Y(y) + 4, fmt(y))}`;
  base += line(left, originY, left + width, originY, 'var(--muted)', 1.4) + line(originX, top, originX, bottom, 'var(--muted)', 1.4);
  base += text(left + width / 2, height - 3, xLabel) + text(left + 24, 15, yLabel);
  return { X, Y, base, height, clip: markup => `<g clip-path="url(#${ui.id}-plot)">${markup}</g>`, curve(fn, color = 'var(--accent)', dash = '') {
    const pts = Array.from({ length: 121 }, (_, i) => { const x = xMin + (xMax - xMin) * i / 120; return `${X(x)},${Y(fn(x))}`; }).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  } };
}

function numberLine(ui, lesson) {
  const inequality = lesson.id === 'math.inequalities';
  const counting = lesson.id === 'math.whole-numbers';
  const signed = lesson.id === 'math.signed-numbers';
  ui.setup(inequality ? 'A solution set on a line' : counting ? 'Count from zero' : 'A starting point and a change', inequality ? '数轴上的解集' : counting ? '从零开始计数' : '起点与变化', inequality ? 'Choose a boundary and decide whether the endpoint belongs.' : counting ? 'Each step to the right adds one. The tick at zero is the starting position.' : 'The arrow adds the signed change to the start. Numbers are dimensionless.', inequality ? '选择边界，并判断端点是否属于解集。' : counting ? '每向右一步就加一。零刻度是起始位置。' : '箭头把有向变化加到起点上。数值没有物理单位。', 'A visual model of numbers. The equation supplies the exact relationship.', '这是数的可视模型；精确关系由算式说明。');
  const start = ui.range(inequality ? 'Boundary b' : counting ? 'Number of steps' : 'Start a', inequality ? '边界 b' : counting ? '步数' : '起点 a', inequality || signed ? -6 : 0, inequality || signed ? 6 : counting ? 10 : 6, 1, counting ? 4 : 2, render);
  let delta, relation;
  if (!inequality && !counting) delta = ui.range('Change b', '变化 b', signed ? -6 : 0, 6, 1, signed ? -3 : 3, render);
  if (inequality) relation = ui.select('Relation', '关系', [['lt', 'x < b', 'x < b'], ['le', 'x ≤ b', 'x ≤ b'], ['gt', 'x > b', 'x > b'], ['ge', 'x ≥ b', 'x ≥ b']], 'le', render);
  function render() {
    const min = inequality ? -8 : signed ? -12 : 0, max = inequality ? 8 : signed ? 12 : counting ? 10 : 12;
    const X = n => 25 + (n - min) * 290 / (max - min), y = 115;
    let drawing = arrow(22, y, 320, y, 'var(--muted)', 1.5);
    for (let n = min; n <= max; n++) {
      drawing += line(X(n), y - 5, X(n), y + 5, 'var(--muted)', 1);
      if ((max - min) <= 12 || n % 2 === 0) drawing += text(X(n), y + 25, n);
    }
    if (inequality) {
      const left = ['lt', 'le'].includes(relation.value), closed = ['le', 'ge'].includes(relation.value), symbols = { lt: '<', le: '≤', gt: '>', ge: '≥' };
      drawing += arrow(X(start.value), y, left ? 23 : 318, y, 'var(--accent)', 5);
      drawing += `<circle cx="${X(start.value)}" cy="${y}" r="6" fill="${closed ? 'var(--accent)' : 'var(--panel)'}" stroke="var(--accent)" stroke-width="2.5"/>`;
      const output = `x ${symbols[relation.value]} ${fmt(start.value)} · ${ui.t(closed ? 'endpoint included' : 'endpoint excluded', closed ? '包含端点' : '不含端点')}`;
      ui.svg(drawing, output, 180); ui.say(output);
    } else {
      const end = counting ? start.value : start.value + delta.value;
      if (counting) for (let n = 1; n <= end; n++) drawing += dot(X(n), 70, 'var(--accent)', 5);
      else drawing += arrow(X(start.value), 76, X(end), 76) + text((X(start.value) + X(end)) / 2, 55, `+ (${fmt(delta.value)})`);
      drawing += dot(X(counting ? 0 : start.value), y, 'var(--muted)') + dot(X(end), y, 'var(--accent)', 6);
      const output = counting ? ui.t(`${end} unit steps from zero → ${end}`, `从零起走 ${end} 个单位 → ${end}`) : `${fmt(start.value)} + (${fmt(delta.value)}) = ${fmt(end)}`;
      ui.svg(drawing, output, 180); ui.say(output);
    }
  }
  render();
}

function fractions(ui) {
  ui.setup('Equal parts, one unit', '等分与一个整体', 'Each row represents one whole of the same size. Shaded pieces count the numerator.', '每行表示大小相同的一个整体。着色份数表示分子。', 'The bars use equal-sized pieces within each row. Decimal and percentage displays are rounded.', '每行内部的每一份大小相等。小数和百分数显示经过四舍五入。');
  const d = ui.range('Denominator: parts per whole', '分母：每个整体分成几份', 1, 12, 1, 4, () => { n.max(2 * d.value); if (n.value > 2 * d.value) n.set(2 * d.value); render(); });
  const n = ui.range('Numerator: shaded parts', '分子：着色份数', 0, 8, 1, 3, render);
  function render() {
    let drawing = '';
    for (let row = 0; row < 2; row++) {
      for (let part = 0; part < d.value; part++) {
        const filled = row * d.value + part < n.value;
        drawing += `<rect x="${20 + part * 300 / d.value}" y="${30 + row * 80}" width="${300 / d.value - 3}" height="45" rx="3" fill="${filled ? 'var(--accent)' : 'var(--rail)'}" stroke="var(--line)"/>`;
      }
      drawing += text(170, 92 + row * 80, ui.t(`Whole ${row + 1}`, `第 ${row + 1} 个整体`));
    }
    const divisor = gcd(n.value, d.value) || 1;
    const output = `${n.value}/${d.value} = ${n.value / divisor}/${d.value / divisor} · ${ui.t('decimal', '小数')} ≈ ${fmt(n.value / d.value)} · ≈ ${fmt(n.value / d.value * 100, 1)}%`;
    ui.svg(drawing, output, 195); ui.say(output);
  }
  render();
}

function linearFunction(ui, lesson) {
  const systems = lesson.id === 'math.linear-systems';
  ui.setup(systems ? 'Where two equations meet' : 'Input, rule, output', systems ? '两个方程的交点' : '输入、规则、输出', systems ? 'Compare y = x + 1 with y = mx + b. Both equations must hold at an intersection.' : 'Change m, b and the input x in y = mx + b. Graph axes use numerical coordinates.', systems ? '比较 y = x + 1 与 y = mx + b。交点处必须同时满足两个方程。' : '改变 y = mx + b 中的 m、b 与输入 x。图像坐标轴表示数值坐标。', 'The line continues beyond the plotted window. Calculations describe the full equations.', '直线延伸到绘图窗口之外。计算结果针对完整方程。');
  const m = ui.range('Slope m', '斜率 m', -2, 2, 0.5, systems ? -1 : 1, render);
  const b = ui.range('Intercept b', '截距 b', -3, 3, 0.5, systems ? 3 : 1, render);
  const x = systems ? null : ui.range('Input x', '输入 x', -4, 4, 0.5, 2, render);
  function render() {
    const p = graph(ui, { yMin: -14, yMax: 14, yTicks: [-10, -5, 5, 10] });
    let marks = p.curve(z => m.value * z + b.value), output;
    if (systems) {
      marks += p.curve(z => z + 1, 'var(--physics)', '6 4');
      if (m.value === 1) output = b.value === 1 ? ui.t('Same line: infinitely many solutions.', '同一条直线：有无穷多个解。') : ui.t('Parallel distinct lines: no solution.', '两条不同的平行线：无解。');
      else {
        const ix = (b.value - 1) / (1 - m.value), iy = ix + 1;
        marks += dot(p.X(ix), p.Y(iy), 'var(--success)', 6);
        output = ui.t(`Unique solution: x = ${fmt(ix)}, y = ${fmt(iy)}`, `唯一解：x = ${fmt(ix)}，y = ${fmt(iy)}`);
      }
    } else {
      const y = m.value * x.value + b.value;
      marks += line(p.X(x.value), p.Y(0), p.X(x.value), p.Y(y), 'var(--muted)', 1.5, '4 4') + dot(p.X(x.value), p.Y(y));
      output = `y = (${fmt(m.value)}) × (${fmt(x.value)}) + (${fmt(b.value)}) = ${fmt(y)}`;
    }
    ui.svg(p.base + p.clip(marks), output, p.height); ui.say(output);
  }
  render();
}

function derivative(ui, lesson) {
  const quadratic = lesson.id === 'math.quadratics';
  ui.setup(quadratic ? 'A quadratic has a changing slope' : 'Secant to tangent', quadratic ? '二次函数的斜率会改变' : '从割线到切线', 'For f(x) = x², compare (a, a²) with (a+h, (a+h)²). The dashed line is the tangent.', '对 f(x) = x²，比较点 (a, a²) 与 (a+h, (a+h)²)。虚线表示切线。', 'At h = 0 the secant quotient is undefined. The tangent slope is established by the limit 2a + h → 2a, not by dividing by zero.', 'h = 0 时割线的差商无定义。切线斜率由极限 2a + h → 2a 得到，不是除以零。');
  const a = ui.range('Base point a', '基准点 a', -2, 2, 0.25, 1, render);
  const h = ui.range('Separation h', '间隔 h', -1, 1, 0.1, 0.8, render);
  function render() {
    const p = graph(ui, { xMin: -3, xMax: 3, yMin: -1, yMax: 10, xTicks: [-2, -1, 0, 1, 2], yTicks: [2, 4, 6, 8], yLabel: 'f(x)' });
    const tangent = z => a.value ** 2 + 2 * a.value * (z - a.value);
    let marks = p.curve(z => z * z) + p.curve(tangent, 'var(--physics)', '6 4') + dot(p.X(a.value), p.Y(a.value ** 2), 'var(--accent)', 5);
    if (h.value !== 0) {
      const secantSlope = 2 * a.value + h.value;
      marks += p.curve(z => a.value ** 2 + secantSlope * (z - a.value), 'var(--chemistry)') + dot(p.X(a.value + h.value), p.Y((a.value + h.value) ** 2), 'var(--chemistry)', 5);
    }
    const output = h.value === 0 ? ui.t(`h = 0: secant undefined; tangent slope = ${fmt(2 * a.value)}.`, `h = 0：割线差商无定义；切线斜率 = ${fmt(2 * a.value)}。`) : ui.t(`Secant slope 2a + h = ${fmt(2 * a.value + h.value)}; tangent slope 2a = ${fmt(2 * a.value)}.`, `割线斜率 2a + h = ${fmt(2 * a.value + h.value)}；切线斜率 2a = ${fmt(2 * a.value)}。`);
    ui.svg(p.base + p.clip(marks), output, p.height); ui.say(output);
  }
  render();
}

function vectors(ui, lesson) {
  const coordinates = lesson.id === 'math.coordinates', independence = lesson.id === 'math.linear-independence';
  ui.setup(coordinates ? 'An ordered pair locates a point' : independence ? 'Does a vector add a direction?' : 'Add directed changes', coordinates ? '有序数对确定点的位置' : independence ? '向量是否增加一个方向？' : '把有向变化相加', coordinates ? 'Move x horizontally, then y vertically from the origin. Coordinate units are equal on both axes.' : independence ? 'u = (1,0), v = (1,t). The third arrow is αu + βv.' : 'u = (2,1), v = (−1,2). Scale u by k, then add v head-to-tail.', coordinates ? '从原点先水平移动 x，再竖直移动 y。两轴的坐标单位长度相同。' : independence ? 'u = (1,0)，v = (1,t)。第三个箭头表示 αu + βv。' : 'u = (2,1)，v = (−1,2)。先把 u 乘以 k，再首尾相接地加 v。', independence ? 'The picture illustrates span. Algebra proves independence exactly when t ≠ 0; a small nonzero value is not treated as zero.' : 'These are exact coordinate calculations in a two-dimensional Euclidean model.', independence ? '图像用于观察张成空间。代数证明 t ≠ 0 时恰好线性无关；很小的非零值不会被当成零。' : '这是二维欧氏模型中的精确坐标计算。');
  let x, y, parameter, alpha, beta;
  if (coordinates) { x = ui.range('Horizontal x', '水平 x', -4, 4, 1, 3, render); y = ui.range('Vertical y', '竖直 y', -4, 4, 1, 2, render); }
  else if (independence) { parameter = ui.range('Direction parameter t', '方向参数 t', -3, 3, 0.25, 1, render); alpha = ui.range('Coefficient α', '系数 α', -2, 2, 0.5, 1, render); beta = ui.range('Coefficient β', '系数 β', -2, 2, 0.5, 1, render); }
  else parameter = ui.range('Scale k', '倍数 k', -2, 2, 0.5, 1, render);
  function render() {
    // A square plot and identical ranges preserve Euclidean angles and lengths.
    const p = graph(ui, { xMin: -7, xMax: 7, yMin: -7, yMax: 7, xTicks: [-6, -3, 0, 3, 6], yTicks: [-6, -3, 3, 6], height: 337 });
    let marks = '', output;
    if (coordinates) {
      marks = arrow(p.X(0), p.Y(0), p.X(x.value), p.Y(0)) + arrow(p.X(x.value), p.Y(0), p.X(x.value), p.Y(y.value), 'var(--physics)') + dot(p.X(x.value), p.Y(y.value));
      output = ui.t(`P = (${fmt(x.value)}, ${fmt(y.value)}); distance from origin = √${x.value ** 2 + y.value ** 2} ≈ ${fmt(Math.hypot(x.value, y.value))}`, `P = (${fmt(x.value)}, ${fmt(y.value)})；到原点距离 = √${x.value ** 2 + y.value ** 2} ≈ ${fmt(Math.hypot(x.value, y.value))}`);
    } else if (independence) {
      const t = parameter.value, rx = alpha.value + beta.value, ry = beta.value * t;
      if (t === 0) marks += line(p.X(-7), p.Y(0), p.X(7), p.Y(0), 'var(--soft)', 12);
      else marks += `<rect x="${p.X(-7)}" y="${p.Y(7)}" width="270" height="270" fill="var(--soft)" opacity="0.55"/>`;
      marks += arrow(p.X(0), p.Y(0), p.X(1), p.Y(0), 'var(--physics)') + arrow(p.X(0), p.Y(0), p.X(1), p.Y(t), 'var(--chemistry)') + arrow(p.X(0), p.Y(0), p.X(rx), p.Y(ry));
      output = `αu + βv = (${fmt(rx)}, ${fmt(ry)}) · ${ui.t(t === 0 ? 'dependent; span is a line' : 'independent; span is the plane', t === 0 ? '线性相关；张成为一条直线' : '线性无关；张成为整个平面')}`;
    } else {
      const k = parameter.value, ux = 2 * k, uy = k, rx = ux - 1, ry = uy + 2;
      marks = arrow(p.X(0), p.Y(0), p.X(ux), p.Y(uy), 'var(--physics)') + arrow(p.X(ux), p.Y(uy), p.X(rx), p.Y(ry), 'var(--chemistry)') + arrow(p.X(0), p.Y(0), p.X(rx), p.Y(ry));
      output = `${fmt(k)}(2,1) + (−1,2) = (${fmt(rx)}, ${fmt(ry)})`;
    }
    ui.svg(p.base + p.clip(marks), output, p.height); ui.say(output);
  }
  render();
}

function motion(ui, lesson) {
  const calculus = lesson.id === 'physics.velocity-calculus';
  ui.setup(calculus ? 'A position model and its derivative' : 'Position from constant velocity', calculus ? '位置模型及其导数' : '恒定速度决定位置', calculus ? 'x(t) = ct², so v(t) = 2ct and a = 2c. Move the time marker; units are shown.' : 'x₀ = 0 m and constant v, so x(t) = vt. A negative velocity moves toward negative positions.', calculus ? 'x(t) = ct²，因此 v(t) = 2ct、a = 2c。移动时间标记，并留意单位。' : 'x₀ = 0 m、速度 v 恒定，因此 x(t) = vt。负速度表示朝负位置方向移动。', 'This is a chosen one-dimensional model with no measurement noise. The curve is a position–time graph, not the physical path.', '这是没有测量噪声的一维设定模型。曲线是位置—时间图像，不是物体的实际路径。');
  const value = ui.range(calculus ? 'Coefficient c' : 'Constant velocity v', calculus ? '系数 c' : '恒定速度 v', calculus ? 0 : -5, 5, 0.5, calculus ? 2 : 3, render, calculus ? ' m/s²' : ' m/s');
  const time = ui.range('Time t', '时间 t', 0, 4, 0.1, 2, render, ' s');
  ui.button('Advance by 0.5 s', '前进 0.5 s', () => { time.set(Math.min(4, time.value + 0.5)); render(); });
  ui.button('Reset time', '重置时间', () => { time.set(0); render(); });
  function render() {
    const position = t => calculus ? value.value * t * t : value.value * t;
    const p = graph(ui, { xMin: 0, xMax: 4, yMin: calculus ? 0 : -20, yMax: calculus ? 80 : 20, xTicks: [0, 1, 2, 3, 4], yTicks: calculus ? [20, 40, 60, 80] : [-20, -10, 10, 20], xLabel: 't (s)', yLabel: 'x (m)' });
    const x = position(time.value), v = calculus ? 2 * value.value * time.value : value.value;
    let marks = p.curve(position) + line(p.X(time.value), p.Y(0), p.X(time.value), p.Y(x), 'var(--muted)', 1.5, '4 4') + dot(p.X(time.value), p.Y(x), 'var(--accent)', 5);
    if (calculus) marks += p.curve(t => x + v * (t - time.value), 'var(--physics)', '6 4');
    const output = `t = ${fmt(time.value)} s · x = ${fmt(x)} m · v = ${fmt(v)} m/s${calculus ? ` · a = ${fmt(2 * value.value)} m/s²` : ''}`;
    ui.svg(p.base + p.clip(marks), output, p.height); ui.say(output);
  }
  render();
}

function force(ui, lesson) {
  const energy = lesson.id === 'physics.energy';
  ui.setup(energy ? 'A complete work account' : 'Add forces before dividing by mass', energy ? '完整的功与能量核算' : '先求合力，再除以质量', energy ? 'A 2 kg cart begins moving right at 4 m/s (K₀ = 16 J). Forces are constant while it moves right.' : 'Horizontal force diagram: the cart moves right at this instant. Weight and support balance and are omitted.', energy ? '2 kg 小车以 4 m/s 向右运动，初动能 16 J。向右运动期间各力恒定。' : '水平受力图：此刻小车向右运动。重力与支持力平衡，图中省略。', 'Prescribed-force model. This does not infer static friction or continue a constant leftward resistance after the cart stops.', '这是给定力的模型，不推断静摩擦，也不会在小车停止后仍盲目延用向左的阻力。');
  const pull = ui.range('Pull to the right', '向右拉力', 0, 20, 1, 12, render, ' N');
  const resistance = ui.range('Resistance to the left', '向左阻力', 0, 12, 1, 4, render, ' N');
  const third = ui.range(energy ? 'Requested displacement d' : 'Mass m', energy ? '所求位移 d' : '质量 m', energy ? 0 : 1, energy ? 6 : 8, energy ? 0.5 : 0.5, energy ? 3 : 2, render, energy ? ' m' : ' kg');
  function render() {
    const mass = energy ? 2 : third.value, net = pull.value - resistance.value, a = net / mass;
    let drawing = line(15, 171, 325, 171, 'var(--muted)', 2) + `<rect x="132" y="97" width="76" height="57" rx="9" fill="var(--soft)" stroke="var(--accent)"/>`;
    drawing += dot(146, 164, 'var(--muted)', 7) + dot(194, 164, 'var(--muted)', 7) + text(170, 131, `${fmt(mass)} kg`, 'mark-label');
    drawing += arrow(209, 119, 209 + pull.value * 4.5, 119) + arrow(131, 139, 131 - resistance.value * 4.5, 139, 'var(--physics)');
    drawing += text(255, 95, `${pull.value} N →`) + text(75, 122, `← ${resistance.value} N`) + text(170, 211, `Fnet = ${fmt(net)} N`);
    let output = `a = (${pull.value} − ${resistance.value}) / ${fmt(mass)} = ${fmt(a)} m/s²`;
    if (energy) {
      const wp = pull.value * third.value, wr = -resistance.value * third.value, finalK = 16 + wp + wr;
      output = finalK < 0 ? ui.t(`The cart stops after ${fmt(16 / -net)} m. It cannot reach ${fmt(third.value)} m under this model.`, `小车在 ${fmt(16 / -net)} m 后停止，在此模型下无法到达 ${fmt(third.value)} m。`) : `Wpull = ${fmt(wp)} J · Wres = ${fmt(wr)} J · K = ${fmt(finalK)} J · v = ${fmt(Math.sqrt(finalK))} m/s`;
    }
    ui.svg(drawing, output); ui.say(output);
  }
  render();
}

const elements = [null, ['H', 'Hydrogen', '氢'], ['He', 'Helium', '氦'], ['Li', 'Lithium', '锂'], ['Be', 'Beryllium', '铍'], ['B', 'Boron', '硼'], ['C', 'Carbon', '碳'], ['N', 'Nitrogen', '氮'], ['O', 'Oxygen', '氧'], ['F', 'Fluorine', '氟'], ['Ne', 'Neon', '氖'], ['Na', 'Sodium', '钠'], ['Mg', 'Magnesium', '镁'], ['Al', 'Aluminium', '铝'], ['Si', 'Silicon', '硅'], ['P', 'Phosphorus', '磷'], ['S', 'Sulfur', '硫'], ['Cl', 'Chlorine', '氯'], ['Ar', 'Argon', '氩']];

function atoms(ui, lesson) {
  if (lesson.id === 'chemistry.matter') return matter(ui);
  if (lesson.id === 'chemistry.moles') return moles(ui);
  if (lesson.id === 'chemistry.reactions') return reaction(ui);
  if (lesson.id === 'chemistry.bonding') return bonding(ui);
  ui.setup('An atom and ion inventory', '原子与离子的粒子清单', 'Protons fix the element. Neutrons change the isotope. Charge compares protons with electrons.', '质子数决定元素，中子数改变同位素，电荷取决于质子与电子数量之差。', 'This is a counting diagram, not an orbital picture, scale model or claim that each chosen isotope is stable.', '这是计数图，不是电子轨道图或比例模型，也不表示每个所选同位素都稳定。');
  const z = ui.range('Protons Z', '质子数 Z', 1, 18, 1, 6, () => { charge.max(Math.min(2, z.value)); render(); });
  const neutron = ui.range('Neutrons N', '中子数 N', 0, 22, 1, 6, render);
  const charge = ui.range('Net charge q in units of e', '净电荷 q（单位 e）', -2, 2, 1, 0, render);
  function render() {
    const e = z.value - charge.value, atom = elements[z.value];
    let drawing = `<rect x="24" y="28" width="292" height="77" rx="15" fill="var(--soft)" stroke="var(--accent)"/>`;
    drawing += text(170, 57, ui.t('Nucleus', '原子核'), 'mark-label') + text(170, 82, `${z.value} p⁺ + ${neutron.value} n⁰`);
    drawing += text(170, 133, ui.t(`${e} electrons outside the nucleus`, `核外有 ${e} 个电子`));
    for (let i = 0; i < e; i++) drawing += dot(38 + (i % 10) * 29, 158 + Math.floor(i / 10) * 26, 'var(--physics)', 7);
    const output = `${atom[0]} · ${ui.t(atom[1], atom[2])} · A = ${z.value + neutron.value} · q = ${fmt(charge.value)}e · ${e} e⁻`;
    ui.svg(drawing, output, 210); ui.say(output);
  }
  render();
}

function molecule(x, y, water) {
  if (!water) return line(x - 13, y, x + 13, y, 'var(--muted)', 4) + dot(x - 13, y, 'var(--chemistry)', 10) + dot(x + 13, y, 'var(--chemistry)', 10) + text(x, y + 30, 'O₂');
  return line(x, y, x - 18, y + 15, 'var(--muted)', 3) + line(x, y, x + 18, y + 15, 'var(--muted)', 3) + dot(x, y, 'var(--chemistry)', 11) + dot(x - 18, y + 15, 'var(--physics)', 7) + dot(x + 18, y + 15, 'var(--physics)', 7) + text(x, y + 40, 'H₂O');
}
function matter(ui) {
  ui.setup('Classify a particle sample', '给粒子样品分类', 'Orange circles mean oxygen; blue circles mean hydrogen. Connected groups represent molecules.', '橙色圆圈表示氧，蓝色表示氢；相连的一组表示分子。', 'Colours, sizes and spacing are symbolic. This is not a microscope image or a scale model.', '颜色、大小和间距都用于示意，不是显微图像或比例模型。');
  const sample = ui.select('Sample', '样品', [['element', 'Only O₂', '只有 O₂'], ['compound', 'Only H₂O', '只有 H₂O'], ['mixture', 'O₂ and H₂O', 'O₂ 与 H₂O']], 'mixture', render);
  function render() {
    let drawing = '';
    for (let i = 0; i < 6; i++) drawing += molecule(65 + (i % 3) * 105, 50 + Math.floor(i / 3) * 100, sample.value === 'compound' || sample.value === 'mixture' && i % 2 === 0);
    const output = sample.value === 'element' ? ui.t('Elemental substance: one element, many molecules.', '单质：只有一种元素，但有许多分子。') : sample.value === 'compound' ? ui.t('Compound: each molecule contains two element types.', '化合物：每个分子含两种元素。') : ui.t('Mixture: two chemical substances share the sample.', '混合物：样品中同时存在两种化学物质。');
    ui.svg(drawing, output, 215); ui.say(output);
  }
  render();
}

function moles(ui) {
  ui.setup('One amount, three representations', '同一份物质，三种表示', 'Water molecules are the counting entities. Use the supplied rounded molar mass 18.0 g/mol.', '计数对象是水分子。使用题设近似摩尔质量 18.0 g/mol。', 'Amount is adjustable; particle counts are rounded for display. A mole is a count-based amount, not a fixed mass for every substance.', '可调整物质的量，显示的粒子数经过舍入。摩尔以粒子计数为基础，不代表所有物质都有相同质量。');
  const n = ui.range('Amount of H₂O', 'H₂O 的物质的量', 0.1, 2, 0.1, 0.5, render, ' mol');
  function render() {
    const rows = [`n = ${fmt(n.value)} mol H₂O`, `m = nM = ${fmt(18 * n.value)} g`, `N ≈ ${fmt(n.value * 6.02214076, 4)} × 10²³`];
    let drawing = '';
    rows.forEach((row, i) => { drawing += `<rect x="15" y="${10 + i * 73}" width="310" height="49" rx="10" fill="var(--soft)"/>` + text(170, 40 + i * 73, row, 'mark-label'); if (i < 2) drawing += arrow(170, 61 + i * 73, 170, 80 + i * 73, 'var(--muted)', 1.5); });
    const output = ui.t(`Hydrogen atoms: ${fmt(2 * n.value)} mol. Oxygen atoms: ${fmt(n.value)} mol.`, `氢原子：${fmt(2 * n.value)} mol；氧原子：${fmt(n.value)} mol。`);
    ui.svg(drawing, [...rows, output].join('; '), 220); ui.say(output);
  }
  render();
}

function reaction(ui) {
  ui.setup('Balance an atom inventory', '配平原子清单', 'Adjust coefficients in aH₂ + bO₂ → cH₂O. Formula subscripts stay fixed.', '调整 aH₂ + bO₂ → cH₂O 的系数。化学式下标保持不变。', 'This checks atom conservation only; it is not a reaction procedure or a statement about rate and conditions.', '这里只检查原子守恒，不是反应操作流程，也不描述速率与实验条件。');
  const a = ui.range('Coefficient a for H₂', 'H₂ 的系数 a', 1, 4, 1, 1, render);
  const b = ui.range('Coefficient b for O₂', 'O₂ 的系数 b', 1, 4, 1, 1, render);
  const c = ui.range('Coefficient c for H₂O', 'H₂O 的系数 c', 1, 6, 1, 1, render);
  function render() {
    const hL = 2 * a.value, oL = 2 * b.value, hR = 2 * c.value, oR = c.value, balanced = hL === hR && oL === oR;
    const equation = `${a.value}H₂ + ${b.value}O₂ → ${c.value}H₂O`;
    let drawing = text(170, 28, equation, 'mark-label') + text(100, 67, ui.t('Reactants', '反应物')) + text(258, 67, ui.t('Products', '产物')) + line(178, 50, 178, 190);
    for (const [row, label, left, right] of [[0, 'H', hL, hR], [1, 'O', oL, oR]]) {
      drawing += text(23, 103 + row * 64, label, 'mark-label') + text(100, 102 + row * 64, left, 'mark-label') + text(258, 102 + row * 64, right, 'mark-label') + text(180, 126 + row * 64, left === right ? '=' : '≠', 'mark-label');
    }
    const output = ui.t(balanced ? 'Balanced: hydrogen and oxygen are each conserved.' : 'Not balanced: compare each element separately.', balanced ? '已配平：氢和氧的原子数分别守恒。' : '未配平：分别检查每种元素。');
    ui.svg(drawing, `${equation}. H: ${hL} → ${hR}; O: ${oL} → ${oR}. ${output}`, 215); ui.say(output);
  }
  render();
}

function bonding(ui) {
  ui.setup('Neutral ionic composition', '电中性的离子组成', 'Choose charges for a generic cation M and anion X. Find the smallest whole-number ratio.', '为一般正离子 M 与负离子 X 选择电荷，求最小整数比例。', 'This is charge bookkeeping, not a picture of a molecule or a prediction that every chosen combination is a real stable compound.', '这是电荷核算，不是分子图，也不保证每种所选组合都对应真实稳定化合物。');
  const positive = ui.range('Positive ion charge', '正离子电荷', 1, 3, 1, 2, render);
  const negative = ui.range('Negative ion charge magnitude', '负离子电荷绝对值', 1, 3, 1, 1, render);
  function render() {
    const d = gcd(positive.value, negative.value), nM = negative.value / d, nX = positive.value / d;
    let drawing = text(170, 25, ui.t('Smallest neutral group', '最小电中性组合'));
    for (let i = 0; i < nM; i++) drawing += dot(80 + i * 90, 76, 'var(--accent)', 25) + `<text x="${80 + i * 90}" y="81" text-anchor="middle" style="fill:var(--accent-text)">M${positive.value}+</text>`;
    for (let i = 0; i < nX; i++) drawing += dot(80 + i * 90, 148, 'var(--physics)', 25) + `<text x="${80 + i * 90}" y="153" text-anchor="middle" style="fill:white">X${negative.value}−</text>`;
    const output = `${nM} × (+${positive.value}) + ${nX} × (−${negative.value}) = 0 · M:X = ${nM}:${nX}`;
    ui.svg(drawing, output, 192); ui.say(output);
  }
  render();
}

function cell(ui, lesson) {
  if (lesson.id === 'biology.membranes') return membranes(ui);
  if (lesson.id === 'biology.energy') return enzymes(ui);
  ui.setup('Connect a structure with a task', '连接结构与任务', 'Explore a simplified eukaryotic cell. Choose a structure to highlight its role.', '探索简化的真核细胞。选择结构以突出其作用。', 'Schematic, not to scale. Organelle number, colour and arrangement are illustrative; real cell types differ.', '示意图，不按比例。细胞器数量、颜色与位置仅供说明，真实细胞类型有差异。');
  const roles = {
    membrane: ['Plasma membrane', '细胞膜', 'Controls exchange with the surroundings through selective routes.', '通过选择性通路控制与环境的物质交换。'],
    nucleus: ['Nucleus', '细胞核', 'Contains most of the cell’s DNA; gene expression helps coordinate cell activity.', '包含细胞大部分 DNA；基因表达参与协调细胞活动。'],
    ribosome: ['Ribosome', '核糖体', 'Assembles amino acids into proteins using information read from messenger RNA.', '读取信使 RNA 的信息，把氨基酸组装成蛋白质。'],
    mitochondrion: ['Mitochondrion', '线粒体', 'Supports energy transformations and ATP production; it does not create energy.', '支持能量转化与 ATP 生成，不会凭空创造能量。']
  };
  const organelle = ui.select('Structure', '结构', Object.entries(roles).map(([key, r]) => [key, r[0], r[1]]), 'membrane', render);
  function render() {
    const selected = organelle.value, stroke = key => selected === key ? 'var(--accent)' : 'var(--muted)', width = key => selected === key ? 4 : 1.5;
    let drawing = `<ellipse cx="170" cy="118" rx="145" ry="93" fill="var(--rail)" stroke="${stroke('membrane')}" stroke-width="${width('membrane')}"/><ellipse cx="155" cy="115" rx="45" ry="39" fill="var(--soft)" stroke="${stroke('nucleus')}" stroke-width="${width('nucleus')}"/>`;
    drawing += text(155, 120, ui.t('Nucleus', '细胞核'));
    for (const [x, y, angle] of [[83, 88, -25], [234, 143, 15]]) drawing += `<g transform="translate(${x} ${y}) rotate(${angle})"><ellipse rx="27" ry="13" fill="var(--panel)" stroke="${stroke('mitochondrion')}" stroke-width="${width('mitochondrion')}"/><path d="M-18,0 L-10,-7 L-2,7 L6,-7 L14,5" fill="none" stroke="${stroke('mitochondrion')}" stroke-width="1.5"/></g>`;
    for (const [x, y] of [[218, 75], [96, 150], [205, 106], [135, 177], [263, 98], [70, 126]]) drawing += dot(x, y, selected === 'ribosome' ? 'var(--accent)' : 'var(--muted)', selected === 'ribosome' ? 6 : 3);
    const r = roles[selected], output = `${ui.t(r[0], r[1])}: ${ui.t(r[2], r[3])}`;
    ui.svg(drawing, output); ui.say(output);
  }
  render();
}

function membranes(ui) {
  ui.setup('Initial direction of osmosis', '渗透的初始方向', 'Two equal-pressure compartments: water can cross the membrane; the solute cannot.', '两侧初始压强相同；水可穿膜，溶质不能穿膜。', 'Arrows show the initial net tendency in a simplified model. Water still moves both ways; later pressure and concentration changes are not simulated.', '箭头表示简化模型中的初始净趋势。水仍双向运动；这里不模拟后续压强和浓度变化。');
  const left = ui.range('Left solute concentration', '左侧溶质浓度', 0.1, 1, 0.1, 0.2, render, ' mol/L');
  const right = ui.range('Right solute concentration', '右侧溶质浓度', 0.1, 1, 0.1, 0.6, render, ' mol/L');
  function render() {
    let drawing = `<rect x="20" y="22" width="300" height="150" rx="12" fill="var(--soft)" stroke="var(--line)"/>` + line(170, 22, 170, 172, 'var(--accent)', 5, '9 5');
    for (const [start, c] of [[43, left.value], [197, right.value]]) for (let i = 0; i < Math.round(c * 10); i++) drawing += dot(start + (i % 4) * 27, 52 + Math.floor(i / 4) * 35, 'var(--chemistry)', 5);
    drawing += text(89, 194, `${fmt(left.value)} mol/L`) + text(247, 194, `${fmt(right.value)} mol/L`);
    const delta = right.value - left.value;
    if (delta !== 0) drawing += arrow(delta > 0 ? 119 : 221, 218, delta > 0 ? 221 : 119, 218, 'var(--physics)', 4);
    const output = delta > 0 ? ui.t('Initial net water movement: left → right.', '起初水的净运动：左 → 右。') : delta < 0 ? ui.t('Initial net water movement: right → left.', '起初水的净运动：右 → 左。') : ui.t('Equal conditions: no initial net flow; molecules still move.', '条件相同：起初没有净流动，分子仍在运动。');
    ui.svg(drawing, output, 243); ui.say(output);
  }
  render();
}

function enzymes(ui) {
  ui.setup('An enzyme changes the barrier', '酶改变能垒', 'Compare routes with the same starting and ending free energies. Vertical values are illustrative energy units.', '比较初末自由能相同的两条路径。纵轴数值为示意能量单位。', 'This is a schematic energy profile, not experimental data or a quantitative reaction-rate prediction. The final free-energy change remains −2 in both routes.', '这是能量示意图，不是实验数据或定量反应速率预测。两条路径的最终自由能变化均为 −2。');
  const pathway = ui.select('Pathway', '路径', [['without', 'Without enzyme', '没有酶'], ['with', 'With enzyme', '有酶']], 'without', render);
  function render() {
    const barrier = pathway.value === 'with' ? 3 : 7;
    const Y = g => 180 - g * 18;
    const curve = peak => `<path d="M35,${Y(0)} C75,${Y(0)} 83,${Y(peak)} 166,${Y(peak)} C244,${Y(peak)} 240,${Y(-2)} 308,${Y(-2)}" fill="none" stroke="${peak === barrier ? 'var(--accent)' : 'var(--line)'}" stroke-width="${peak === barrier ? 3 : 1.5}"${peak === barrier ? '' : ' stroke-dasharray="5 4"'}/>`;
    let drawing = line(35, 24, 35, 223, 'var(--muted)') + line(35, 223, 312, 223, 'var(--muted)') + text(170, 246, ui.t('Reaction progress (schematic)', '反应进程（示意）'));
    for (const g of [-2, 0, 3, 7]) drawing += text(17, Y(g) + 4, g) + line(35, Y(g), 309, Y(g), 'var(--line)', 0.8, '3 4');
    drawing += curve(7) + curve(3) + dot(35, Y(0), 'var(--physics)', 5) + dot(308, Y(-2), 'var(--physics)', 5);
    drawing += text(166, 18, ui.t('Free energy (illustrative units)', '自由能（示意单位）'));
    const output = ui.t(`Activation barrier: ${barrier}. Overall ΔG: −2. The equilibrium is unchanged.`, `活化能垒：${barrier}。总 ΔG：−2。平衡不变。`);
    ui.svg(drawing, output, 258); ui.say(output);
  }
  render();
}

function inheritance(ui, lesson) {
  if (lesson.id === 'biology.dna') return dna(ui);
  ui.setup('Derive a one-locus cross', '推导单个位点的遗传组合', 'Diploid, equal-segregation model with independently combining gametes. Uppercase A is completely dominant for the displayed phenotype.', '双倍体、等概率分离、配子独立结合的模型。显示的表现型假设 A 完全显性。', 'Each box has probability 1/4, including duplicate genotypes. Expected fractions do not guarantee counts in a small family; complex traits require richer models.', '包括重复基因型在内，每格概率均为 1/4。期望比例不保证少数后代的实际数量；复杂性状需要更丰富的模型。');
  const options = [['AA', 'AA', 'AA'], ['Aa', 'Aa', 'Aa'], ['aa', 'aa', 'aa']];
  const one = ui.select('Parent 1', '亲本 1', options, 'Aa', render), two = ui.select('Parent 2', '亲本 2', options, 'Aa', render);
  function render() {
    const counts = { AA: 0, Aa: 0, aa: 0 };
    const table = element('table'); table.style.width = '100%'; table.style.borderCollapse = 'separate'; table.style.borderSpacing = '5px';
    table.setAttribute('aria-label', ui.t('Punnett square with equal-probability gametes', '配子等概率的遗传棋盘格'));
    const caption = element('caption', '', `${one.value} × ${two.value}`); table.append(caption);
    const head = element('tr'); head.append(element('th', '', '×'));
    for (const a of two.value) { const th = element('th', '', a); th.scope = 'col'; head.append(th); } table.append(head);
    for (const a of one.value) {
      const row = element('tr'), th = element('th', '', a); th.scope = 'row'; row.append(th);
      for (const b of two.value) {
        const g = [a, b].sort().join(''); counts[g]++;
        const cell = element('td', '', `${g} · ¼`); cell.style.textAlign = 'center'; cell.style.padding = '13px 6px'; cell.style.background = g === 'aa' ? 'var(--rail)' : 'var(--soft)'; cell.style.borderRadius = '8px'; row.append(cell);
      }
      table.append(row);
    }
    ui.stage.replaceChildren(table);
    ui.say(`P(AA) = ${counts.AA}/4 · P(Aa) = ${counts.Aa}/4 · P(aa) = ${counts.aa}/4 · ${ui.t('dominant phenotype', '显性表现型')} = ${counts.AA + counts.Aa}/4`);
  }
  render();
}

function dna(ui) {
  ui.setup('Match complementary bases', '配对互补碱基', 'Read aligned positions: DNA pairs A with T and C with G. Choose a sequence and a position.', '按对齐位置阅读：DNA 中 A 配 T，C 配 G。选择序列与位置。', 'This is an aligned base-pair diagram. Strands have opposite chemical directions; the lower row is not being relabelled as a separately oriented 5′→3′ sequence.', '这是碱基对齐示意图。两链的化学方向相反；下行没有被重新标记成独立的 5′→3′ 序列。');
  const sequence = ui.select('Top sequence', '上链序列', [['ATCG', 'A T C G', 'A T C G'], ['AACG', 'A A C G', 'A A C G'], ['GTTA', 'G T T A', 'G T T A']], 'ATCG', render);
  const position = ui.range('Highlighted position', '突出显示的位置', 1, 4, 1, 1, render);
  const match = { A: 'T', T: 'A', C: 'G', G: 'C' };
  function render() {
    let drawing = arrow(30, 48, 310, 48, 'var(--muted)', 2) + arrow(310, 158, 30, 158, 'var(--muted)', 2);
    const complement = [...sequence.value].map(base => match[base]).join('');
    for (let i = 0; i < 4; i++) {
      const x = 65 + i * 70, active = i === position.value - 1;
      drawing += line(x, 77, x, 129, active ? 'var(--accent)' : 'var(--line)', active ? 3 : 1.5, '4 3');
      for (const [y, letter] of [[73, sequence.value[i]], [141, complement[i]]]) drawing += `<rect x="${x - 20}" y="${y - 20}" width="40" height="36" rx="8" fill="${active ? 'var(--soft)' : 'var(--rail)'}"/>` + text(x, y + 4, letter, 'mark-label');
    }
    const base = sequence.value[position.value - 1], output = `${sequence.value} ↔ ${complement} · ${ui.t('selected pair', '选中碱基对')}: ${base}—${match[base]}`;
    ui.svg(drawing, output, 198); ui.say(output);
  }
  render();
}

function traceArray(ui, values, state) {
  const array = element('div', 'trace-array');
  array.setAttribute('role', 'list'); array.setAttribute('aria-label', ui.t('Array state', '数组状态'));
  values.forEach((value, index) => {
    const item = element('div', `trace-cell ${state(index)}`, String(value)); item.setAttribute('role', 'listitem'); item.setAttribute('aria-label', ui.t(`Index ${index}: ${value}`, `下标 ${index}：${value}`)); array.append(item);
  });
  ui.stage.replaceChildren(array);
}

function algorithm(ui, lesson) {
  if (lesson.id === 'cs.binary-search') return binarySearch(ui);
  if (lesson.id === 'cs.dp') return dynamicProgramming(ui);
  if (lesson.id === 'cs.complexity') return complexity(ui);
  ui.setup('Trace a running sum', '跟踪累加过程', 'Start sum = 0. Process i = 1, 2, 3, 4, 5 in order and apply sum += i.', '从 sum = 0 开始，依次处理 i = 1、2、3、4、5，每次执行 sum += i。', 'This is an authored algorithm trace. It does not compile or execute learner code.', '这是预先编写的算法跟踪，不会编译或执行学习者代码。');
  let step = 0;
  const next = ui.button('Process next value', '处理下一个数', () => { step = Math.min(5, step + 1); render(); });
  ui.button('Reset trace', '重置跟踪', () => { step = 0; render(); });
  function render() {
    traceArray(ui, [1, 2, 3, 4, 5], i => i < step ? 'visited' : i === step ? 'active' : '');
    next.disabled = step === 5;
    ui.say(ui.t(`Processed ${step}/5; sum = ${step * (step + 1) / 2}. ${step === 5 ? 'Loop finished; i = 6 fails i ≤ 5.' : `Next i = ${step + 1}.`}`, `已处理 ${step}/5；sum = ${step * (step + 1) / 2}。${step === 5 ? '循环结束，i = 6 不满足 i ≤ 5。' : `下一个 i = ${step + 1}。`}`));
  }
  render();
}

function binaryFrames(values, target) {
  let low = 0, high = values.length - 1, comparisons = 0;
  const frames = [{ low, high, mid: -1, comparisons, found: false, done: false, value: null }];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2), value = values[mid]; comparisons++;
    if (value === target) { frames.push({ low, high, mid, comparisons, found: true, done: true, value }); return frames; }
    if (value < target) low = mid + 1; else high = mid - 1;
    frames.push({ low, high, mid, comparisons, found: false, done: low > high, value });
  }
  return frames;
}

function binarySearch(ui) {
  ui.setup('Binary search maintains an interval', '二分查找维护候选区间', 'Sorted values: 2, 5, 8, 12, 16, 23, 31. Indices start at zero. Each step compares one midpoint.', '升序数列：2、5、8、12、16、23、31。下标从零开始，每步比较一个中点。', 'The trace is deterministic and assumes ascending order. It is not execution of code entered in the editor.', '跟踪过程是确定的，并假设数组升序；它不会执行编辑器中输入的代码。');
  const values = [2, 5, 8, 12, 16, 23, 31]; let step = 0;
  const target = ui.select('Target', '目标值', [['2', '2', '2'], ['8', '8', '8'], ['16', '16', '16'], ['31', '31', '31'], ['9', '9 (absent)', '9（不存在）']], '16', () => { step = 0; render(); });
  const next = ui.button('Compare midpoint', '比较中点', () => { step++; render(); });
  ui.button('Reset trace', '重置跟踪', () => { step = 0; render(); });
  function render() {
    const frames = binaryFrames(values, Number(target.value)); step = Math.min(step, frames.length - 1); const frame = frames[step];
    traceArray(ui, values, i => i === frame.mid ? 'active' : i < frame.low || i > frame.high ? 'visited' : '');
    next.disabled = frame.done;
    let output = frame.done ? frame.found ? ui.t(`Found at index ${frame.mid} after ${frame.comparisons} comparisons.`, `经过 ${frame.comparisons} 次比较，在下标 ${frame.mid} 找到。`) : ui.t(`No match after ${frame.comparisons} comparisons: low ${frame.low} > high ${frame.high}.`, `经过 ${frame.comparisons} 次比较，未找到：low ${frame.low} > high ${frame.high}。`) : ui.t(`Candidate indices [${frame.low}, ${frame.high}]. Next midpoint = ${Math.floor((frame.low + frame.high) / 2)}.`, `候选下标 [${frame.low}, ${frame.high}]，下一个中点 = ${Math.floor((frame.low + frame.high) / 2)}。`);
    if (frame.comparisons && !frame.found) output = ui.t(`Compared ${frame.value} with ${target.value}. `, `刚比较 ${frame.value} 与 ${target.value}。`) + output;
    ui.say(output);
  }
  render();
}

function dynamicProgramming(ui) {
  ui.setup('Build a table from smaller states', '从较小状态建立表格', 'Count ordered ways to climb n steps using moves of 1 or 2. dp[0] = 1 is the empty route.', '每次走 1 或 2 级，统计到达第 n 级的有序走法。dp[0] = 1 表示空走法。', 'This trace uses the stated counting model. It does not execute user code, and the base value follows from this state definition.', '本跟踪使用给定计数模型，不执行用户代码；初值来自这个状态定义。');
  let built = 0;
  const n = ui.range('Target n', '目标 n', 2, 8, 1, 5, () => { built = 0; render(); });
  const next = ui.button('Build next state', '计算下一个状态', () => { built = Math.min(n.value, built + 1); render(); });
  ui.button('Reset trace', '重置跟踪', () => { built = 0; render(); });
  function render() {
    const dp = [1, 1]; for (let i = 2; i <= n.value; i++) dp[i] = dp[i - 1] + dp[i - 2];
    traceArray(ui, Array.from({ length: n.value + 1 }, (_, i) => i <= built ? dp[i] : '?'), i => i === built ? 'active' : i < built ? 'visited' : '');
    const indexNote = element('p', '', ui.t(`Cells use indices 0 through ${n.value}, from left to right.`, `各格从左到右的下标为 0 到 ${n.value}。`)); ui.stage.append(indexNote);
    next.disabled = built === n.value;
    ui.say(built === 0 ? ui.t('dp[0] = 1: one empty route.', 'dp[0] = 1：一种空走法。') : built === 1 ? ui.t('dp[1] = 1: only the move [1].', 'dp[1] = 1：只有走法 [1]。') : `dp[${built}] = dp[${built - 1}] + dp[${built - 2}] = ${dp[built - 1]} + ${dp[built - 2]} = ${dp[built]}`);
  }
  render();
}

function complexity(ui) {
  ui.setup('Compare exact model counts', '比较明确模型的工作量', 'For n = 2ᵏ, compare n visits, n² ordered pairs, and k exact halvings until one remains.', '对 n = 2ᵏ，比较 n 次访问、n² 个有序对，以及减半到 1 所需的 k 次操作。', 'These are counts in three specified models, not measured runtime or a promise about every algorithm in an asymptotic class.', '这是三个指定模型的计数，不是实测运行时间，也不保证某个渐近类别中的所有算法都有同样表现。');
  const power = ui.range('Exponent k (size n = 2ᵏ)', '指数 k（规模 n = 2ᵏ）', 0, 6, 1, 3, render);
  function render() {
    const n = 2 ** power.value, counts = [n, n * n, power.value], labels = [ui.t('Visits: n', '访问：n'), ui.t('Pairs: n²', '有序对：n²'), ui.t('Halvings: k', '减半：k')];
    let drawing = '';
    counts.forEach((count, i) => { const width = 280 * count / (n * n); drawing += text(170, 24 + i * 72, `${labels[i]} = ${count}`) + `<rect x="25" y="${36 + i * 72}" width="${width}" height="22" rx="4" fill="${i === 0 ? 'var(--physics)' : i === 1 ? 'var(--accent)' : 'var(--chemistry)'}"/>`; });
    const output = `n = ${n} · n² = ${n * n} · log₂(n) = ${power.value}`;
    ui.svg(drawing, output, 223); ui.say(output);
  }
  render();
}

const renderers = { 'number-line': numberLine, fractions, 'linear-function': linearFunction, derivative, vectors, motion, force, atoms, cell, inheritance, algorithm };

/** Mount a keyboard-accessible local model; call the returned function before discarding its view. */
export function mountVisual(container, lesson, lang = 'en') {
  if (!container || !lesson) return () => {};
  const render = renderers[lesson.visual];
  if (!render) {
    const t = (en, zh) => String(lang).startsWith('zh') ? zh : en;
    container.classList.add('visual-card');
    container.replaceChildren(element('h3', '', t('Model not available yet', '模型尚未提供')), element('p', '', t('This lesson’s explanation and exercises remain available. An interactive model for this topic has not been installed.', '本课的讲解与练习仍可使用。这个主题的交互模型尚未安装。')));
    return () => {};
  }
  const ui = createUI(container, lang);
  render(ui, lesson);
  return () => ui.cleanup();
}
