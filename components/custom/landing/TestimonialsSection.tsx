"use client";

import React from "react";

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        Testimonials
      </span>
      <h2 className="text-4xl font-extrabold font-heading text-slate-900 mt-2">
        What they say about us?
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm">
        Hear from professionals utilizing NeuralPress for conceptual story discovery and reading.
      </p>

      {/* 4 Testimonial visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16 text-left select-none">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <p className="text-xs text-slate-500 font-normal italic leading-relaxed">
            &ldquo;The bilingual translation into high-quality Sinhala is seamlessly accurate. I can read
            worldwide stories instantly.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              KD
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Kalum Dias</h4>
              <span className="text-[10px] text-slate-400">Content Analyst</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <p className="text-xs text-slate-500 font-normal italic leading-relaxed">
            &ldquo;Searching news by conceptual subject instead of exact words makes my information discovery
            twice as fast!&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              AP
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Amani Perera</h4>
              <span className="text-[10px] text-slate-400">Researcher</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <p className="text-xs text-slate-500 font-normal italic leading-relaxed">
            &ldquo;Consensus clustering keeps duplicate stories fully hidden while preserving unique angles.
            Simple, clean, and amazing.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              MF
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Malik Fernando</h4>
              <span className="text-[10px] text-slate-400">Journalist</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <p className="text-xs text-slate-500 font-normal italic leading-relaxed">
            &ldquo;An incredibly modern, fast discovery UI. Viewport scrolling and console updates run
            beautifully in real-time.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              SR
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Sahan Raj</h4>
              <span className="text-[10px] text-slate-400">Software Developer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
