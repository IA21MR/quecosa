import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, FolderGit2, Rocket, Package, Server,
  GitBranch, Cloud, Plug, ScrollText, Settings, Sparkles, Search, Command
} from "lucide-react";

const nav = [
  { group: "Overview", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/companies", label: "Empresas", icon: Building2 },
    { to: "/projects", label: "Proyectos", icon: FolderGit2 },
  ]},
  { group: "Automation", items: [
    { to: "/provisioning", label: "Provisionamiento", icon: Rocket },
    { to: "/modules", label: "Módulos", icon: Package },
    { to: "/plugins", label: "Plugins", icon: Plug },
  ]},
  { group: "Platform", items: [
    { to: "/infrastructure", label: "Infraestructura", icon: Server },
    { to: "/repositories", label: "Repositorios", icon: GitBranch },
    { to: "/deployments", label: "Deployments", icon: Cloud },
    { to: "/logs", label: "Logs", icon: ScrollText },
    { to: "/settings", label: "Configuración", icon: Settings },
  ]},
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-[260px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="h-14 px-5 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="size-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Forge</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Provisioning Platform</div>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-sidebar-border">
        <button className="w-full h-9 px-3 rounded-md bg-surface hover:bg-surface-hover border border-border flex items-center gap-2 text-xs text-muted-foreground transition">
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border flex items-center gap-0.5">
            <Command className="size-2.5" />K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-5">
        {nav.map((g) => (
          <div key={g.group}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{g.group}</div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
                return (
                  <li key={it.to}>
                    <Link to={it.to} className={`group flex items-center gap-2.5 h-8 px-2 rounded-md text-[13px] transition ${
                      active
                        ? "bg-sidebar-accent text-foreground shadow-card"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                    }`}>
                      <it.icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className="flex-1">{it.label}</span>
                      {it.to === "/provisioning" && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">3</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 p-3 rounded-lg border border-sidebar-border bg-surface/50">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xs font-semibold text-background">
            DM
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-xs font-medium truncate">Diego Morales</div>
            <div className="text-[10px] text-muted-foreground truncate">DevOps · Forge Inc.</div>
          </div>
          <div className="size-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
        </div>
      </div>
    </aside>
  );
}
