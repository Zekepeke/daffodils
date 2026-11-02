/* The bouquet. Edit this list to rearrange it. Flowers later in the list sit in
   front of earlier ones.
   x, y: where the head sits, in vmin (x from the centre, y up from the bottom)
   size: head width in vmin
   head: image number in assets/daffodils
         front-on: 1 2 6   side, facing left: 3 5 9 11   side, facing right: 7
         three-quarter, facing left: 10   back: 4
   turn: head rotation in degrees
   flip: true mirrors the head, so it faces the other way
   neck: "left" or "right" curls the stem over into a head facing that way;
         "back" brings the stem up in front of a head seen from behind */
const DAFFODILS = [
  { x: 8,     y: 80, size: 18, head: 4,  turn: 8,   neck: "back" },
  { x: -17.5, y: 75, size: 16, head: 5,  turn: 12,  neck: "left" },
  { x: 38,    y: 73, size: 15, head: 9,  turn: -10, flip: true, neck: "right" },
  { x: 21,    y: 76, size: 21, head: 10, turn: -14, flip: true },
  { x: -37.5, y: 54, size: 19, head: 3,  turn: 8 },
  { x: 37.5,  y: 56, size: 17, head: 11, turn: -12, flip: true },
  { x: -1.5,  y: 60, size: 22, head: 2,  turn: 0 },
  { x: -23.5, y: 59, size: 26, head: 1,  turn: -8 },
  { x: 19,    y: 56, size: 26, head: 6,  turn: 8 },
  { x: 37.5,  y: 38, size: 16, head: 7,  turn: -6 },
  { x: -24.5, y: 35, size: 18, head: 11, turn: 12 },
  { x: -3.5,  y: 36, size: 22, head: 1,  turn: 24 },
];

/* Long blades fanning out behind the stems: [base x, tip x, tip height, width, tone]. */
const LEAVES = [
  [-2, -10, 66, 3.2, "c"],
  [3, 13, 70, 3.2, "c"],
  [-9, -30, 34, 2.6, "b"],
  [10, 39, 30, 2.6, "b"],
  [-5, -19, 52, 2.8, "a"],
  [6, 20, 50, 2.8, "a"],
  [-13, -22, 24, 2.4, "a"],
  [1, 6, 44, 3, "b"],
  [14, 26, 26, 2.4, "a"],
];

/* Background lights: [left %, top %, diameter in vmin, colour]. */
const BOKEH = [
  [8, 13, 3, "#c13bb0"], [24, 15, 2.6, "#c75c8e"], [18, 23, 2.8, "#c13bb0"],
  [5, 35, 2.6, "#a34a78"], [14, 41, 1.2, "#ef7fb0"], [10, 46, 1, "#ffa3c4"],
  [17, 52, 2.8, "#8d2d92"], [16, 62, 1.6, "#d9709a"], [2, 69, 2.8, "#c030ac"],
  [17, 81, 4.6, "#c13bb0"], [22, 93, 1.2, "#ef7fb0"], [50, 8, 2.8, "#a42f9b"],
  [64, 18, 2.6, "#b4507f"], [31, 27, 1.8, "#a84d8b"], [79, 25, 1.4, "#ffa3c4"],
  [77, 40, 2, "#a34a78"], [86, 45, 4, "#ff8fb4"], [91, 43, 2.4, "#ff7fa8"],
  [85, 71, 4.4, "#f27ea5"], [93, 71, 1.4, "#ef7fb0"], [77, 66, 1.4, "#d9709a"],
  [61, 75, 2.4, "#8d2d92"], [37, 57, 2.4, "#8d2d92"], [40, 74, 1.6, "#a84d8b"],
];

const n = (value) => value.toFixed(2);

function bladePath([base, tip, height, width]) {
  const x = 50 + base;
  const tipX = 50 + tip;
  const tipY = 100 - height;
  const midY = 100 - height * 0.5;
  const midX = x + (tip - base) * 0.3;
  return (
    `M${n(x - width / 2)} 100` +
    `Q${n(midX - width)} ${n(midY)} ${n(tipX)} ${n(tipY)}` +
    `Q${n(midX + width)} ${n(midY)} ${n(x + width / 2)} 100Z`
  );
}

