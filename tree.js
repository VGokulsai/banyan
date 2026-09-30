// The banyan, for lookers.html and card.html. Everything below the marker is copied VERBATIM from index.html,
// so the logo can't drift: card.html?check fails if this block stops matching index.html character for character.
// Changed the tree in index.html? Paste the same lines here.
// ---- copied from index.html ----
const PAL = { merino:"#F1F0E9", card:"#F8F7F2", juniper:"#2F4A3E", moss:"#778E69", sage:"#BCC399", rifle:"#43442B", taupe:"#5E5A50", onyx:"#151513", line:"#DCD6C6" };
const LEAF = "M0 0 C2.6 -3.6 7.4 -3.6 10 0 C7.4 3.6 2.6 3.6 0 0Z";
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// rich: the hero version, one more level of branches, more hanging roots, roots spreading along the ground.
// The plain version (logo, story card) is unchanged: rich-only randomness is only drawn inside rich-only branches.
function banyan({ rich = false } = {}){
  const r = rng(11), ground = 98, fx = 60, fy = 66, rad = d => d * Math.PI / 180, jit = n => (r() * 2 - 1) * n, f = n => n.toFixed(1);
  const roots = [], wood = [], leaves = [], ends = [], D = rich ? 1 : 0;
  function branch(x, y, ang, len, w, depth, outer, lv = 1){
    if (rich) ang = Math.max(-186, Math.min(6, ang));   // extra level: keep tips from curling under the canopy
    const ex = x + Math.cos(rad(ang)) * len, ey = y + Math.sin(rad(ang)) * len;
    const bend = (ang < -90 ? -1 : 1) * len * 0.12;
    const cx = (x + ex) / 2 + Math.cos(rad(ang + 90)) * bend, cy = (y + ey) / 2 + Math.sin(rad(ang + 90)) * bend;
    wood.push({ d: `M${f(x)} ${f(y)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`, stroke: PAL.rifle, w: +w.toFixed(2), kind: "wood", lv });
    if (depth >= 1 && (outer || (rich && r() < 0.45))) {   // aerial roots: the banyan's signature, dropping to the ground
      (outer ? [0.45, 0.9] : [0.35 + r() * 0.5]).forEach(t => {
        const px = (1-t)*(1-t)*x + 2*(1-t)*t*cx + t*t*ex, py = (1-t)*(1-t)*y + 2*(1-t)*t*cy + t*t*ey;
        roots.push({ d: `M${f(px)} ${f(py)} L${f(px + jit(0.6))} ${ground}`, stroke: PAL.rifle, w: +((rich ? 0.9 : 1.2) + depth * 0.35).toFixed(2), op: 0.8, kind: "root" });
      });
    }
    if (depth === 0) { ends.push([ex, ey]); return; }
    const spread = 22 + jit(6);
    branch(ex, ey, ang - spread, len * 0.66, w * 0.64, depth - 1, false, lv + 1);
    branch(ex, ey, ang + spread, len * 0.66, w * 0.64, depth - 1, false, lv + 1);
    if (depth === 2 + D) branch(ex, ey, ang + jit(6), len * 0.55, w * 0.55, depth - 1, false, lv + 1);
  }
  wood.push({ d: `M49 ${ground} C53 88 55 76 56 ${fy} L64 ${fy} C65 76 67 88 71 ${ground} Z`, fill: PAL.rifle, kind: "trunk" });
  wood.push({ d: `M49 ${ground} q-7 -1 -12 1 M71 ${ground} q7 -1 12 1`, stroke: PAL.rifle, w: 3, kind: "flare" });
  branch(fx - 2, fy + 1, -168 + jit(3), 30, 6.2, 2 + D, true);
  branch(fx - 1, fy,     -124 + jit(4), 24, 5.6, 2 + D, false);
  branch(fx + 1, fy,      -56 + jit(4), 24, 5.6, 2 + D, false);
  branch(fx + 2, fy + 1,  -12 + jit(3), 30, 6.2, 2 + D, true);
  branch(fx,     fy - 2,  -90 + jit(3), 20, 5.2, 1 + D, false);
  const tones = [PAL.juniper, PAL.juniper, PAL.moss, PAL.moss, PAL.sage];
  ends.forEach(([x, y]) => {
    for (let k = 0; k < (rich ? 4 : 5); k++) {
      const a = r() * Math.PI * 2, d = r() * 7;
      leaves.push({ d: LEAF, fill: tones[Math.floor(r() * tones.length)], kind: "leaf",
        t: [+(x + Math.cos(a) * d).toFixed(1), +(y + Math.sin(a) * d * 0.75 - 1.5).toFixed(1), +(r() * 360).toFixed(0), +(0.8 + r() * 0.45).toFixed(2)] });
    }
  });
  const xs = ends.map(p => p[0]), ys = ends.map(p => p[1]);
  const box = { minX: Math.min(...xs, 37) - 12, maxX: Math.max(...xs, 83) + 12, minY: Math.min(...ys) - 12, maxY: ground + 3 };
  if (!rich) {
    const groundLine = { d: `M${f(box.minX + 4)} ${ground} H${f(box.maxX - 4)}`, stroke: PAL.rifle, w: 1.6, op: 0.4, kind: "ground" };
    return { prims: [...roots, ...wood, ...leaves, groundLine], box };
  }
  // rich: ground and surface roots grow outward from the trunk, so they're drawn from the middle out
  const mid = (box.minX + box.maxX) / 2, half = (box.maxX - box.minX) / 2 - 5, under = [];
  [-1, 1].forEach(s => {
    under.push({ d: `M${f(mid)} ${ground} H${f(mid + s * half)}`, stroke: PAL.rifle, w: 1.2, op: 0.35, kind: "ground" });
    [[0.95, 1.1], [0.62, 1.7], [0.36, 2.6]].forEach(([k, w]) => {
      const x0 = s < 0 ? 51 : 69, x1 = mid + s * half * k;
      under.push({ d: `M${x0} ${ground - 0.6} Q${f((x0 + x1) / 2)} ${f(ground + 1.6 - k)} ${f(x1)} ${f(ground + 0.5)}`, stroke: PAL.rifle, w, op: 0.5, kind: "surface", k });
    });
  });
  return { prims: [...under, ...roots, ...wood, ...leaves], box };
}
const TREE = banyan(), HERO = banyan({ rich: true });
// the frame each version draws into: plain (logo) or ring (badge, branch tips meeting the circle)
function frame(ring, tree = TREE){
  const b = tree.box, w = b.maxX - b.minX, h = b.maxY - b.minY;
  if (!ring) return { x: b.minX, y: b.minY, w, h };
  const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2 - 4, R = Math.max(w, h) / 2 + 3;
  return { x: cx - R - 3, y: cy - R - 3, w: 2 * R + 6, h: 2 * R + 6, cx, cy, R };
}
// grow: when each part starts and how long it takes (seconds). Roots spread, trunk rises, branches, leaves, then hanging roots drop.
function growTiming(p, v){
  const cx = v.x + v.w / 2, top = v.y;
  switch (p.kind) {
    case "ground":  return ["g-s", 0,    1.1];
    case "surface": return ["g-s", 0.15, 0.7 + p.k * 0.8];
    case "flare":   return ["g-s", 0.3,  0.5];
    case "trunk":   return ["g-rise", 0.35, 0.8];
    case "wood":    return ["g-s", 0.75 + (p.lv - 1) * 0.28, 0.42];
    case "leaf":    return ["g-pop", 1.7 + Math.hypot(p.t[0] - cx, p.t[1] - top) * 0.008 + (p.t[2] % 7) * 0.02, 0.5];
    case "root":    { const x = +p.d.split(" ")[0].slice(1); return ["g-s g-drop", 2.25 + Math.abs(x - cx) * 0.007, 0.9]; }
  }
  return ["", 0, 0];
}
function treeSVG({ ring = false, cls = "", tree = TREE, grow = false } = {}){
  const v = frame(ring, tree), n = s => +s.toFixed(2);
  const body = tree.prims.map(p => {
    const [gc, gd, gt] = grow ? growTiming(p, v) : ["", 0, 0];
    const anim = gc ? ` class="${gc}" style="--d:${n(gd)}s;--t:${n(gt)}s"` + (gc.includes("g-s") ? ` pathLength="1"` : "") : "";
    const path = `<path d="${p.d}" fill="${p.fill || "none"}"` +
      (p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.w}" stroke-linecap="round"` : "") +
      (p.op ? ` stroke-opacity="${p.op}"` : "");
    const tf = p.t ? `translate(${p.t[0]} ${p.t[1]}) rotate(${p.t[2]}) scale(${p.t[3]})` : "";
    // leaves: the placement lives on a <g>, so the pop animation can scale the leaf itself
    if (tf && grow) return `<g transform="${tf}">${path}${anim}/></g>`;
    return path + (tf ? ` transform="${tf}"` : "") + anim + "/>";
  }).join("");
  const ringEl = ring ? `<circle cx="${v.cx.toFixed(1)}" cy="${v.cy.toFixed(1)}" r="${v.R.toFixed(1)}" fill="none" stroke="${PAL.moss}" stroke-width="3"/>` : "";
  return `<svg class="${cls}" viewBox="${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ringEl}${body}</svg>`;
}
