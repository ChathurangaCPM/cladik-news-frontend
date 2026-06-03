"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Lock } from "lucide-react";

interface VectorNode {
  id: string;
  label: string;
  relevance: number;
  articleTitle: string;
  x: number;
  y: number;
  real: boolean;
}

interface VectorMapProjectionProps {
  vectorNodes: VectorNode[];
  selectedVectorNode: VectorNode | null;
  setSelectedVectorNode: (node: VectorNode | null) => void;
  activePlan: string;
}

export default function VectorMapProjection({
  vectorNodes,
  selectedVectorNode,
  setSelectedVectorNode,
  activePlan,
}: VectorMapProjectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden text-left">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4.5 h-4.5 text-cyan-600 animate-pulse" />
          <h3 className="text-slate-800 text-sm tracking-tight">
            AI Vector Similarity Map Projection
          </h3>
        </div>

        {/* Status indicator badge */}
        {activePlan === "advanced" ? (
          <span className="text-[8px] font-mono uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            REAL VECTOR TRACE
          </span>
        ) : (
          <span className="text-[8px] font-mono uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> PROJECTION DEMO
          </span>
        )}
      </div>

      {/* Vector space grid simulator */}
      <div className="relative w-full h-[220px] bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-center z-10 group overflow-hidden">
        {/* Background radar circular loops */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[180px] h-[180px] border border-dashed border-indigo-400 rounded-full animate-pulse" />
          <div className="w-[100px] h-[100px] border border-slate-600 rounded-full absolute" />
          <div className="w-[1px] h-full bg-slate-800 absolute" />
          <div className="w-full h-[1px] bg-slate-800 absolute" />
        </div>

        {/* Plot nodes map */}
        {vectorNodes.map((node) => (
          <motion.button
            key={node.id}
            onClick={() => setSelectedVectorNode(node)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center transition border cursor-pointer hover:scale-125 z-20 ${
              selectedVectorNode?.id === node.id
                ? "bg-cyan-400 border-white shadow-lg shadow-cyan-400/50 scale-110"
                : "bg-indigo-600 border-indigo-400 shadow shadow-indigo-600/30"
            }`}
            title={node.label}
            whileHover={{ scale: 1.3 }}
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.button>
        ))}

        {/* Lock banner overlay block for lower tiers */}
        {activePlan !== "advanced" && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2.5px] z-30 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="text-xs text-white">
                Full Dimensional Vectors Locked
              </h4>
              <p className="text-[10px] text-neutral-400 leading-normal">
                Advanced NLP embeddings matrices are locked. Upgrade to
                **Advanced Plan** to feed actual coordinate grids into LLM
                indexes.
              </p>
            </div>
            <Link
              href="/developer/billing"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-[9px] uppercase tracking-wider font-extrabold transition cursor-pointer"
            >
              Unlock Multi-Dimension Vectors
            </Link>
          </div>
        )}
      </div>

      {/* Selected node card telemetry details */}
      {selectedVectorNode && (
        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 font-mono text-[9px] text-left">
          <div className="flex justify-between items-center text-slate-400 ">
            <span>SELECTED CONCEPT VECTOR</span>
            <span className="text-indigo-650">
              RELEVANCE: {(selectedVectorNode.relevance * 100).toFixed(0)}%
            </span>
          </div>
          <h4 className="font-sans  text-slate-800 text-xs mt-0.5 truncate">
            {selectedVectorNode.label}
          </h4>
          <p className="text-[9.5px] text-slate-500 font-sans truncate font-light font-normal">
            Article: "{selectedVectorNode.articleTitle}"
          </p>
          <div className="flex items-center gap-3 text-slate-400 text-[8.5px] pt-1">
            <span>
              X:{" "}
              <span className="text-indigo-650 ">
                {selectedVectorNode.real
                  ? ((selectedVectorNode.x - 50) / 40).toFixed(4)
                  : "Simulated"}
              </span>
            </span>
            <span>
              Y:{" "}
              <span className="text-indigo-650 ">
                {selectedVectorNode.real
                  ? ((selectedVectorNode.y - 50) / 40).toFixed(4)
                  : "Simulated"}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
