// AfriLingo — carte primitive.
import { cn } from "@/lib/format";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface border border-line p-5 shadow-lg shadow-black/30",
        className
      )}
      {...props}
    />
  );
}