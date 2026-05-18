import { useEffect, useRef } from "react";

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let mouse = {
      x: -9999,
      y: -9999,
    };

    const spacing = 38;
    const dots = [];

    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        dots.push({
          x,
          y,
          ox: x,
          oy: y,
        });
      }
    }

const handleMouse = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 140;

        if (dist < radius) {
          const angle = Math.atan2(dy, dx);
          const force = (radius - dist) / radius;

          dot.x += Math.cos(angle) * force * 8;
          dot.y += Math.sin(angle) * force * 8;
        }

        dot.x += (dot.ox - dot.x) * 0.055;
        dot.y += (dot.oy - dot.y) * 0.055;

        ctx.beginPath();

        ctx.arc(dot.x, dot.y, 1.1, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(199, 168, 74, 0.78)";

        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resize);
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