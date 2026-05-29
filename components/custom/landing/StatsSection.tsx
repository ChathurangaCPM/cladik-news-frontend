"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function StatsSection() {
  const cards = [
    {
      stat: "120+",
      title: "Publications",
      subtitle: "Parsed in real-time",
      badge: "+15 active",
      desc: "Active international sources scanned.",
      tags: ["Global", "Direct Index", "Scrape Engine"],
    },
    {
      stat: "99.5%",
      title: "Consensus",
      subtitle: "Overlap duplicate filters",
      badge: "Verified",
      desc: "Deduplication and conflict ratio.",
      tags: ["Deduplication", "Semantic Map", "Fact-Checked"],
    },
    {
      stat: "520k+",
      title: "Daily Check",
      subtitle: "Continuous search scanner",
      badge: "Active",
      desc: "Daily indexed and parsed stories.",
      tags: ["Continuous", "Active Scan", "Swarm Nodes"],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        About Us
      </span>
      <h2 className="text-3xl md:text-5xl tracking-[-3px] mt-3 text-slate-900 leading-tight">
        Empowering global news parsing
        <br />
        with a highly advanced{" "}
        <span className="inline-flex font-heading items-center gap-1 text-[#2b86ff] italic font-extralight tracking-normal">
          Consensus engine
        </span>
        <br />
        and{" "}
        <span className="inline-flex font-heading items-center gap-1 text-lime-600 italic font-extralight tracking-normal">
          Bilingual translation
        </span>{" "}
        pipeline.
      </h2>

      {/* Modern, High-Fidelity Bento Grid matching NeuralPress brand theme colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-left">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: idx * 0.1,
            }}
            className="bg-[#f0ffec]/40 border border-[#d5edcc]/60 rounded-[2.5rem] p-6 transition-all duration-500 flex flex-col justify-between min-h-[380px] cursor-pointer relative overflow-hidden group"
          >
            {/* Top portion: ice-blue / sky-cream header capsule matching theme */}
            <div className="bg-[#89d171]/10 rounded-[1.75rem] p-5 text-[#0f172a] border border-white/5 transition-transform duration-500 group-hover:scale-[1.01]">
              <h3 className="text-xl tracking-tighter leading-tight font-normal">
                {card.title}
              </h3>
              <p className="text-xs text-[#475569] mt-1 font-light">
                {card.subtitle}
              </p>
            </div>

            {/* Middle portion: Glowing High-Tech Cyan Statistic & Badge */}
            <div className="mt-8 px-2 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black font-heading tracking-tighter transition-colors duration-300">
                  {card.stat}
                </span>
                <span className="bg-[#e0eafc] text-[#0f172a] text-[10px] font-bold py-1 px-2.5 rounded-full font-mono shadow-sm">
                  {card.badge}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-light mt-3 ">
                {card.desc}
              </p>
            </div>

            {/* Bottom portion: Slate / deep navy pills list matching theme */}
            <div className="mt-8 flex flex-wrap gap-2 px-1 justify-center">
              {card.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="bg-[#2b86ff]/10 border border-white/5 rounded-full py-1.5 px-3.5 text-[10px] text-[#2b86ff] font-semibold tracking-wide hover:bg-[#334155]/50 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom capsule pill layout directly matching Aeline premium bar design */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-5xl mx-auto mt-8 bg-[#0a0f1d] border border-[#1e2942] rounded-[2rem] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-950/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px)] bg-[size:40px] pointer-events-none" />

        <span className="text-xs uppercase tracking-wider font-mono text-slate-400 flex items-center gap-2 relative z-10">
          <CheckCircle2 className="w-4 h-4 text-[#00e5ff] animate-pulse" /> VETTED GLOBALLY
        </span>
        <div className="flex gap-6 text-xs text-slate-300 relative z-10 font-mono">
          <span>20+ Countries tracked</span>
          <span className="text-slate-700 font-bold">•</span>
          <span>100% Factually Consistent</span>
        </div>
      </motion.div> */}
    </section>
  );
}
