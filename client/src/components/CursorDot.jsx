import { useEffect, useRef } from 'react';

export default function CursorDot() {
  const dotRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!dotRef.current) return;
      dotRef.current.style.left = `${e.clientX - 4}px`;
      dotRef.current.style.top = `${e.clientY - 4}px`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={dotRef}
      className="cursor-dot"
      style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}
