import { useRef, useState, useEffect } from "react";

function CountUp({ to, duration = 1.5 }) {
  const [val, setVal]   = useState(0);
  const started         = useRef(false);
  const wrapRef         = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let t0 = null;
        const tick = ts => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / (duration * 1000), 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.2 });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={wrapRef}>{val}</span>;
}

export default CountUp;