import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge, StatusDot } from "@/components/ui-bits/Card";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/companies/")({ component: Companies });

const companies = [
  { name: "Acme Corp", domain: "acme.com", projects: 8, status: "healthy", plan: "Enterprise", region: "us-east-1", created: "Mar 12, 2024", color: "from-blue-500 to-cyan-500" },
  { name: "Northwind Co.", domain: "northwind.io", projects: 4, status: "healthy", plan: "Growth", region: "eu-west-2", created: "Apr 02, 2024", color: "from-emerald-500 to-teal-500" },
  { name: "Lumina ERP", domain: "lumina.app", projects: 6, status: "warning", plan: "Enterprise", region: "us-west-2", created: "May 11, 2024", color: "from-amber-500 to-orange-500" },
  { name: "Atlas SaaS", domain: "atlas.dev", projects: 2, status: "error", plan: "Startup", region: "sa-east-1", created: "Jun 19, 2024", color: "from-rose-500 to-pink-500" },
  { name: "Helios Retail", domain: "heliosretail.cl", projects: 5, status: "healthy", plan: "Growth", region: "us-east-1", created: "Jul 22, 2024", color: "from-violet-500 to-purple-500" },
  { name: "Mercurio Logistics", domain: "mercurio.mx", projects: 3, status: "healthy", plan: "Growth", region: "us-east-1", created: "Aug 04, 2024", color: "from-indigo-500 to-blue-500" },
  { name: "Vesta Hotels", domain: "vesta.travel", projects: 7, status: "healthy", plan: "Enterprise", region: "eu-west-2", created: "Sep 09, 2024", color: "from-fuchsia-500 to-rose-500" },
  { name: "Borealis Capital", domain: "borealis.fi", projects: 2, status: "idle", plan: "Startup", region: "eu-central-1", created: "Oct 28, 2024", color: "from-slate-500 to-zinc-500" },
] as const;

function Companies() {
  return (
    <Shell crumbs={["Empresas"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Empresas</h1>
            <p className="text-sm text-muted-foreground mt-1">47 tenants activos · 184 proyectos en total.</p>
          </div>
          <Link to="/companies/new" className="h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition shadow-glow">
            <Plus className="size-4" /> Nueva empresa
          </Link>
        </div>

        <Card>
          <div className="flex items-center gap-2 p-3 border-b border-border">
            <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-surface border border-border flex-1 max-w-md">
              <Search className="size-3.5 text-muted-foreground" />
              <input placeholder="Buscar empresas, dominios…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground" />
            </div>
            <button className="h-8 px-2.5 text-xs rounded-md border border-border flex items-center gap-1.5 hover:bg-surface"><Filter className="size-3.5" />Filtros</button>
            <div className="ml-auto flex gap-1 text-xs">
              {["Todas", "Healthy", "Warning", "Error"].map((t, i) => (
                <button key={t} className={`h-8 px-2.5 rounded-md ${i === 0 ? "bg-surface border border-border" : "text-muted-foreground hover:bg-surface"}`}>{t}</button>
              ))}
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Empresa</th>
                <th className="text-left font-medium py-2.5">Plan</th>
                <th className="text-left font-medium py-2.5">Región</th>
                <th className="text-left font-medium py-2.5">Proyectos</th>
                <th className="text-left font-medium py-2.5">Estado</th>
                <th className="text-left font-medium py-2.5">Creada</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.name} className="border-t border-border hover:bg-surface/60 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-md bg-gradient-to-br ${c.color} grid place-items-center text-[11px] font-bold text-white shadow-card`}>
                        {c.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{c.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge tone={c.plan === "Enterprise" ? "primary" : c.plan === "Growth" ? "info" : "default"}>{c.plan}</Badge></td>
                  <td className="text-[11px] font-mono text-muted-foreground">{c.region}</td>
                  <td className="text-sm">{c.projects}</td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs">
                      <StatusDot status={c.status as any} />
                      <span className="capitalize text-muted-foreground">{c.status}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{c.created}</td>
                  <td className="pr-5">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="size-7 grid place-items-center rounded hover:bg-surface text-muted-foreground"><ExternalLink className="size-3.5" /></button>
                      <button className="size-7 grid place-items-center rounded hover:bg-surface text-muted-foreground"><MoreHorizontal className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Shell>
  );
}
