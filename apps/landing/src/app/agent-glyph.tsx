"use client";

import { useEffect, useRef } from "react";

/**
 * The little agent that sits inside the hero headline, one em tall.
 *
 * It cycles through the shapes agents tend to take on screen (our own clay
 * buddy, a pixel crab, a thinking dot, a sparkle) to say pipe0 works with
 * whichever one you use. Each character greets, blinks, gets to work, then
 * melts into a round blob and pops out as the next one.
 *
 * Everything is drawn on a canvas from code: every body is a closed outline
 * resampled to the same number of points, so any character can morph into
 * any other by moving points. Faces are drawn on top so they can blink,
 * squint and smile. Units are a 100×100 box per em; feet stand on y = 92.
 */

type Pt = [number, number];
type Poly = Pt[];
type RGB = [number, number, number];

type Eye = { x: number; y: number; w: number; h: number; happy: number };

export type Pose = {
  // Always three outlines, filled as one union. Characters with one body
  // park the spares as specks inside it.
  shapes: [Poly, Poly, Poly];
  top: RGB;
  bottom: RGB;
  eyes: [Eye, Eye];
  ink: RGB;
  face: number;
  smile: number;
  mouthY: number;
  sharp: boolean;
  // About the ground point (50, 92).
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  rot: number;
};

const POINTS = 240;
const SEG = 4.2; // seconds per character
const MORPH = 0.75; // opening seconds of each segment spent morphing in
const GROUND: Pt = [50, 92];
const PAD = 25; // canvas overhang per side, in units, for hops and waves

// ---------- geometry ----------

function resample(src: Pt[], n = POINTS): Poly {
  const m = src.length;
  const cum = new Float64Array(m + 1);
  for (let i = 0; i < m; i++) {
    const [ax, ay] = src[i];
    const [bx, by] = src[(i + 1) % m];
    cum[i + 1] = cum[i] + Math.hypot(bx - ax, by - ay);
  }
  const total = cum[m];
  const out: Poly = new Array(n);
  let j = 0;
  for (let k = 0; k < n; k++) {
    const d = (k / n) * total;
    while (j < m - 1 && cum[j + 1] < d) j++;
    const t = (d - cum[j]) / (cum[j + 1] - cum[j] || 1);
    const [ax, ay] = src[j];
    const [bx, by] = src[(j + 1) % m];
    out[k] = [ax + (bx - ax) * t, ay + (by - ay) * t];
  }
  return out;
}

// Every outline starts at its top centre and runs clockwise, so point k of
// one character lines up with point k of the next.
function circle(cx: number, cy: number, r: number): Poly {
  const pts: Pt[] = [];
  for (let i = 0; i < 96; i++) {
    const a = -Math.PI / 2 + (i / 96) * Math.PI * 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return resample(pts);
}

function squircle(
  cx: number,
  cy: number,
  a: number,
  b: number,
  n: number,
  flare: number,
): Poly {
  const pts: Pt[] = [];
  const e = 2 / n;
  for (let i = 0; i < 160; i++) {
    const t = -Math.PI / 2 + (i / 160) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const y = b * Math.sign(s) * Math.abs(s) ** e;
    const x = a * Math.sign(c) * Math.abs(c) ** e * (1 + flare * (y / b));
    pts.push([cx + x, cy + y]);
  }
  return resample(pts);
}

function sparkle(cx: number, cy: number, r: number, rot: number): Poly {
  // The star repeats every quarter turn; start from the tip nearest the top
  // so a turned star still lines up with the next character.
  const q = Math.PI / 2;
  rot -= Math.round(rot / q) * q;
  const pts: Pt[] = [];
  const belly = 0.28; // how far the sides bow out between the tips
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + rot + (i * Math.PI) / 2;
    const b = a + Math.PI / 2;
    const m = a + Math.PI / 4;
    const p0: Pt = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const p1: Pt = [cx + r * Math.cos(b), cy + r * Math.sin(b)];
    const c: Pt = [cx + belly * r * Math.cos(m), cy + belly * r * Math.sin(m)];
    for (let s = 0; s < 32; s++) {
      const t = s / 32;
      const u = 1 - t;
      pts.push([
        u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
        u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
      ]);
    }
  }
  return resample(pts);
}

