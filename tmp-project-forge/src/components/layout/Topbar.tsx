import { Bell, ChevronRight, Plus, GitBranch } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Topbar({ crumbs = ["Dashboard"] as string[], action }: { crumbs?: string[]; action?: React.ReactNode }) {
  return (
    <header className="h-14 sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border flex items-center px-6 gap-4">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground/50" />}
            <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-2.5 h-8 rounded-md border border-border bg-surface text-xs text-muted-foreground">
          <GitBranch className="size-3.5" />
          <span className="font-mono">main</span>
          <span className="size-1 rounded-full bg-success" />
          <span>healthy</span>
        </div>
        <button className="size-8 grid place-items-center rounded-md hover:bg-surface relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-warning" />
        </button>
        {action ?? (
          <Link to="/companies/new" className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition shadow-glow">
            <Plus className="size-3.5" /> Nueva empresa
          </Link>
        )}
      </div>
    </header>
  );
}
