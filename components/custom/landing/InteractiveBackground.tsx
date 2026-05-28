"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 40;
    const colors = ["rgba(99, 102, 241,", "rgba(168, 85, 247,", "rgba(16, 185, 129,"]; // indigo, purple, emerald

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.35 + 0.1,
      });
    }

    // Initialize mouse position
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const step = 64;

      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dark core background
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      // 2. Draw static tech grid
      drawGrid(ctx, width, height);

      // 3. Interpolate mouse position (spring effect)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 4. Cursor glow layer (glassmorphism/ambient backlight)
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        width > 768 ? 320 : 160
      );
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.09)"); // Indigo glow
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.04)"); // Purple glow
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, width > 768 ? 320 : 160, 0, Math.PI * 2);
      ctx.fill();

      // 5. Dynamic particles simulation
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles close to the mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 150) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
