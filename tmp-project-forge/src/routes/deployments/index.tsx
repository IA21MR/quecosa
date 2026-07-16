import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import { CheckCircle2, XCircle, AlertTriangle, RotateCw, GitBranch } from "lucide-react";

export const Route = createFileRoute("/deployments/")({ component: Deps });

const rows = [
  { v: "v2.14.0", proj: "acme-corp", branch: "main", env: "production", user: "Diego M.", date: "Hoy 12:04", dur: "2m 14s", status: "success" },
  { v: "v1.8.4", proj: "northwind-billing", branch: "main", env: "production", user: "Sofía R.", date: "Hoy 11:38", dur: "1m 58s", status: "success" },
  { v: "v3.0.1", proj: "lumina-erp", branch: "main", env: "production", user: "Marco P.", date: "Hoy 10:12", dur: "2m 04s", status: "warning" },
  { v: "v4.2.0", proj: "helios-pos", branch: "main", env: "production", user: "renovate", date: "Hoy 09:21", dur: "1m 47s", status: "success" },
  { v: "v0.9.0-beta", proj: "atlas-saas", branch: "feat/payments", env: "preview", user: "Sofía R.", date: "Hoy 08:48", dur: "—", status: "failed" },
  { v: "v2.13.4", proj: "acme-corp", branch: "main", env: "production", user: "Diego M.", date: "Ayer 18:21", dur: "2m 04s", status: "success" },
  { v: "v2.15.0-rc.2", proj: "acme-corp-staging", branch: "develop", env: "staging", user: "Sofía R.", date: "Ayer 17:38", dur: "1m 58s", status: "success" },
];

function Deps() {
  return (
    <Shell crumbs={["Deployments"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deployments</h1>
          <p className="text-sm text-muted-foreground mt-1">1,294 deploys totales · 98.7% éxito · tiempo promedio 2m 04s.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Hoy", v: "24", s: "+6 vs ayer", t: "success" },
            { l: "Producción", v: "8", s: "todos OK", t: "success" },
            { l: "Fallidos 24h", v: "1", s: "atlas-saas", t: "error" },
            { l: "Duración avg", v: "2m 04s", s: "-12s vs sem.", t: "info" },
          ].map(s => (
            <Card key={s.l} className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <div className="text-2xl font-semibold mt-1">{s.v}</div>
              <div className={`text-[10px] mt-0.5 ${s.t === "success" ? "text-success" : s.t === "error" ? "text-destructive" : "text-info"}`}>{s.s}</div>
            </Card>
          ))}
        </div>

        <Card>
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left px-5 py-2.5 font-medium">Proyecto</th>
                <th className="text-left py-2.5 font-medium">Versión</th>
                <th className="text-left py-2.5 font-medium">Entorno</th>
                <th className="text-left py-2.5 font-medium">Branch</th>
                <th className="text-left py-2.5 font-medium">Usuario</th>
                <th className="text-left py-2.5 font-medium">Fecha</th>
                <th className="text-left py-2.5 font-medium">Duración</th>
                <th className="text-left py-2.5 font-medium">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border hover:bg-surface/60">
                  <td className="px-5 py-3 font-medium text-xs">{r.proj}</td>
                  <td className="text-xs font-mono">{r.v}</td>
                  <td><Badge tone={r.env === "production" ? "primary" : r.env === "staging" ? "info" : "warning"}>{r.env}</Badge></td>
                  <td className="text-xs font-mono text-muted-foreground"><GitBranch className="inline size-2.5 mr-1" />{r.branch}</td>
                  <td className="text-xs">{r.user}</td>
                  <td className="text-xs text-muted-foreground">{r.date}</td>
                  <td className="text-xs font-mono text-muted-foreground">{r.dur}</td>
                  <td>
                    {r.status === "success" && <Badge tone="success"><CheckCircle2 className="size-2.5" />Ready</Badge>}
                    {r.status === "warning" && <Badge tone="warning"><AlertTriangle className="size-2.5" />Slow</Badge>}
                    {r.status === "failed" && <Badge tone="error"><XCircle className="size-2.5" />Failed</Badge>}
                  </td>
                  <td className="pr-5"><button className="h-7 px-2 text-[10px] rounded hover:bg-surface text-muted-foreground flex items-center gap-1"><RotateCw className="size-3" />Redeploy</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Shell>
  );
}
