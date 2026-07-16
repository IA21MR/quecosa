import { cn } from "@/lib/utils";

export function Card({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} className={cn("rounded-xl bg-card border border-border shadow-card", className)}>{children}</div>
  );
}

export function CardHeader({ title, desc, action }: { title: React.ReactNode; desc?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 pb-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusDot({ status }: { status: "healthy" | "warning" | "error" | "idle" }) {
  const map = {
    healthy: "bg-success shadow-[0_0_8px_var(--color-success)]",
    warning: "bg-warning shadow-[0_0_8px_var(--color-warning)]",
    error: "bg-destructive shadow-[0_0_8px_var(--color-destructive)]",
    idle: "bg-muted-foreground/50",
  } as const;
  return <span className={`inline-block size-1.5 rounded-full ${map[status]}`} />;
}

export function Badge({ children, tone = "default", className }: { children: React.ReactNode; tone?: "default" | "success" | "warning" | "error" | "info" | "primary"; className?: string }) {
  const tones: Record<string, string> = {
    default: "bg-surface text-muted-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-info/10 text-info border-info/20",
    primary: "bg-primary/10 text-primary border-primary/20",
  };
  return <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border", tones[tone], className)}>{children}</span>;
}
