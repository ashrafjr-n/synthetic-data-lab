import { useEffect, useRef, useCallback } from "react";

/**
 * LogoTrail — Scatter Group Trail
 * ====================================
 * الاستخدام:
 *   const heroRef = useRef(null);
 *   <div ref={heroRef}> ... <LogoTrail logoSrc="/favicon.png" containerRef={heroRef} /> </div>
 *
 * Props:
 *   logoSrc      — مسار اللوغو
 *   containerRef — ref للـ Hero div (مهم عشان يشتغل بس فيه)
 *   groupSize    — عدد اللوغوهات في كل مجموعة (افتراضي: 5)
 *   maxDots      — أقصى عدد كلي (افتراضي: 40)
 *   dotLifetime  — عمر كل لوغو ms (افتراضي: 1400)
 *   baseSize     — أكبر حجم px (افتراضي: 32)
 *   minSize      — أصغر حجم px (افتراضي: 10)
 *   scatter      — مدى التشتت حول الماوس px (افتراضي: 38)
 *   maxOpacity   — أقصى شفافية 0-1 (افتراضي: 0.28)
 */

const STYLE = `
  .lt-dot {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform: translate(-50%, -50%);
    will-change: opacity, width, height;
    border-radius: 4px;
  }
`;

let styleInjected = false;
function injectStyle() {
  if (styleInjected) return;
  const tag = document.createElement("style");
  tag.textContent = STYLE;
  document.head.appendChild(tag);
  styleInjected = true;
}

export default function LogoTrail({
  logoSrc      = "/favicon.png",
  containerRef = null,
  groupSize    = 2,
  maxDots      = 18,
  dotLifetime  = 1400,
  baseSize     = 32,
  minSize      = 8,
  scatter      = 3,
  maxOpacity   = 0.78,
}) {
  const dotsRef    = useRef([]);
  const rafRef     = useRef(null);
  const lastPosRef = useRef(null);
  const MIN_DIST   = 18;

  // ── spawn مجموعة لوغوهات حول نقطة ──────────────
  const spawnGroup = useCallback((x, y) => {
    const container = containerRef?.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    for (let i = 0; i < groupSize; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = Math.random() * scatter;
      const ox     = Math.cos(angle) * radius;
      const oy     = Math.sin(angle) * radius;

      const posX = x - rect.left + ox;
      const posY = y - rect.top  + oy;

      const delay = i * 40;

      setTimeout(() => {
        const el = document.createElement("img");
        el.src = logoSrc;
        el.className = "lt-dot";
        const size = baseSize * (0.6 + Math.random() * 0.4);
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${posX}px;
          top: ${posY}px;
          opacity: 0;
        `;
        container.appendChild(el);

        const dot = { el, createdAt: performance.now(), size };
        dotsRef.current.push(dot);

        while (dotsRef.current.length > maxDots) {
          const old = dotsRef.current.shift();
          old.el.remove();
        }
      }, delay);
    }
  }, [containerRef, logoSrc, groupSize, scatter, baseSize, maxDots]);

  // ── حلقة الرسم ──────────────────────────────────
  const tick = useCallback(() => {
    const now = performance.now();

    dotsRef.current = dotsRef.current.filter(({ el, createdAt, size }) => {
      const age = now - createdAt;
      if (age >= dotLifetime) {
        el.remove();
        return false;
      }

      const progress = age / dotLifetime;

      // fade in سريع ثم fade out بطيء
      let opacity;
      if (progress < 0.15) {
        opacity = (progress / 0.15) * maxOpacity;
      } else {
        opacity = maxOpacity * (1 - (progress - 0.15) / 0.85);
      }

      const currentSize = size - (size - minSize) * progress * 0.5;

      el.style.opacity = Math.max(0, opacity);
      el.style.width   = `${currentSize}px`;
      el.style.height  = `${currentSize}px`;

      return true;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [dotLifetime, maxOpacity, minSize]);

  // ── mousemove ───────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (lastPosRef.current) {
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return;
    }

    lastPosRef.current = { x, y };
    spawnGroup(x, y);
  }, [spawnGroup]);

  const handleMouseLeave = useCallback(() => {
    lastPosRef.current = null;
  }, []);

  // ── Mount / Unmount ─────────────────────────────
  useEffect(() => {
    injectStyle();

    const container = containerRef?.current;
    if (!container) return;

    container.style.position = "relative";

    container.addEventListener("mousemove",  handleMouseMove,  { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove",  handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
      dotsRef.current.forEach(({ el }) => el.remove());
      dotsRef.current = [];
    };
  }, [handleMouseMove, handleMouseLeave, tick, containerRef]);

  return null;
}