import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge, StatusDot, CardHeader } from "@/components/ui-bits/Card";
import {
  Globe, GitBranch, RotateCw, RefreshCw, ExternalLink, Github, Rocket, Activity,
  Boxes, Server, Cloud, KeyRound, ScrollText, FileText, Cpu, MemoryStick, HardDrive,
  Database, Zap, MoreHorizontal, GitCommit, GitPullRequest, CheckCircle2, Eye, EyeOff,
  Search, AlertCircle, Info, AlertTriangle, XCircle
} from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({ component: ProjectDetail });

const tabs = [
  { id: "overview", label: "Resumen", icon: Activity },
  { id: "modules", label: "Módulos", icon: Boxes },
  { id: "repo", label: "Repositorio", icon: GitBranch },
  { id: "infra", label: "Infraestructura", icon: Server },
  { id: "deploys", label: "Deployments", icon: Cloud },
  { id: "env", label: "Variables", icon: KeyRound },
  { id: "logs", label: "Logs", icon: ScrollText },
] as const;

function ProjectDetail() {
  const { slug } = Route.useParams();
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("overview");

  return (
    <Shell crumbs={["Proyectos", slug]} action={
      <div className="flex gap-1.5">
        <button className="h-8 px-2.5 text-xs rounded-md border border-border hover:bg-surface flex items-center gap-1.5"><Github className="size-3.5" />Repo</button>
        <button className="h-8 px-2.5 text-xs rounded-md border border-border hover:bg-surface flex items-center gap-1.5"><ExternalLink className="size-3.5" />Servidor</button>
        <button className="h-8 px-2.5 text-xs rounded-md border border-border hover:bg-surface flex items-center gap-1.5"><RefreshCw className="size-3.5" />Reiniciar</button>
        <button className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground flex items-center gap-1.5 shadow-glow"><Rocket className="size-3.5" />Deploy</button>
      </div>
    }>
      <div className="p-6 space-y-5 max-w-[1600px]">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-surface to-card border-b border-border">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-xl bg-gradient-primary grid place-items-center text-lg font-bold text-primary-foreground shadow-glow">AC</div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-semibold tracking-tight">{slug}</h1>
                  <Badge tone="success"><StatusDot status="healthy" />operational</Badge>
                  <Badge tone="primary">production</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Acme Corp · creado el 12 mar, 2024 · último deploy hace 2 min</p>

                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <UrlPill label="Producción" url="https://app.acme.com" status="healthy" />
                  <UrlPill label="Staging" url="https://staging.acme.com" status="healthy" />
                  <UrlPill label="Preview" url="https://pr-128.acme.dev" status="warning" />
                  <UrlPill label="Repositorio" url="github.com/forge/acme" status="idle" icon={Github} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`relative px-3 py-3 text-xs font-medium flex items-center gap-1.5 transition ${
                tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
                <t.icon className="size-3.5" />{t.label}
                {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </Card>

        {tab === "overview" && <Overview />}
        {tab === "modules" && <Modules />}
        {tab === "repo" && <Repo />}
        {tab === "infra" && <Infra />}
        {tab === "deploys" && <Deploys />}
        {tab === "env" && <EnvTab />}
        {tab === "logs" && <Logs />}
      </div>
    </Shell>
  );
}

function UrlPill({ label, url, status, icon: Icon = Globe }: { label: string; url: string; status: any; icon?: any }) {
  return (
    <div className="p-2.5 rounded-md bg-background/60 border border-border flex items-center gap-2.5 group hover:border-border-strong transition">
      <div className="size-7 rounded-md bg-surface border border-border grid place-items-center">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><StatusDot status={status} />{label}</div>
        <div className="text-xs font-mono truncate">{url}</div>
      </div>
      <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </div>
  );
}

function Overview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 p-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Cpu, label: "CPU", val: "34%", sub: "2 vCPU" },
            { icon: MemoryStick, label: "RAM", val: "62%", sub: "2.5 / 4 GB" },
            { icon: HardDrive, label: "Disco", val: "41%", sub: "33 / 80 GB" },
          ].map(r => (
            <div key={r.label} className="p-4 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <r.icon className="size-3.5 text-primary" />{r.label}
              </div>
              <div className="text-2xl font-semibold mt-2">{r.val}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{r.sub}</div>
              <div className="mt-2 h-1 rounded-full bg-background"><div className="h-full bg-gradient-primary rounded-full" style={{ width: r.val }} /></div>
            </div>
          ))}
        </div>

        <CardHeader title="Últimos eventos" desc="Actividad del proyecto" />
        <ul className="divide-y divide-border -mx-5">
          {[
            { i: Rocket, t: "Deploy v2.14.0 completado", s: "main · 2m 14s · por Diego Morales", st: "success" },
            { i: GitCommit, t: "Commit a8f23b1 · fix(billing): VAT rounding", s: "hace 38 min · CI verde", st: "info" },
            { i: GitPullRequest, t: "PR #482 mergeado a main", s: "feat(inventory): low-stock alerts", st: "success" },
            { i: AlertTriangle, t: "Aviso: CPU > 80% durante 4 min", s: "se recuperó automáticamente", st: "warning" },
            { i: Boxes, t: "Módulo CRM actualizado a v3.6.0", s: "auto-deploy aplicado", st: "info" },
          ].map((e, i) => (
            <li key={i} className="px-5 py-3 flex items-center gap-3">
              <div className={`size-7 rounded-md grid place-items-center border ${
                e.st === "warning" ? "bg-warning/10 border-warning/20 text-warning"
                : e.st === "success" ? "bg-success/10 border-success/20 text-success"
                : "bg-info/10 border-info/20 text-info"
              }`}>
                <e.i className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{e.t}</div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">{e.s}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Salud del sistema" action={<Badge tone="success">All systems go</Badge>} />
          <ul className="px-2 pb-3">
            {[
              { name: "Web App", icon: Globe, status: "healthy" as const, latency: "84ms" },
              { name: "API Gateway", icon: Zap, status: "healthy" as const, latency: "31ms" },
              { name: "PostgreSQL", icon: Database, status: "healthy" as const, latency: "4ms" },
              { name: "Redis", icon: Activity, status: "warning" as const, latency: "210ms" },
              { name: "Storage", icon: HardDrive, status: "healthy" as const, latency: "12ms" },
            ].map(s => (
              <li key={s.name} className="flex items-center gap-2.5 px-3 py-2 text-xs">
                <div className="size-6 rounded-md bg-surface border border-border grid place-items-center"><s.icon className="size-3 text-muted-foreground" /></div>
                <span className="flex-1">{s.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{s.latency}</span>
                <StatusDot status={s.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Módulos instalados</div>
          <div className="text-2xl font-semibold mt-1">14 <span className="text-xs text-muted-foreground font-normal">/ 18 disponibles</span></div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Ventas","CRM","Billing","Inventario","RRHH","BI","Reportes","AI Assistant","Compras"].map(m => (
              <Badge key={m}>{m}</Badge>
            ))}
            <Badge tone="primary">+5</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Modules() {
  const mods = [
    { name: "Ventas", v: "3.2.0", cat: "Operación", status: "active", deps: ["Inventario", "Facturación"] },
    { name: "Inventario", v: "4.0.2", cat: "Operación", status: "active", deps: [] },
    { name: "Facturación", v: "5.1.0", cat: "Administración", status: "active", deps: ["Ventas"] },
    { name: "CRM", v: "3.6.0", cat: "Administración", status: "active", deps: [], update: "3.7.0" },
    { name: "RRHH", v: "2.2.0", cat: "Administración", status: "active", deps: [] },
    { name: "BI", v: "1.5.2", cat: "Analítica", status: "active", deps: ["Reportes"] },
    { name: "Reportes", v: "2.0.0", cat: "Analítica", status: "active", deps: [] },
    { name: "AI Assistant", v: "0.9.0-beta", cat: "IA", status: "active", deps: ["CRM"] },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <Card>
        <CardHeader title="Módulos instalados" desc="Gestiona el ciclo de vida de cada módulo" action={
          <button className="h-7 px-2.5 text-xs rounded-md bg-primary text-primary-foreground">Marketplace</button>
        } />
        <div className="divide-y divide-border">
          {mods.map(m => (
            <div key={m.name} className="px-5 py-3 flex items-center gap-3">
              <div className="size-9 rounded-md bg-surface border border-border grid place-items-center"><Boxes className="size-4 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{m.name}</div>
                  <Badge>{m.cat}</Badge>
                  {m.update && <Badge tone="warning">v{m.update} disponible</Badge>}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">v{m.v} {m.deps.length ? `· depends: ${m.deps.join(", ")}` : ""}</div>
              </div>
              <Badge tone="success">active</Badge>
              <button className="size-7 grid place-items-center rounded hover:bg-surface text-muted-foreground"><MoreHorizontal className="size-4" /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-xs font-semibold mb-3">Grafo de dependencias</div>
        <svg viewBox="0 0 240 320" className="w-full">
          <defs>
            <marker id="ar" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--color-muted-foreground)" />
            </marker>
          </defs>
          {[
            ["120,40","60,120"], ["120,40","180,120"], ["60,120","60,210"],
            ["180,120","120,210"], ["180,120","210,210"], ["120,210","120,290"]
          ].map(([a,b], i) => (
            <line key={i} x1={a.split(",")[0]} y1={a.split(",")[1]} x2={b.split(",")[0]} y2={b.split(",")[1]} stroke="var(--color-border-strong)" strokeWidth="1" markerEnd="url(#ar)" />
          ))}
          {[
            { x: 120, y: 40, t: "Ventas", c: "var(--color-primary)" },
            { x: 60, y: 120, t: "Inventario", c: "var(--color-info)" },
            { x: 180, y: 120, t: "Facturación", c: "var(--color-info)" },
            { x: 60, y: 210, t: "Stock", c: "var(--color-muted-foreground)" },
            { x: 120, y: 210, t: "CRM", c: "var(--color-warning)" },
            { x: 210, y: 210, t: "SII", c: "var(--color-muted-foreground)" },
            { x: 120, y: 290, t: "AI Assistant", c: "var(--color-accent)" },
          ].map((n,i) => (
            <g key={i}>
              <rect x={n.x - 38} y={n.y - 12} width="76" height="24" rx="6" fill="var(--color-surface)" stroke={n.c} strokeWidth="1" />
              <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="9" fill="var(--color-foreground)" fontFamily="Inter">{n.t}</text>
            </g>
          ))}
        </svg>
      </Card>
    </div>
  );
}

function Repo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader title="Últimos commits" desc="main · 1,284 commits" action={
          <div className="flex items-center gap-1.5">
            <Badge><GitBranch className="size-2.5" />main</Badge>
            <Badge tone="success"><CheckCircle2 className="size-2.5" />CI passing</Badge>
          </div>
        } />
        <ul className="divide-y divide-border">
          {[
            { h: "a8f23b1", m: "fix(billing): VAT rounding off by 1 cent", a: "Diego M.", t: "hace 38 min" },
            { h: "f12dc4e", m: "feat(inventory): low-stock email alerts", a: "Sofía R.", t: "hace 2 h" },
            { h: "9bc2710", m: "chore(deps): bump fastify to 4.27.0", a: "renovate[bot]", t: "hace 5 h" },
            { h: "7421a98", m: "feat(crm): timeline view for deals", a: "Marco P.", t: "ayer" },
            { h: "5d10c33", m: "refactor(auth): extract session helpers", a: "Diego M.", t: "ayer" },
          ].map(c => (
            <li key={c.h} className="px-5 py-3 flex items-center gap-3">
              <GitCommit className="size-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{c.m}</div>
                <div className="text-[10px] text-muted-foreground">{c.a} · {c.t}</div>
              </div>
              <code className="text-[10px] font-mono text-muted-foreground bg-surface px-1.5 py-0.5 rounded">{c.h}</code>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Pull Requests" action={<Badge tone="primary">3 abiertos</Badge>} />
          <ul className="px-2 pb-3 space-y-1">
            {[
              { t: "feat(ai): conversational dashboard", n: 482, st: "info" },
              { t: "fix(rrhh): timezone bug en liquidaciones", n: 481, st: "warning" },
              { t: "perf(api): cache compounded queries", n: 480, st: "info" },
            ].map(p => (
              <li key={p.n} className="px-3 py-2 rounded-md hover:bg-surface flex items-center gap-2 text-xs">
                <GitPullRequest className={`size-3.5 ${p.st === "warning" ? "text-warning" : "text-info"}`} />
                <span className="flex-1 truncate">{p.t}</span>
                <span className="font-mono text-[10px] text-muted-foreground">#{p.n}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Pipelines CI/CD" />
          <ul className="px-2 pb-3 space-y-1">
            {[
              { n: "build · test · lint", st: "success", time: "3m 12s" },
              { n: "e2e · staging", st: "success", time: "8m 04s" },
              { n: "deploy · production", st: "success", time: "1m 47s" },
              { n: "nightly · backup", st: "info", time: "scheduled" },
            ].map(p => (
              <li key={p.n} className="px-3 py-2 flex items-center gap-2 text-xs">
                {p.st === "success" ? <CheckCircle2 className="size-3.5 text-success" /> : <Info className="size-3.5 text-info" />}
                <span className="flex-1">{p.n}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{p.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Infra() {
  return (
    <Card className="p-6">
      <CardHeader title="Arquitectura del sistema" desc="Diagrama en vivo de servicios y conexiones" />
      <div className="px-5 pb-5">
        <svg viewBox="0 0 900 360" className="w-full">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-primary)" />
            </marker>
            <pattern id="dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--color-border)" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="900" height="360" fill="url(#dot)" />

          {[
            ["180,90","360,90"], ["180,200","360,90"], ["360,90","540,90"],
            ["540,90","720,40"], ["540,90","720,140"], ["540,200","720,250"],
            ["540,90","540,200"],
          ].map(([a,b], i) => {
            const [x1,y1] = a.split(",").map(Number); const [x2,y2] = b.split(",").map(Number);
            return <path key={i} d={`M${x1+80},${y1+30} C${(x1+x2)/2+80},${y1+30} ${(x1+x2)/2},${y2+30} ${x2},${y2+30}`}
              stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" markerEnd="url(#arr)" />;
          })}

          {[
            { x: 100, y: 90, t: "Usuario", s: "browser", icon: "🌐" },
            { x: 100, y: 200, t: "Mobile App", s: "iOS · Android", icon: "📱" },
            { x: 280, y: 90, t: "Cloudflare", s: "Edge + WAF", icon: "☁️" },
            { x: 460, y: 90, t: "Frontend", s: "Next.js 14", icon: "▲" },
            { x: 460, y: 200, t: "Worker Queue", s: "BullMQ", icon: "⚙️" },
            { x: 640, y: 40, t: "API Gateway", s: "Fastify · TS", icon: "⚡" },
            { x: 640, y: 140, t: "Auth Service", s: "JWT · OAuth", icon: "🔐" },
            { x: 640, y: 250, t: "AI Service", s: "OpenAI · RAG", icon: "🧠" },
            { x: 820, y: 90, t: "PostgreSQL", s: "v14.10", icon: "🐘", w: 110 },
            { x: 820, y: 200, t: "Redis", s: "Cluster", icon: "🔥", w: 110 },
          ].map((n, i) => (
            <g key={i}>
              <rect x={n.x} y={n.y} width={n.w || 160} height="60" rx="10" fill="var(--color-card)" stroke="var(--color-border-strong)" strokeWidth="1" />
              <text x={n.x + 16} y={n.y + 26} fontSize="14" fill="var(--color-foreground)">{n.icon}</text>
              <text x={n.x + 40} y={n.y + 26} fontSize="11" fill="var(--color-foreground)" fontFamily="Inter" fontWeight="600">{n.t}</text>
              <text x={n.x + 40} y={n.y + 42} fontSize="9" fill="var(--color-muted-foreground)" fontFamily="JetBrains Mono">{n.s}</text>
              <circle cx={n.x + (n.w || 160) - 12} cy={n.y + 12} r="3" fill="var(--color-success)" />
            </g>
          ))}
        </svg>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Servicios", v: "10", s: "10 healthy", t: "success" },
            { l: "Latencia p95", v: "84ms", s: "-12ms vs ayer", t: "success" },
            { l: "Requests / min", v: "12.4k", s: "+8% vs ayer", t: "info" },
            { l: "Uptime 30d", v: "99.98%", s: "SLO 99.95%", t: "primary" },
          ].map(s => (
            <div key={s.l} className="p-3 rounded-lg bg-surface/50 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <div className="text-lg font-semibold mt-1">{s.v}</div>
              <div className={`text-[10px] mt-0.5 ${s.t === "success" ? "text-success" : s.t === "primary" ? "text-primary" : "text-info"}`}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Deploys() {
  const rows = [
    { v: "v2.14.0", u: "Diego M.", env: "production", date: "Hoy 12:04", dur: "2m 14s", status: "success", commit: "a8f23b1" },
    { v: "v2.15.0-rc.2", u: "Sofía R.", env: "staging", date: "Hoy 11:38", dur: "1m 58s", status: "success", commit: "f12dc4e" },
    { v: "v2.13.4", u: "Marco P.", env: "production", date: "Ayer 18:21", dur: "2m 04s", status: "success", commit: "9bc2710" },
    { v: "v2.13.3", u: "renovate[bot]", env: "production", date: "Ayer 09:12", dur: "1m 47s", status: "success", commit: "7421a98" },
    { v: "v2.13.2-hotfix", u: "Diego M.", env: "production", date: "May 16, 22:48", dur: "1m 12s", status: "warning", commit: "5d10c33" },
    { v: "v2.13.2", u: "Sofía R.", env: "production", date: "May 16, 14:02", dur: "—", status: "failed", commit: "ab33ff1" },
  ];
  return (
    <Card>
      <CardHeader title="Deployments" desc="Historial completo · puedes hacer rollback a cualquier versión" action={
        <button className="h-7 px-2.5 text-xs rounded-md bg-primary text-primary-foreground flex items-center gap-1.5"><Rocket className="size-3" />Nuevo deploy</button>
      } />
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/50">
          <tr>
            <th className="text-left px-5 py-2.5 font-medium">Versión</th>
            <th className="text-left py-2.5 font-medium">Entorno</th>
            <th className="text-left py-2.5 font-medium">Usuario</th>
            <th className="text-left py-2.5 font-medium">Fecha</th>
            <th className="text-left py-2.5 font-medium">Duración</th>
            <th className="text-left py-2.5 font-medium">Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.v + r.date} className="border-t border-border hover:bg-surface/60">
              <td className="px-5 py-3">
                <div className="text-xs font-mono font-medium">{r.v}</div>
                <div className="text-[10px] text-muted-foreground font-mono">#{r.commit}</div>
              </td>
              <td><Badge tone={r.env === "production" ? "primary" : "info"}>{r.env}</Badge></td>
              <td className="text-xs">{r.u}</td>
              <td className="text-xs text-muted-foreground">{r.date}</td>
              <td className="text-xs font-mono text-muted-foreground">{r.dur}</td>
              <td>
                {r.status === "success" && <Badge tone="success"><CheckCircle2 className="size-2.5" />Ready</Badge>}
                {r.status === "warning" && <Badge tone="warning"><AlertTriangle className="size-2.5" />Hotfix</Badge>}
                {r.status === "failed" && <Badge tone="error"><XCircle className="size-2.5" />Failed</Badge>}
              </td>
              <td className="pr-5 text-right">
                <div className="inline-flex gap-0.5">
                  <button className="h-7 px-2 text-[10px] rounded hover:bg-surface text-muted-foreground">Logs</button>
                  <button className="h-7 px-2 text-[10px] rounded hover:bg-surface text-muted-foreground flex items-center gap-1"><RotateCw className="size-3" />Redeploy</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function EnvTab() {
  const vars = [
    { k: "DATABASE_URL", scope: "secret", env: "prod" },
    { k: "REDIS_URL", scope: "private", env: "prod" },
    { k: "NEXT_PUBLIC_API_URL", scope: "public", env: "prod" },
    { k: "JWT_SECRET", scope: "secret", env: "all" },
    { k: "STRIPE_SECRET_KEY", scope: "secret", env: "prod" },
    { k: "STRIPE_PUBLISHABLE_KEY", scope: "public", env: "all" },
    { k: "OPENAI_API_KEY", scope: "secret", env: "prod" },
    { k: "SENDGRID_API_KEY", scope: "secret", env: "prod" },
    { k: "SENTRY_DSN", scope: "private", env: "all" },
    { k: "FEATURE_AI_REPORTS", scope: "public", env: "staging" },
  ];
  return (
    <Card>
      <CardHeader title="Variables de entorno" desc="Editor seguro · auditoría · cifrado en reposo" action={
        <div className="flex gap-1.5">
          <button className="h-7 px-2 text-xs rounded border border-border hover:bg-surface">Historial</button>
          <button className="h-7 px-2.5 text-xs rounded bg-primary text-primary-foreground">Añadir</button>
        </div>
      } />
      <div className="divide-y divide-border">
        {vars.map(v => (
          <div key={v.k} className="grid grid-cols-[1.4fr_2fr_auto_auto_auto] items-center gap-3 px-5 py-2.5">
            <div className="font-mono text-xs">{v.k}</div>
            <div className="font-mono text-xs text-muted-foreground tracking-widest">{"••••••••••••••••"}</div>
            <Badge tone={v.scope === "secret" ? "error" : v.scope === "private" ? "warning" : "info"}>{v.scope}</Badge>
            <Badge>{v.env}</Badge>
            <div className="flex gap-0.5">
              <button className="size-7 grid place-items-center rounded hover:bg-surface text-muted-foreground"><EyeOff className="size-3.5" /></button>
              <button className="size-7 grid place-items-center rounded hover:bg-surface text-muted-foreground"><MoreHorizontal className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Logs() {
  const lines = [
    { t: "12:04:24.182", l: "INFO", m: "GET /api/orders 200 84ms", svc: "api-gw" },
    { t: "12:04:24.103", l: "INFO", m: "GET /api/users/me 200 12ms", svc: "api-gw" },
    { t: "12:04:23.871", l: "DEBUG", m: "cache HIT users:1842 ttl=300", svc: "redis" },
    { t: "12:04:23.402", l: "WARN", m: "slow query 1.2s on orders.list", svc: "db" },
    { t: "12:04:22.918", l: "INFO", m: "stripe.webhook invoice.paid received", svc: "billing" },
    { t: "12:04:22.110", l: "ERROR", m: "OpenAI 429 rate limit, retry in 800ms", svc: "ai-svc" },
    { t: "12:04:21.840", l: "INFO", m: "POST /api/auth/login 200 142ms", svc: "auth" },
    { t: "12:04:21.302", l: "INFO", m: "deploy.complete v2.14.0 → production", svc: "ci" },
    { t: "12:04:20.991", l: "DEBUG", m: "queue:emails processed batch=24", svc: "worker" },
    { t: "12:04:20.430", l: "INFO", m: "GET /healthz 200 3ms", svc: "api-gw" },
    { t: "12:04:19.882", l: "WARN", m: "redis latency p95 218ms (threshold 200ms)", svc: "redis" },
    { t: "12:04:19.110", l: "INFO", m: "GET /api/reports 200 320ms", svc: "api-gw" },
  ];
  const colors: Record<string, string> = {
    INFO: "text-info", DEBUG: "text-muted-foreground", WARN: "text-warning", ERROR: "text-destructive",
  };
  const icons: Record<string, any> = { INFO: Info, DEBUG: Info, WARN: AlertTriangle, ERROR: XCircle };

  return (
    <Card className="overflow-hidden">
      <div className="p-3 border-b border-border flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-surface border border-border flex-1 max-w-md">
          <Search className="size-3.5 text-muted-foreground" />
          <input placeholder="Búsqueda global (regex soportado)…" className="bg-transparent text-xs outline-none flex-1" />
        </div>
        <div className="flex items-center gap-1 text-xs">
          {[{l: "Info", t: "info", c: 842}, {l: "Warning", t: "warning", c: 14}, {l: "Error", t: "error", c: 3}, {l: "Debug", t: "default", c: 412}].map(f => (
            <button key={f.l} className="h-8 px-2.5 rounded-md border border-border hover:bg-surface flex items-center gap-1.5">
              <span>{f.l}</span><Badge tone={f.t as any}>{f.c}</Badge>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />tailing 'production'
        </div>
      </div>

      <div className="font-mono text-[11px] bg-background/40 max-h-[520px] overflow-auto scrollbar-thin">
        {lines.map((l, i) => {
          const Icon = icons[l.l];
          return (
            <div key={i} className="grid grid-cols-[140px_60px_90px_1fr] gap-3 px-4 py-1.5 hover:bg-surface/50 border-b border-border/40">
              <span className="text-muted-foreground/70">{l.t}</span>
              <span className={`flex items-center gap-1 ${colors[l.l]}`}><Icon className="size-2.5" />{l.l}</span>
              <span className="text-muted-foreground">[{l.svc}]</span>
              <span>{l.m}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
