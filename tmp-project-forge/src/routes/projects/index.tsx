import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge, StatusDot } from "@/components/ui-bits/Card";
import { Search, ExternalLink, GitBranch, Clock } from "lucide-react";

export const Route = createFileRoute("/projects/")({ component: Projects });

const projects = [
  { name: "acme-corp", company: "Acme Corp", branch: "main", deploy: "v2.14.0", status: "healthy", env: "production", updated: "2 min", region: "us-east-1" },
  { name: "acme-corp-staging", company: "Acme Corp", branch: "develop", deploy: "v2.15.0-rc.2", status: "healthy", env: "staging", updated: "14 min", region: "us-east-1" },
  { name: "northwind-billing", company: "Northwind Co.", branch: "main", deploy: "v1.8.4", status: "healthy", env: "production", updated: "1 h", region: "eu-west-2" },
  { name: "lumina-erp", company: "Lumina ERP", branch: "main", deploy: "v3.0.1", status: "warning", env: "production", updated: "3 h", region: "us-west-2" },
  { name: "atlas-saas", company: "Atlas SaaS", branch: "feat/payments", deploy: "v0.9.0-beta", status: "error", env: "preview", updated: "1 h", region: "sa-east-1" },
  { name: "helios-pos", company: "Helios Retail", branch: "main", deploy: "v4.2.0", status: "healthy", env: "production", updated: "yesterday", region: "us-east-1" },
];

function Projects() {
  return (
    <Shell crumbs={["Proyectos"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
            <p className="text-sm text-muted-foreground mt-1">184 proyectos · 32 servidores · 6 regiones.</p>
          </div>
          <div className="flex items-center gap-2 h-9 px-2.5 rounded-md bg-surface border border-border w-64">
            <Search className="size-3.5 text-muted-foreground" />
            <input placeholder="Buscar proyecto…" className="bg-transparent text-xs outline-none flex-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link key={p.name} to="/projects/$slug" params={{ slug: p.name }} className="block">
              <Card className="p-5 hover:border-border-strong transition group h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-md bg-gradient-primary grid place-items-center text-[11px] font-bold text-primary-foreground">
                        {p.company.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.company}</div>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Badge tone={p.env === "production" ? "primary" : p.env === "staging" ? "info" : "warning"}>{p.env}</Badge>
                  <Badge><GitBranch className="size-2.5" />{p.branch}</Badge>
                  <Badge>{p.region}</Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Último deploy</div>
                    <div className="text-xs font-mono mt-0.5">{p.deploy}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={p.status as any} />
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="size-2.5" />{p.updated}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
