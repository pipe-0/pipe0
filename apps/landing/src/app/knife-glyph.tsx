"use client";

import { useEffect, useRef } from "react";
import { buddy, crab, dot, paintPose, spark, type Pose } from "./agent-glyph";

/**
 * The first, code-drawn version of the hero's Swiss Army knife, kept for
 * reference; the page uses the Blender loop in app/knife-loop.tsx.
 *
 * Its tools are agents: the same four characters as app/agent-glyph.tsx (a
 * pixel crab, a sparkle, a thinking dot, our own clay buddy). The loop opens
 * on the whole knife fanned out, folds it shut, then flips each agent out on
 * its own to say hello and get to work, and ends by fanning them all out
 * again. The still frame (reduced motion) is the fan.
 *
 * Drawn on a canvas from code, in a 100×100 box. Tools hinge on two rivets
 * in the handle; a closed tool lies along the handle, behind it, and its
 * agent shrinks to nothing, so the shut knife is just the handle.
 */

type Character = (t: number, clock: number) => Pose;

type Tool = {
  who: Character;
  /** Rivet the tool turns on. */
  pivot: [number, number];
  /** Pointing along the handle, toward the other rivet. */
  closed: number;
  /** Angle on its own, and in the fan, in degrees (y points down). */
  solo: number;
  fan: number;
  /** Rivet to the agent's middle. */
  length: number;
};

const LEFT: [number, number] = [21, 77];
const RIGHT: [number, number] = [79, 77];

// Left-hand tools open counter-clockwise from 0°, right-hand ones clockwise
// from 180°, so both sides swing up and out like a real knife's.
const TOOLS: Tool[] = [
  { who: crab, pivot: LEFT, closed: 0, solo: -58, fan: -70, length: 45 },
  { who: spark, pivot: RIGHT, closed: 180, solo: 238, fan: 250, length: 45 },
  { who: dot, pivot: LEFT, closed: 0, solo: -58, fan: -104, length: 42 },
  { who: buddy, pivot: RIGHT, closed: 180, solo: 238, fan: 282, length: 42 },
];

// Character box units per knife unit: big enough alone to read the face,
// small enough in the fan for four to sit side by side.
const SOLO_SCALE = 0.5;
const FAN_SCALE = 0.28;

// ---------- timing (seconds) ----------

const FAN_OPEN = 0.9; // the four flip out one after another
const FAN_HOLD = 2.2;
const FAN_CLOSE = 0.45;
const SOLO = 3.6; // each agent on its own
const SWING = 0.42; // one tool opening or closing
const LOOP = FAN_OPEN + FAN_HOLD + FAN_CLOSE + SOLO * TOOLS.length;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutBack = (x: number) => {
  const c = 1.7;
  const t = clamp01(x) - 1;
  return 1 + (c + 1) * t ** 3 + c * t ** 2;
};
const rad = (deg: number) => (deg * Math.PI) / 180;

type ToolState = {
  /** 0 shut, 1 open (overshoots past 1 as it snaps). */
  open: number;
  /** 0 = fan pose, 1 = solo pose. */
  solo: number;
  /** Local time handed to the character. */
  t: number;
};

/** Where every tool is at time `clock` into the loop. */
function stateAt(clock: number): { tools: ToolState[]; kick: number } {
  const t = ((clock % LOOP) + LOOP) % LOOP;
  let kick = 0; // the handle's recoil as a tool snaps open
  const snap = (since: number) => {
    if (since > 0 && since < 0.3) kick = Math.max(kick, Math.sin((Math.PI * since) / 0.3));
  };

  const tools = TOOLS.map((_, i): ToolState => {
    // Fan: staggered open, hold, all shut together.
    const stagger = i * ((FAN_OPEN - SWING) / (TOOLS.length - 1));
    if (t < FAN_OPEN + FAN_HOLD + FAN_CLOSE) {
      const opening = (t - stagger) / SWING;
      const closing = (t - FAN_OPEN - FAN_HOLD) / FAN_CLOSE;
      if (opening > 0 && opening < 1) snap(t - stagger - SWING * 0.55);
      const open = closing > 0 ? 1 - smooth(closing) : easeOutBack(opening);
      // Characters wave in turn while the fan holds.
      return { open, solo: 0, t: 0.55 + (t - stagger) * 0.62 };
    }
    // Solos, in tool order.
    const s = t - FAN_OPEN - FAN_HOLD - FAN_CLOSE;
    const local = s - i * SOLO;
    if (local < 0 || local > SOLO) return { open: 0, solo: 1, t: 0 };
    if (local < SWING) snap(local - SWING * 0.55);
    const open =
      local < SWING
        ? easeOutBack(local / SWING)
        : 1 - smooth((local - (SOLO - SWING)) / SWING);
    return { open, solo: 1, t: 0.35 + local };
  });
  return { tools, kick };
}

