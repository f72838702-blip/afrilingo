// AfriLingo — affichage des cœurs (vie).
"use client";

import { Heart } from "lucide-react";
import { MAX_HEARTS } from "@/lib/constants";
import { cn } from "@/lib/format";

export function Hearts({ hearts, className }: { hearts: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`${hearts} cœurs`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: MAX_HEARTS }, (_, i) => (
          <Heart
            key={i}
            className={cn(
              "h-5 w-5 transition-colors",
              i < hearts ? "fill-rose text-rose" : "text-surface-3"
            )}
          />
        ))}
      </div>
    </div>
  );
}