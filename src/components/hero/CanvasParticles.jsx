import { useRef, useEffect } from "react";

function CanvasParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    let mouse = { x: -9999, y: -9999 };
    let rafId;

    /* Build sparse grid of gold dots */
    const spacing = 44;
    const dots = [];
    for (let x = spacing / 2; x < W; x += spacing) {
      for (let y = spacing / 2; y < H; y += spacing) {
        dots.push({ x, y, ox: x, oy: y });
      }
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    canvas.parentElement?.addEventListener("mousemove", onMouseMove);
    canvas.parentElement?.addEventListener("mouseleave", onMouseLeave);

    const RADIUS = 120;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      dots.forEach((dot) => {
        const dx   = dot.x - mouse.x;
        const dy   = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const force = (RADIUS - dist) / RADIUS;
          const angle = Math.atan2(dy, dx);
          dot.x += Math.cos(angle) * force * 6;
          dot.y += Math.sin(angle) * force * 6;
        }

        /* Spring back */
        dot.x += (dot.ox - dot.x) * 0.06;
        dot.y += (dot.oy - dot.y) * 0.06;

        /* Opacity based on distance from mouse */
        const d2      = Math.sqrt((dot.x - mouse.x) ** 2 + (dot.y - mouse.y) ** 2);
        const lit     = d2 < RADIUS * 1.5;
        const opacity = lit
          ? 0.18 + (1 - d2 / (RADIUS * 1.5)) * 0.55
          : 0.1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = lit
          ? `rgba(212,175,55,${opacity})`
          : `rgba(212, 175, 55, 0.18)`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.parentElement?.removeEventListener("mousemove", onMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default CanvasParticles;