function lerpPoly(a: Poly, b: Poly, t: number): Poly {
  const out: Poly = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = [a[i][0] + (b[i][0] - a[i][0]) * t, a[i][1] + (b[i][1] - a[i][1]) * t];
  }
  return out;
}

const speck = (x: number, y: number) => circle(x, y, 0.01);

// ---------- timing ----------

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
// Rises over [a, b], holds, falls over [c, d].
const env = (t: number, a: number, b: number, c: number, d: number) =>
  smooth((t - a) / (b - a)) * (1 - smooth((t - c) / (d - c)));
const bump = (t: number, a: number, d: number) =>
  t > a && t < a + d ? Math.sin((Math.PI * (t - a)) / d) : 0;
const easeOutBack = (x: number) => {
  const c = 1.3;
  return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2;
};

// One beat for every character: greet, blink, work, rest.
const greetOf = (t: number) => env(t, 0.8, 1.0, 1.85, 2.05);
const focusOf = (t: number) => env(t, 2.3, 2.5, 3.75, 3.95);
const openOf = (t: number) => 1 - bump(t, 2.1, 0.16) - bump(t, 3.3, 0.14);

// A hop with squash before take-off and after landing. `s` > 0 stretches.
function hop(t: number, t0: number, dur: number, h: number) {
  let dy = 0;
  let s = 0;
  const pre = 0.11;
  const post = 0.15;
  if (t > t0 - pre && t < t0) {
    s = -0.1 * Math.sin((Math.PI * (t - t0 + pre)) / pre);
  } else if (t >= t0 && t <= t0 + dur) {
    const p = (t - t0) / dur;
    dy = -h * Math.sin(Math.PI * p);
    s = 0.14 * Math.sin(Math.PI * p) * Math.abs(Math.cos(Math.PI * p));
  } else if (t > t0 + dur && t < t0 + dur + post) {
    s = -0.12 * Math.sin((Math.PI * (t - t0 - dur)) / post);
  }
  return { dy, s };
}

function body(dy: number, s: number, rot: number, clock: number) {
  const breath = 0.012 * Math.sin(clock * 2.4);
  return {
    dx: 0,
    dy,
    sx: 1 - 0.8 * s - breath * 0.6,
    sy: 1 + s + breath,
    rot,
  };
}

// ---------- characters ----------

const WHITE: RGB = [255, 255, 255];

// pipe0's own buddy: an indigo clay blob that waves a little nub, then reads.
export function buddy(t: number, clock: number): Pose {
  const g = greetOf(t);
  const f = focusOf(t);
  const open = openOf(t);
  const h1 = hop(t, 0.86, 0.3, 9);
  const h2 = hop(t, 1.28, 0.24, 4.5);
  const wave = -0.95 + 0.5 * Math.sin((t - 0.8) * 15);
  const arm = 13 * g;
  const read = f * 3.2 * Math.sin((t - 2.45) * 5.2);
  const eye = (x: number): Eye => ({
    x: x + read,
    y: 51 + f * 1,
    w: 6.6,
    h: 10.5 * open * (1 - 0.42 * f),
    happy: g,
  });
  return {
    shapes: [
      squircle(50, 57, 35, 35, 3.1, 0.07),
      circle(79 + arm * Math.cos(wave), 56 + arm * Math.sin(wave), 0.01 + 7 * g),
      speck(50, 60),
    ],
    top: [118, 126, 255],
    bottom: [52, 63, 229],
    eyes: [eye(40), eye(60)],
    ink: WHITE,
    face: 1,
    smile: g,
    mouthY: 62,
    sharp: false,
    ...body(h1.dy + h2.dy, h1.s + h2.s, f * 0.05, clock),
  };
}

