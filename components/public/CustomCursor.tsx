'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animId: number;

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      cursor!.style.left = mx + 'px';
      cursor!.style.top = my + 'px';
    }

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring!.style.left = rx + 'px';
      ring!.style.top = ry + 'px';
      animId = requestAnimationFrame(animateRing);
    }

    function onEnter() {
      cursor!.classList.add('grow');
      ring!.classList.add('grow');
    }
    function onLeave() {
      cursor!.classList.remove('grow');
      ring!.classList.remove('grow');
    }

    document.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animateRing);

    // Attach hover listeners to interactive elements
    function attachHoverListeners() {
      document.querySelectorAll('a,button,.v-card,.team-card').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    }

    // Initial attach + re-attach on DOM changes
    attachHoverListeners();
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