// ---------- drawing ----------

const STEEL_LIGHT = "#eef0f6";
const STEEL_DARK = "#9aa1b8";
const STEEL_EDGE = "#7a8199";

function stem(ctx: CanvasRenderingContext2D, len: number) {
  // A flat tool blade seen edge-on, drawn along +x from the rivet.
  const w = 5.2;
  const g = ctx.createLinearGradient(0, -w / 2, 0, w / 2);
  g.addColorStop(0, STEEL_LIGHT);
  g.addColorStop(1, STEEL_DARK);
  ctx.fillStyle = g;
  ctx.strokeStyle = STEEL_EDGE;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -w / 2, len + w / 2, w, w / 2);
  ctx.fill();
  ctx.stroke();
}

function handle(ctx: CanvasRenderingContext2D) {
  const x0 = 9;
  const x1 = 91;
  const y0 = 68;
  const h = 18;

  // The steel layers between the scales, peeking out along the top.
  ctx.fillStyle = STEEL_DARK;
  ctx.beginPath();
  ctx.roundRect(x0 + 5, y0 - 1.8, x1 - x0 - 10, 4, 2);
  ctx.fill();

  const g = ctx.createLinearGradient(0, y0, 0, y0 + h);
  g.addColorStop(0, "#7a83ff");
  g.addColorStop(0.55, "#4553ea");
  g.addColorStop(1, "#3440d6");
  ctx.fillStyle = g;
  ctx.strokeStyle = "#2a33b0";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.roundRect(x0, y0, x1 - x0, h, h / 2);
  ctx.fill();
  ctx.stroke();

  // Gloss along the top edge, as on the site's buttons.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 1.1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x0 + 8, y0 + 2.3);
  ctx.lineTo(x1 - 8, y0 + 2.3);
  ctx.stroke();

  // The plus, white on the scale.
  const cx = 50;
  const cy = y0 + h / 2 + 0.3;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(cx - 5.6, cy - 1.7, 11.2, 3.4, 1);
  ctx.roundRect(cx - 1.7, cy - 5.6, 3.4, 11.2, 1);
  ctx.fill();

  // Rivets.
  for (const [x, y] of [LEFT, RIGHT]) {
    ctx.fillStyle = "#c8cdfb";
    ctx.strokeStyle = "#2a33b0";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function draw(ctx: CanvasRenderingContext2D, clock: number, scale: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const { tools, kick } = stateAt(clock);

  // The whole knife dips a hair as a tool clicks open.
  ctx.save();
  ctx.translate(50, 77);
  ctx.rotate(rad(-1.2 * kick));
  ctx.translate(-50, -77 + 1.1 * kick);

  // Tools behind the handle, so a shut tool is hidden by it. Closed ones
  // first, so an opening tool never passes behind a resting one.
  const order = tools
    .map((s, i) => ({ s, tool: TOOLS[i] }))
    .filter(({ s }) => s.open > 0.001)
    .sort((a, b) => a.s.open - b.s.open);

  for (const { s, tool } of order) {
    const target = lerp(tool.fan, tool.solo, s.solo);
    const angle = rad(lerp(tool.closed, target, s.open));
    const [px, py] = tool.pivot;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    stem(ctx, tool.length - 4);
    ctx.restore();

    // The agent rides the tip, upright, leaning a little with the tool.
    const k = lerp(FAN_SCALE, SOLO_SCALE, s.solo) * clamp01((s.open - 0.3) / 0.7) ** 0.8;
    if (k < 0.01) continue;
    const tx = px + Math.cos(angle) * tool.length;
    const ty = py + Math.sin(angle) * tool.length;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((angle + Math.PI / 2) * 0.18);
    ctx.scale(k, k);
    ctx.translate(-50, -60);
    paintPose(ctx, tool.who(s.t, clock));
    ctx.restore();
  }

  handle(ctx);
  ctx.restore();
}

export function KnifeGlyph({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Starts with the fan already open: the first thing anyone sees is a
    // whole Swiss Army knife.
    const OPENED = FAN_OPEN + 0.2;
    let clock = OPENED;
    let scale = 1;
    let raf = 0;
    let last = 0;
    let inView = true;

    const render = () => draw(ctx, still ? OPENED + 0.6 : clock, scale);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      scale = canvas.width / 100;
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

  return (
    <span
      aria-hidden
      className={`relative -my-[0.06em] inline-block size-[1.12em] ${className ?? ""}`}
    >
      <canvas ref={ref} className="pointer-events-none absolute inset-0 size-full" />
    </span>
  );
}