// A pixel crab: square body, nub arms, four legs. Waves an arm, then squints
// at the screen and taps its feet.
export function crab(t: number, clock: number): Pose {
  const g = greetOf(t);
  const f = focusOf(t);
  const open = openOf(t);
  const h = hop(t, 0.86, 0.26, 6);
  const lift = Math.min(14, g * (10 + 4 * Math.sin((t - 0.8) * 16)));
  const leg = (i: number) =>
    92 - f * 3.2 * Math.max(0, Math.sin(t * 17 + (i * Math.PI) / 2));
  const [l0, l1, l2, l3] = [leg(0), leg(2), leg(1), leg(3)];
  const ar0 = 44 - lift;
  const ar1 = 56 - lift;
  const outline: Pt[] = [
    [50, 30], [84, 30], [84, ar0], [96, ar0], [96, ar1], [84, ar1],
    [84, 72], [78, 72], [78, l3], [71, l3], [71, 72], [65, 72],
    [65, l2], [58, l2], [58, 72], [42, 72], [42, l1], [35, l1],
    [35, 72], [29, 72], [29, l0], [22, l0], [22, 72], [16, 72],
    [16, 56], [4, 56], [4, 44], [16, 44], [16, 30],
  ];
  const eye = (x: number): Eye => ({
    x: x + 3 * f,
    y: 46.5 + 1.5 * f,
    w: 6 + 2 * f,
    h: 13 * open * (1 - 0.62 * f),
    happy: g,
  });
  return {
    shapes: [resample(outline), speck(50, 50), speck(50, 52)],
    top: [217, 119, 87],
    bottom: [217, 119, 87],
    eyes: [eye(34), eye(66)],
    ink: [26, 22, 20],
    face: 1,
    smile: 0,
    mouthY: 60,
    sharp: true,
    ...body(h.dy, h.s, 0, clock),
  };
}

// A thinking dot: bounces hello, then splits into three typing dots.
export function dot(t: number, clock: number): Pose {
  const g = greetOf(t);
  const f = focusOf(t);
  const open = openOf(t);
  const h1 = hop(t, 0.86, 0.26, 8);
  const h2 = hop(t, 1.24, 0.26, 8);
  const split = smooth(f * 1.15);
  const side = smooth((f - 0.12) / 0.88);
  const ty = (i: number) => 81 - 7 * Math.max(0, Math.sin(t * 9.5 - i * 1.1));
  const face = circle(50, 62, 30);
  const eye = (x: number): Eye => ({
    x,
    y: 58,
    w: 6.4,
    h: 10.5 * open,
    happy: g,
  });
  return {
    shapes: [
      lerpPoly(face, circle(50, ty(1), 8.5), split),
      lerpPoly(speck(48, 62), circle(26, ty(0), 8.5), side),
      lerpPoly(speck(52, 62), circle(74, ty(2), 8.5), side),
    ],
    top: [40, 40, 46],
    bottom: [8, 8, 10],
    eyes: [eye(41.5), eye(58.5)],
    ink: WHITE,
    face: 1 - clamp01(f * 2.2),
    smile: g,
    mouthY: 69,
    sharp: false,
    ...body(h1.dy + h2.dy, h1.s + h2.s, 0, clock),
  };
}

