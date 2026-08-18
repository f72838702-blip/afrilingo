// AfriLingo — burst « +XP » flottant (animation ponctuelle).
"use client";

import { motion, AnimatePresence } from "framer-motion";

export function XpBurst({
  amount,
  show,
}: {
  amount: number;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="burst"
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1.1 }}
          exit={{ opacity: 0, y: -60, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 z-50 text-2xl font-extrabold text-gold drop-shadow"
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}