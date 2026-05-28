"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-8 transition-all duration-500 hover:border-indigo-500/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.06), transparent 80%)`,
          opacity
        }}
      />
      {children}
    </div>
  );
}