// A sparkle: twinkles hello, twirls a quarter turn, then two small sparkles
// pop up beside it and it looks at them.
export function spark(t: number, clock: number): Pose {
  const g = greetOf(t);
  const f = focusOf(t);
  const open = openOf(t);
  const wiggle = g * 0.2 * Math.sin((t - 0.8) * 11);
  const turn = smooth((t - 2.35) / 0.55) * (Math.PI / 2);
  const swell = 1 + 0.05 * g * Math.sin((t - 0.8) * 22);
  const m1 = env(t, 2.75, 2.95, 3.4, 3.65);
  const m2 = env(t, 2.95, 3.15, 3.6, 3.85);
  const eye = (x: number): Eye => ({
    x: x + 1.6 * f,
    y: 55 - 1.8 * f,
    w: 4.8,
    h: 8.4 * open * (1 - 0.35 * f),
    happy: g,
  });
  return {
    shapes: [
      sparkle(50, 56, 36 * swell, wiggle + turn),
      sparkle(88, 25, 0.01 + 10 * m1, (t - 2.75) * 2.5),
      sparkle(14, 33, 0.01 + 7 * m2, (2.95 - t) * 2.5),
    ],
    top: [79, 142, 247],
    bottom: [168, 108, 230],
    eyes: [eye(44), eye(56)],
    ink: WHITE,
    face: 1,
    smile: g,
    mouthY: 61.5,
    sharp: false,
    ...body(0, 0, 0, clock),
  };
}

const CHARACTERS = [buddy, crab, dot, spark];

// ---------- morph ----------

const BLOB: Poly[] = [circle(50, 63, 27), speck(50, 63), speck(50, 64)];

// A melts into a round blob, then the blob pops out as B. Points nearer the
// top move first, so the change pours down the body instead of snapping.
function morph(a: Pose, b: Pose, u: number): Pose {
  const stagger = 0.3;
  const half = u < 0.5;
  const k = half ? u / 0.5 : (u - 0.5) / 0.5;
  const shapes = [0, 1, 2].map((s) => {
    const from = half ? a.shapes[s] : BLOB[s];
    const to = half ? BLOB[s] : b.shapes[s];
    const out: Poly = new Array(POINTS);
    for (let i = 0; i < POINTS; i++) {
      const fromTop = Math.min(i, POINTS - i) / (POINTS / 2);
      const local = clamp01((k - fromTop * stagger) / (1 - stagger));
      const e = half ? smooth(local) : easeOutBack(local);
      out[i] = [
        from[i][0] + (to[i][0] - from[i][0]) * e,
        from[i][1] + (to[i][1] - from[i][1]) * e,
      ];
    }
    return out;
  }) as Pose["shapes"];

  const c = smooth(u);
  const shut = Math.abs(1 - 2 * u) ** 0.7; // eyes close through the middle
  const eyes = [0, 1].map((i) => {
    const ea = a.eyes[i];
    const eb = b.eyes[i];
    return {
      x: lerp(ea.x, eb.x, c),
      y: lerp(ea.y, eb.y, c),
      w: lerp(ea.w, eb.w, c),
      h: lerp(ea.h, eb.h, c) * shut,
      happy: lerp(ea.happy, eb.happy, c),
    };
  }) as Pose["eyes"];

  const lift = Math.sin(Math.PI * u);
  return {
    shapes,
    top: lerpRGB(a.top, b.top, c),
    bottom: lerpRGB(a.bottom, b.bottom, c),
    eyes,
    ink: lerpRGB(a.ink, b.ink, c),
    face: lerp(a.face, b.face, c) * (shut > 0.15 ? 1 : shut / 0.15),
    smile: lerp(a.smile, b.smile, c) * shut,
    mouthY: lerp(a.mouthY, b.mouthY, c),
    sharp: half ? a.sharp : b.sharp,
    dx: lerp(a.dx, b.dx, c),
    dy: lerp(a.dy, b.dy, c) - 7 * lift,
    sx: lerp(a.sx, b.sx, c) * (1 - 0.06 * lift),
    sy: lerp(a.sy, b.sy, c) * (1 + 0.04 * lift),
    rot: lerp(a.rot, b.rot, c) + 0.12 * Math.sin(2 * Math.PI * u),
  };
}

function poseAt(clock: number): Pose {
  const loop = SEG * CHARACTERS.length;
  const t = ((clock % loop) + loop) % loop;
  const i = Math.floor(t / SEG);
  const local = t - i * SEG;
  const pose = CHARACTERS[i](local, clock);
  if (local >= MORPH) return pose;
  const prev = CHARACTERS[(i + CHARACTERS.length - 1) % CHARACTERS.length];
  return morph(prev(SEG + local, clock), pose, local / MORPH);
}