function leavesMarkup() {
  const paths = LEAVES.map((leaf, i) => {
    const delay = n(0.6 + i * 0.22);
    return `<path class="leaf-blade leaf-blade--${leaf[4]}" style="--leaf-delay:${delay}s" d="${bladePath(leaf)}"/>`;
  }).join("");
  return `<div class="bouquet__leaves"><svg class="plant" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${paths}</svg></div>`;
}

/* Returns the part of the stem behind the head and the part drawn over it. */
function stemPaths(flower, base) {
  const hx = 50 + flower.x - base;
  const hy = 100 - flower.y;
  const rise = (toX, toY) =>
    `M50 100C50 ${n(100 - flower.y * 0.42)} ${n(50 + (toX - 50) * 0.55)} ${n(toY + flower.y * 0.3)} ${n(toX)} ${n(toY)}`;

  if (flower.neck === "left" || flower.neck === "right") {
    const behind = flower.neck === "left" ? 1 : -1;
    const reach = flower.size * behind;
    const shoulderX = hx + reach * 0.6;
    const shoulderY = hy + 5;
    const tipX = hx + reach * 0.2;
    const tipY = hy - 0.5;
    const curl = `Q${n(hx + reach * 0.55)} ${n(hy - flower.size * 0.2)} ${n(tipX)} ${n(tipY)}`;
    const spathe =
      `M${n(tipX + behind * 2.6)} ${n(tipY - 2.2)}` +
      `Q${n(tipX - behind * 0.6)} ${n(tipY - 2.2)} ${n(tipX - behind * 1.8)} ${n(tipY + 1.4)}` +
      `Q${n(tipX + behind * 1)} ${n(tipY + 1.8)} ${n(tipX + behind * 2.6)} ${n(tipY - 2.2)}Z`;
    return {
      stem: rise(shoulderX, shoulderY) + curl,
      front: `<path class="daffodil__neck" d="M${n(shoulderX)} ${n(shoulderY)}${curl}"/><path class="daffodil__spathe" d="${spathe}"/>`,
    };
  }
  if (flower.neck === "back") {
    return {
      stem: rise(hx, hy),
      front: `<path class="daffodil__neck" d="M${n(hx)} ${n(hy + flower.size * 0.55)}L${n(hx)} ${n(hy - 1)}"/>`,
    };
  }
  return { stem: rise(hx, hy), front: "" };
}

function daffodilMarkup(flower, index) {
  const base = flower.x * 0.42;
  const delay = 0.3 + index * 0.14;
  const { stem, front } = stemPaths(flower, base);
  const lights = [1, 2]
    .map((k) => `<div class="flower__light flower__light--${((index + k * 3) % 8) + 1}"></div>`)
    .join("");
  const plant = (cls, body) =>
    `<svg class="plant ${cls}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${body}</svg>`;

  return `
    <div class="daffodil" style="
      --base:${n(base)}vmin; --head-x:${n(flower.x - base)}vmin; --head-y:${flower.y}vmin;
      --size:${flower.size}vmin; --turn:${flower.turn}deg; --flip:${flower.flip ? -1 : 1};
      --delay:${n(delay)}s; --bloom-delay:${n(delay + 1.8)}s;
      --sway:${n(3.4 + (index % 4) * 0.5)}s; --sway-delay:${n(-index * 0.7)}s;">
      ${plant("", `<path class="daffodil__stem" pathLength="1" d="${stem}"/>`)}
      <div class="daffodil__bloom">
        ${lights}
        <img class="daffodil__head" src="assets/daffodils/head-${String(flower.head).padStart(2, "0")}.png" alt="">
      </div>
      ${front ? plant("daffodil__front", front) : ""}
    </div>`;
}

document.querySelector(".sky").innerHTML = BOKEH.map(
  ([x, y, d, c], i) =>
    `<span class="bokeh" style="--x:${x}%; --y:${y}%; --d:${d}vmin; --c:${c}; --in:${n(1 + (i % 6) * 0.4)}s; --t:${n(5 + (i % 5) * 1.3)}s; --drift-delay:${n(-i * 0.9)}s"></span>`
).join("");

document.querySelector(".bouquet").innerHTML =
  `<div class="bouquet__glow"></div>` + leavesMarkup() + DAFFODILS.map(daffodilMarkup).join("");
