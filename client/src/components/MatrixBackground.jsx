import { useEffect, useRef } from 'react';

const FONT_SIZE = 14;
const INTERVAL_MS = 80;
const FONT_STR = `${FONT_SIZE}px monospace`;

export default function MatrixBackground({ dark }) {
  const canvasRef = useRef(null);
  const darkRef = useRef(dark);

  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let intervalId;
    let drops = [];
    let columns = 0;
    let canvasHeight = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasHeight = canvas.height;
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => 1);
      ctx.font = FONT_STR;
    };

    init();
    window.addEventListener('resize', init);

    const draw = () => {
      const isDark = darkRef.current;

      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(180, 180, 180, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvasHeight);

      ctx.globalAlpha = 1;
      ctx.fillStyle = isDark ? '#09fa4d' : '#0f620c';

      for (let i = 0; i < columns; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        drops[i] += 1;
        if (drops[i] * FONT_SIZE > canvasHeight && Math.random() > 0.975) {
          drops[i] = Math.random() * -40;
        }
      }
    };

    intervalId = setInterval(draw, INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