// ---------- drawing ----------

const rgb = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

function draw(ctx: CanvasRenderingContext2D, p: Pose, scale: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(scale, 0, 0, scale, PAD * scale, PAD * scale);
  paintPose(ctx, p);
}

/** Draws a pose in the current transform, in the character's 100×100 box.
 *  Shared with the knife glyph, whose tools are these same characters. */
export function paintPose(ctx: CanvasRenderingContext2D, p: Pose) {
  ctx.save();
  ctx.translate(GROUND[0] + p.dx, GROUND[1] + p.dy);
  ctx.rotate(p.rot);
  ctx.scale(p.sx, p.sy);
  ctx.translate(-GROUND[0], -GROUND[1]);

  const fill = ctx.createLinearGradient(0, 20, 0, 92);
  fill.addColorStop(0, rgb(p.top));
  fill.addColorStop(1, rgb(p.bottom));
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (const shape of p.shapes) {
    ctx.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) ctx.lineTo(shape[i][0], shape[i][1]);
    ctx.closePath();
  }
  ctx.fill();

  if (p.face <= 0.01) {
    ctx.restore();
    return;
  }
  const ink = rgb(p.ink);
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineCap = p.sharp ? "square" : "round";
  ctx.lineJoin = p.sharp ? "miter" : "round";
  for (const e of p.eyes) {
    const h = e.h * (1 - e.happy);
    if (h > 0.4) {
      ctx.globalAlpha = p.face;
      ctx.beginPath();
      ctx.roundRect(e.x - e.w / 2, e.y - h / 2, e.w, h, p.sharp ? 0 : Math.min(e.w, h) / 2);
      ctx.fill();
    }
    if (e.happy > 0.01) {
      // Happy eyes: a ^ in place of the open eye.
      ctx.globalAlpha = p.face * e.happy;
      ctx.lineWidth = e.w * 0.58;
      const x0 = e.x - e.w * 0.78;
      const x1 = e.x + e.w * 0.78;
      const y = e.y + 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      if (p.sharp) ctx.lineTo(e.x, y - e.w * 0.7);
      else ctx.quadraticCurveTo(e.x, y - e.w * 1.25, x1, y);
      if (p.sharp) ctx.lineTo(x1, y);
      ctx.stroke();
    }
  }
  if (p.smile > 0.01) {
    const mx = (p.eyes[0].x + p.eyes[1].x) / 2;
    ctx.globalAlpha = p.face * p.smile;
    ctx.lineWidth = 2.3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(mx - 4.2, p.mouthY);
    ctx.quadraticCurveTo(mx, p.mouthY + 4.6, mx + 4.2, p.mouthY);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function AgentGlyph({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Starts mid-way into the first segment so the buddy greets on arrival.
    let clock = MORPH;
    let scale = 1;
    let raf = 0;
    let last = 0;
    let inView = true;

    const render = () => draw(ctx, still ? buddy(SEG, 0) : poseAt(clock), scale);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      scale = canvas.width / (100 + PAD * 2);
      render();
    };
    const frame = (now: number) => {
      // Capped step: a background tab or a long frame resumes, not skips.
      clock += Math.min(0.05, (now - last) / 1000);
      last = now;
      render();
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (still || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    seen.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    fit();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // The span holds one em of the line; the canvas overhangs it by a quarter
  // em on each side so hops and waves are never clipped.
  return (
    <span
      aria-hidden
      className={`relative inline-block h-[1em] w-[1em] ${className ?? ""}`}
    >
      <canvas
        ref={ref}
        className="pointer-events-none absolute left-[-0.25em] top-[-0.25em] h-[1.5em] w-[1.5em]"
      />
    </span>
  );
}
