"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ListTree,
  Search,
  ShieldAlert,
  Database,
  BrainCircuit,
  Sparkles,
  Server,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// We map existing ProcessStage to icon and label
const STAGE_CONFIG = {
  rss_fetch: {
    label: "RSS Fetch",
    icon: ListTree,
    color: "text-green-500",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  readability: {
    label: "Readability",
    icon: Search,
    color: "text-blue-500",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  dedupe_check: {
    label: "Deduplication",
    icon: ShieldAlert,
    color: "text-yellow-500",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
  },
  search: {
    label: "Search & Context",
    icon: Database,
    color: "text-indigo-500",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
  },
  title_gen: {
    label: "AI Title Synthesis",
    icon: BrainCircuit,
    color: "text-purple-500",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  content_gen: {
    label: "AI Content Generation",
    icon: Sparkles,
    color: "text-fuchsia-500",
    border: "border-fuchsia-500/30",
    bg: "bg-fuchsia-500/10",
  },
  saving: {
    label: "Database Commits",
    icon: Server,
    color: "text-pink-500",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
  },
};

const STAGES_ORDER = [
  "rss_fetch",
  "readability",
  "dedupe_check",
  "search",
  "title_gen",
  "content_gen",
  "saving",
];

// Custom Node component
const PipelineNode = ({ data }: any) => {
  const Icon = data.icon;
  const isProcessing = data.active > 0;
  const hasErrors = data.failed > 0;

  return (
    <div
      className={cn(
        "px-4 py-4 shadow-xl rounded-2xl backdrop-blur-md border-[1.5px] min-w-[280px] transition-all duration-500 relative overflow-hidden",
        isProcessing
          ? "border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/30 scale-[1.02] z-50 bg-[#0d1117]/90"
          : hasErrors
            ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-[#0d1117]/80"
            : cn("bg-[#0d1117]/50 opacity-80", data.border),
      )}
    >
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        className="!w-2 !h-2 !bg-muted-foreground/30 !border-none"
      />

      <div className="flex items-center justify-between mb-3 border-b border-[#30363d] pb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", data.bg)}>
            {isProcessing ? (
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-[2.5px] border-t-transparent animate-spin",
                  data.color.replace("text-", "border-"),
                )}
              />
            ) : (
              <Icon className={cn("w-5 h-5", data.color)} />
            )}
          </div>
          <span className="font-semibold text-base tracking-wide text-foreground">
            {data.label}
          </span>
        </div>
      </div>

      <div className="flex gap-2 text-xs">
        <div className="flex-1 bg-background/50 rounded-lg p-2 flex flex-col items-center justify-center border border-border/50 relative overflow-hidden">
          {isProcessing && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 animate-pulse" />
          )}
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
            Active
          </span>
          <span
            className={cn(
              "font-mono text-xl font-bold leading-none",
              data.active > 0 ? "text-indigo-400" : "text-muted-foreground",
            )}
          >
            {data.active}
          </span>
        </div>
        <div className="flex-1 bg-background/50 rounded-lg p-2 flex flex-col items-center justify-center border border-border/50">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
            Failed
          </span>
          <span
            className={cn(
              "font-mono text-xl font-bold leading-none",
              data.failed > 0 ? "text-red-500" : "text-muted-foreground",
            )}
          >
            {data.failed}
          </span>
        </div>
      </div>

      {data.activeJobsList && data.activeJobsList.length > 0 && (
        <div className="mt-3 pt-2 space-y-1.5 max-h-[80px] overflow-y-auto custom-scrollbar">
          {data.activeJobsList.map((j: any, idx: number) => (
            <div
              key={idx}
              className="text-[11px] font-medium text-muted-foreground truncate flex items-center gap-2 px-2 py-1 bg-indigo-500/5 rounded-md border border-indigo-500/10"
            >
              <Activity className="w-3 h-3 text-indigo-400 shrink-0 animate-pulse" />
              {j.title || j.id}
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        className="!w-2 !h-2 !bg-muted-foreground/30 !border-none"
      />
    </div>
  );
};

const nodeTypes = {
  pipelineNode: PipelineNode,
};

export default function LivePipelineFlow({
  recentJobs,
}: {
  recentJobs: any[];
}) {
  const { nodes, edges } = useMemo(() => {
    const stageStats: Record<
      string,
      { active: number; failed: number; activeJobsList: any[] }
    > = {};

    STAGES_ORDER.forEach((stage) => {
      stageStats[stage] = { active: 0, failed: 0, activeJobsList: [] };
    });

    // Populate stageStats from recentJobs
    recentJobs.forEach((job) => {
      // Find the CURRENT active stage for this job
      let currentStage = null;
      let isFailed = false;

      // We look for the first stage that is 'active', 'pending', or 'failed' starting from end to beginning?
      // No, let's just find the exact stage executing. Actually, sequential order check:
      for (let i = 0; i < STAGES_ORDER.length; i++) {
        const stage = STAGES_ORDER[i];
        if (job.stages[stage]) {
          const st = job.stages[stage].status;
          if (st === "active" || st === "pending") {
            currentStage = stage;
            break;
          }
          if (st === "failed") {
            currentStage = stage;
            isFailed = true;
            break;
          }
        }
      }

      // If all passed successfully and currently in 'saving' stage status='success', it's done-done,
      // but it might still be in recentJobs until cleanup. We can skip plotting entirely finished jobs.
      if (currentStage) {
        if (isFailed) {
          stageStats[currentStage].failed++;
        } else {
          stageStats[currentStage].active++;
          // Only display up to 3 active jobs by title so node doesn't stretch huge
          if (stageStats[currentStage].activeJobsList.length < 3) {
            stageStats[currentStage].activeJobsList.push({
              id: job.jobId,
              title: job.title,
            });
          }
        }
      }
    });

    const newNodes: Node[] = STAGES_ORDER.map((stage, idx) => {
      const config = STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG];
      const stats = stageStats[stage];
      
      let x = 450;
      let y = 0;
      let sourcePos = Position.Bottom;
      let targetPos = Position.Top;

      if (stage === "rss_fetch") {
         x = 0; y = 0;
         sourcePos = Position.Bottom;
         targetPos = Position.Top;
      } else if (stage === "readability") {
         x = 0; y = 220;
         sourcePos = Position.Right;
         targetPos = Position.Top;
      } else if (stage === "dedupe_check") {
         x = 420; y = 220;
         sourcePos = Position.Bottom;
         targetPos = Position.Left;
      } else if (stage === "search") {
         x = 420; y = 440;
         sourcePos = Position.Bottom;
         targetPos = Position.Top;
      } else if (stage === "title_gen") {
         x = 420; y = 660;
         sourcePos = Position.Bottom;
         targetPos = Position.Top;
      } else if (stage === "content_gen") {
         x = 420; y = 880;
         sourcePos = Position.Bottom;
         targetPos = Position.Top;
      } else if (stage === "saving") {
         x = 420; y = 1100;
         sourcePos = Position.Bottom;
         targetPos = Position.Top;
      }

      return {
        id: stage,
        type: "pipelineNode",
        position: { x, y },
        data: {
          label: config.label,
          icon: config.icon,
          color: config.color,
          bg: config.bg,
          border: config.border,
          active: stats.active,
          failed: stats.failed,
          activeJobsList: stats.activeJobsList,
          sourcePosition: sourcePos,
          targetPosition: targetPos
        },
        draggable: true,
      };
    });

    const newEdges: Edge[] = [];
    for (let i = 0; i < STAGES_ORDER.length - 1; i++) {
      const sourceStage = STAGES_ORDER[i];
      const targetStage = STAGES_ORDER[i + 1];

      const isActivelyFlowing =
        stageStats[sourceStage].active > 0 ||
        stageStats[targetStage].active > 0;

      newEdges.push({
        id: `e-${sourceStage}-${targetStage}`,
        source: sourceStage,
        target: targetStage,
        type: "smoothstep",
        animated: isActivelyFlowing,
        style: {
          stroke: isActivelyFlowing
            ? "rgba(99, 102, 241, 0.8)"
            : "rgba(99, 102, 241, 0.2)",
          strokeWidth: isActivelyFlowing ? 3 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActivelyFlowing
            ? "rgba(99, 102, 241, 0.8)"
            : "rgba(99, 102, 241, 0.2)",
        },
      });
    }

    return { nodes: newNodes, edges: newEdges };
  }, [recentJobs]);

  return (
    <div className="w-full h-[600px] border border-border shadow-2xl rounded-2xl overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        elementsSelectable={false}
        nodesConnectable={false}
        nodesDraggable={true}
        zoomOnScroll={true}
        panOnScroll={true}
      >
        <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="opacity-50 hover:opacity-100 transition-opacity bg-background border"
        />
      </ReactFlow>
    </div>
  );
}
