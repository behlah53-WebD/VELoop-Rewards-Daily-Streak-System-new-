import { useEffect, useRef, useState } from 'react';

/**
 * useMouseTilt - Ultra-smooth 3D card tilt on desktop
 * Computes GPU-friendly transform: perspective(1000px) rotateX(...) rotateY(...)
 * Strictly disabled on touch devices and prefers-reduced-motion.
 */
export function useMouseTilt({ maxTilt = 7, perspective = 1000 } = {}) {
  const elementRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check device capability and accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !canHover) {
      return;
    }

    let bounds = el.getBoundingClientRect();

    const handleResize = () => {
      bounds = el.getBoundingClientRect();
    };

    const handleMouseMove = (e) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width) * 2 - 1; // -1 to 1
        const yPct = (mouseY / bounds.height) * 2 - 1; // -1 to 1

        const rotateX = -yPct * maxTilt;
        const rotateY = xPct * maxTilt;

        setStyle({
          transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`,
          transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
        });

        // Specular glare position following cursor
        const glareX = ((mouseX / bounds.width) * 100).toFixed(1);
        const glareY = ((mouseY / bounds.height) * 100).toFixed(1);

        setGlareStyle({
          opacity: 0.18,
          background: `radial-gradient(circle 280px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.5) 0%, transparent 80%)`,
          transition: 'opacity 200ms ease',
        });
      });
    };

    const handleMouseEnter = () => {
      bounds = el.getBoundingClientRect();
    };

    const handleMouseLeave = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`,
          transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        });
        setGlareStyle({
          opacity: 0,
          transition: 'opacity 400ms ease',
        });
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [maxTilt, perspective]);

  return { ref: elementRef, style, glareStyle };
}

export default useMouseTilt;
