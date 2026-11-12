"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LEN = 4;
const CANVAS_W = 140;
const CANVAS_H = 48;
const FONT_FAMILY = "system-ui, sans-serif";

function randomCode(): string {
  let code = "";
  for (let i = 0; i < LEN; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, code: string) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#FFFBF7");
  gradient.addColorStop(0.5, "#FFFFFF");
  gradient.addColorStop(1, "#FFF3E8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(randomInt(0, w), randomInt(0, h));
    ctx.lineTo(randomInt(0, w), randomInt(0, h));
    ctx.strokeStyle = `rgba(${randomInt(120, 200)},${randomInt(120, 200)},${randomInt(120, 200)},0.4)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${randomInt(120, 180)},${randomInt(120, 180)},${randomInt(120, 180)},0.5)`;
    ctx.fillRect(randomInt(0, w), randomInt(0, h), randomInt(1, 2), randomInt(1, 2));
  }

  const charWidth = Math.floor(w / (LEN + 1));
  for (let i = 0; i < code.length; i++) {
    const x = charWidth * (i + 0.8) + randomInt(-4, 4);
    const y = h / 2 + randomInt(-6, 6);
    const size = randomInt(18, 24);
    const angle = (randomInt(-25, 25) * Math.PI) / 180;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px ${FONT_FAMILY}`;
    ctx.fillStyle = `rgb(${randomInt(30, 90)},${randomInt(30, 90)},${randomInt(30, 90)})`;
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }
}

export interface CaptchaRef {
  validate: () => boolean;
  reset: () => void;
  getPayload: () => { answer: string; token: string };
}

export const Captcha = forwardRef<CaptchaRef, { className?: string }>(function Captcha({ className }, ref) {
  const [code, setCode] = useState(() => randomCode());
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback((next: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);
    draw(ctx, CANVAS_W, CANVAS_H, next);
  }, []);

  useEffect(() => {
    redraw(code);
  }, [code, redraw]);

  const validate = useCallback(() => {
    const valid = input.toUpperCase() === code;
    if (!valid) {
      setError(true);
      setCode(randomCode());
      setInput("");
    }
    return valid;
  }, [input, code]);

  const reset = useCallback(() => {
    setCode(randomCode());
    setInput("");
    setError(false);
  }, []);

  const getPayload = useCallback(() => ({ answer: code, token: btoa(code) }), [code]);

  useImperativeHandle(ref, () => ({ validate, reset, getPayload }), [validate, reset, getPayload]);

  return (
    <div className={className}>
      <span className="mb-1.5 block text-caption font-semibold text-ink">验证码 *</span>
      <div className="rounded-lg border border-line bg-white p-3">
        <div className="flex flex-col gap-2.5 min-[390px]:flex-row min-[390px]:items-stretch">
          <div className="shrink-0 overflow-hidden rounded-md border border-line-soft bg-white">
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block" style={{ width: CANVAS_W, height: CANVAS_H }} />
          </div>
          <input
            type="text"
            required
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={event => {
              setInput(event.target.value);
              setError(false);
            }}
            placeholder="输入验证码"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 text-body font-medium uppercase tracking-[0.12em] text-ink-soft outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button type="button" onClick={reset} className="text-xs font-medium text-muted-light transition-colors hover:text-brand-700">
            刷新验证码
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-500">验证码错误,请按新验证码重新输入。</p>}
    </div>
  );
});
