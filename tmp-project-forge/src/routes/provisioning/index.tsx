import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import { Rocket, Loader2, CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/provisioning/")({ component: Provisioning });

const jobs = [
  { name: "Lumina ERP", step: "Configurando servidor", pct: 42, eta: "2m 12s", color: "primary" },
  { name: "Helios Retail · staging", step: "Ejecutando migraciones", pct: 78, eta: "48s", color: "primary" },
  { name: "Vesta Hotels · preview", step: "Instalando módulos", pct: 12, eta: "4m 30s", color: "info" },
];

function Provisioning() {
  return (
    <Shell crumbs={["Provisionamiento"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Provisionamiento</h1>
            <p className="text-sm text-muted-foreground mt-1">3 jobs en ejecución · 142 completados esta semana.</p>
          </div>
          <Link to="/companies/new" className="h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 shadow-glow">
            <Plus className="size-4" />Nuevo provisionamiento
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {jobs.map(j => (
            <Card key={j.name} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{j.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{j.step}</div>
                </div>
                <Badge tone="primary"><Loader2 className="size-2.5 animate-spin" />running</Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono">{j.pct}%</span>
                  <span className="text-muted-foreground">ETA {j.eta}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-surface overflow-hidden">
                  <div className="h-full bg-gradient-primary relative overflow-hidden" style={{ width: `${j.pct}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Historial reciente</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { n: "Northwind Co. · production", t: "Hoy 10:14", dur: "3m 22s", st: "success" },
              { n: "Acme Corp · preview-pr-128", t: "Hoy 09:48", dur: "2m 51s", st: "success" },
              { n: "Atlas SaaS · staging", t: "Ayer 22:18", dur: "1m 12s", st: "failed" },
              { n: "Mercurio Logistics · production", t: "Ayer 17:02", dur: "4m 04s", st: "success" },
              { n: "Borealis Capital · staging", t: "Ayer 14:38", dur: "3m 18s", st: "success" },
            ].map((r, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3 text-sm">
                <div className={`size-7 rounded-md grid place-items-center border ${r.st === "success" ? "bg-primary/10 border-primary/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                  {r.st === "success" ? <CheckCircle2 className="size-3.5" /> : <Rocket className="size-3.5" />}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium">{r.n}</div>
                  <div className="text-[10px] text-muted-foreground">{r.t}</div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{r.dur}</span>
                <Badge tone={r.st === "success" ? "success" : "error"}>{r.st}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
