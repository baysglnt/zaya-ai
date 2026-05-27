"use client";

import { useEffect, useRef } from "react";

export function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    const starCount = 150;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.7 + 0.1;

      star.className = "star";
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --duration: ${duration}s;
        --delay: ${delay}s;
        opacity: ${opacity};
      `;
      fragment.appendChild(star);
    }

    // Add shooting stars occasionally
    const createShootingStar = () => {
      const shooting = document.createElement("div");
      const startX = Math.random() * 80;
      const startY = Math.random() * 40;

      shooting.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: 100px;
        height: 1px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
        transform: rotate(${-30 + Math.random() * 60}deg);
        animation: shooting 0.8s ease-out forwards;
        pointer-events: none;
      `;
      container.appendChild(shooting);
      setTimeout(() => shooting.remove(), 900);
    };

    container.appendChild(fragment);

    // Shooting stars every 5-10 seconds
    const interval = setInterval(() => {
      createShootingStar();
    }, 5000 + Math.random() * 5000);

    // Add shooting star CSS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shooting {
        0% { opacity: 1; transform: translateX(0) rotate(-30deg); }
        100% { opacity: 0; transform: translateX(200px) translateY(100px) rotate(-30deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(interval);
      style.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="stars-container"
      aria-hidden="true"
    />
  );
}
