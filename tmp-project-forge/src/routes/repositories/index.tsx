import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import { GitBranch, Github, Lock, GitCommit, ExternalLink, Star } from "lucide-react";

export const Route = createFileRoute("/repositories/")({ component: Repos });

const repos = [
  { name: "forge-platform/acme-corp", desc: "Acme Corp · ERP platform monorepo.", lang: "TypeScript", commits: 1284, branch: "main", updated: "2 min" },
  { name: "forge-platform/lumina-erp", desc: "Lumina ERP · multi-tenant SaaS.", lang: "TypeScript", commits: 842, branch: "main", updated: "3 h" },
  { name: "forge-platform/northwind-billing", desc: "Facturación electrónica + SII.", lang: "TypeScript", commits: 612, branch: "main", updated: "1 h" },
  { name: "forge-platform/helios-pos", desc: "POS móvil + sync offline.", lang: "TypeScript", commits: 421, branch: "main", updated: "yesterday" },
  { name: "forge-platform/atlas-saas", desc: "Atlas SaaS · payments experiments.", lang: "TypeScript", commits: 198, branch: "feat/payments", updated: "1 h" },
  { name: "forge-platform/templates-base", desc: "Template base usado por el wizard.", lang: "TypeScript", commits: 3120, branch: "main", updated: "2 días" },
];

function Repos() {
  return (
    <Shell crumbs={["Repositorios"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repositorios</h1>
          <p className="text-sm text-muted-foreground mt-1">212 repos · sincronizados desde GitHub forge-platform.</p>
        </div>

        <Card>
          <div className="divide-y divide-border">
            {repos.map(r => (
              <div key={r.name} className="px-5 py-4 flex items-center gap-4 hover:bg-surface/60 transition">
                <div className="size-9 rounded-md bg-surface border border-border grid place-items-center">
                  <Github className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium font-mono">{r.name}</span>
                    <Badge><Lock className="size-2.5" />private</Badge>
                    <Badge tone="primary"><GitBranch className="size-2.5" />{r.branch}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{r.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-info" />{r.lang}</span>
                    <span className="flex items-center gap-1"><GitCommit className="size-2.5" />{r.commits} commits</span>
                    <span>actualizado hace {r.updated}</span>
                  </div>
                </div>
                <button className="size-8 grid place-items-center rounded hover:bg-surface text-muted-foreground"><Star className="size-3.5" /></button>
                <button className="size-8 grid place-items-center rounded hover:bg-surface text-muted-foreground"><ExternalLink className="size-3.5" /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
