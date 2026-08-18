// AfriLingo — nœud du skill tree (état locked/current/unlocked/completed).
"use client";

import Link from "next/link";
import { Check, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/format";

export type NodeState = "locked" | "current" | "unlocked" | "completed";

export interface SkillNodeData {
  lessonId: string;
  title: string;
  state: NodeState;
  href: string;
}

const STATE_STYLES: Record<NodeState, string> = {
  locked: "bg-surface-2 text-muted border-line",
  current: "bg-jade text-cream border-jade-2",
  unlocked: "bg-surface-2 text-cream border-line",
  completed: "bg-gold text-ink border-gold-2",
};

export function SkillNode({ node }: { node: SkillNodeData }) {
  const { state, title, lessonId, href } = node;
  const inner = (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileTap={state === "current" || state === "unlocked" ? { scale: 0.92 } : undefined}
        animate={state === "current" ? { y: [0, -6, 0] } : {}}
        transition={
          state === "current"
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.1 }
        }
        className={cn(
          "grid h-16 w-16 place-items-center rounded-2xl border-2 shadow-lg",
          STATE_STYLES[state]
        )}
      >
        {state === "completed" && <Check className="h-7 w-7" />}
        {state === "locked" && <Lock className="h-6 w-6" />}
        {state === "current" && <Star className="h-7 w-7 fill-cream" />}
        {state === "unlocked" && <Star className="h-7 w-7" />}
      </motion.div>
      <span
        className={cn(
          "max-w-[7rem] text-center text-xs font-medium",
          state === "locked" ? "text-muted" : "text-cream"
        )}
      >
        {title}
      </span>
    </div>
  );

  if (state === "locked") {
    return <div aria-label={`Leçon ${title} (verrouillée)`}>{inner}</div>;
  }
  return (
    <Link href={href} aria-label={`Leçon ${title}`} className="block">
      {inner}
    </Link>
  );
}