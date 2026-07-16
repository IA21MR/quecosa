import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, StatusDot, Badge } from "@/components/ui-bits/Card";
import {
  Building2, FolderGit2, Rocket, Server, GitBranch, Package,
  TrendingUp, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle,
  GitCommit, Box, Activity, Zap, Database, Globe, HardDrive
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

const kpis = [
  { label: "Empresas activas", value: "47", delta: "+12%", icon: Building2, tone: "primary" },
  { label: "Proyectos desplegados", value: "184", delta: "+8.2%", icon: FolderGit2, tone: "info" },
  { label: "Deploys exitosos", value: "1,294", delta: "+24%", icon: Rocket, tone: "primary" },
  { label: "Servidores activos", value: "32", delta: "+3", icon: Server, tone: "warning" },
  { label: "Repositorios creados", value: "212", delta: "+18", icon: GitBranch, tone: "info" },
  { label: "Módulos instalados", value: "1,847", delta: "+96", icon: Package, tone: "primary" },
];

const activity = [
  { type: "deploy", icon: Rocket, title: "Deploy #v2.14.0 ejecutado", target: "acme-corp / production", time: "hace 2 min", status: "healthy" },
  { type: "create", icon: FolderGit2, title: "Proyecto creado", target: "lumina-erp · workspace inicial", time: "hace 14 min", status: "healthy" },
  { type: "module", icon: Package, title: "Módulo instalado", target: "billing@2.4.1 → northwind-co", time: "hace 32 min", status: "healthy" },
  { type: "error", icon: XCircle, title: "Error en pipeline", target: "atlas-saas · build #382", time: "hace 1 h", status: "error" },
  { type: "module", icon: GitCommit, title: "Migración aplicada", target: "20240517_add_audit_log", time: "hace 1 h", status: "healthy" },
  { type: "warning", icon: AlertTriangle, title: "CPU > 80% sostenido", target: "node-eu-west-2", time: "hace 2 h", status: "warning" },
] as const;

const services = [
  { name: "Frontend", desc: "Vercel · CDN", status: "healthy" as const, icon: Globe },
  { name: "Backend API", desc: "Node 20 · Fastify", status: "healthy" as const, icon: Zap },
  { name: "PostgreSQL", desc: "Primary · 14.10", status: "healthy" as const, icon: Database },
  { name: "Redis", desc: "Cache cluster", status: "warning" as const, icon: Activity },
  { name: "Storage", desc: "S3 + MinIO", status: "healthy" as const, icon: HardDrive },
  { name: "DNS / Edge", desc: "Cloudflare", status: "healthy" as const, icon: Globe },
];

function Sparkline({ values, color = "var(--color-primary)" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 100, h = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7">
      <defs>
        <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.join(" ")} />
      <polygon fill="url(#sp)" points={`0,${h} ${pts.join(" ")} ${w},${h}`} />
    </svg>
  );
}

const sparks = [
  [4, 8, 6, 12, 10, 14, 18, 16, 22, 24, 28, 32],
  [12, 14, 10, 18, 22, 19, 26, 30, 28, 34, 32, 40],
  [80, 92, 88, 102, 110, 105, 124, 130, 128, 145, 160, 174],
  [22, 24, 25, 26, 28, 27, 29, 30, 31, 30, 32, 32],
  [40, 44, 50, 58, 70, 82, 96, 112, 130, 152, 178, 212],
  [200, 240, 320, 380, 470, 590, 720, 870, 1020, 1240, 1480, 1847],
];

function MonthlyChart() {
  const data = [12, 18, 14, 22, 28, 24, 32, 38, 30, 42, 46, 54];
  const max = Math.max(...data);
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return (
    <div className="px-5 pb-5">
      <div className="flex items-end gap-2 h-44">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition">{v}</div>
            <div className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary relative overflow-hidden" style={{ height: `${(v / max) * 100}%` }}>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
            </div>
            <div className="text-[10px] text-muted-foreground">{months[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeploysHeatmap() {
  const days = Array.from({ length: 7 * 14 }, () => Math.floor(Math.random() * 5));
  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-[repeat(14,_1fr)] gap-1">
        {days.map((d, i) => (
          <div key={i} className="aspect-square rounded-sm" style={{
            backgroundColor: d === 0 ? "var(--color-surface)"
              : d === 1 ? "oklch(0.78 0.17 152 / 0.2)"
              : d === 2 ? "oklch(0.78 0.17 152 / 0.4)"
              : d === 3 ? "oklch(0.78 0.17 152 / 0.7)"
              : "oklch(0.78 0.17 152)"
          }} />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
        <span>14 semanas</span>
        <div className="flex items-center gap-1.5">
          <span>Menos</span>
          {[0,1,2,3,4].map(l => (
            <div key={l} className="size-2.5 rounded-sm" style={{ backgroundColor: l === 0 ? "var(--color-surface)" : `oklch(0.78 0.17 152 / ${0.2 * l})` }} />
          ))}
          <span>Más</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <Shell crumbs={["Dashboard"]}>
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Estado en tiempo real de la plataforma de provisioning.</p>
          </div>
          <div className="flex items-center gap-2">
            {["24h", "7d", "30d", "90d"].map((r, i) => (
              <button key={r} className={`h-7 px-2.5 text-xs rounded-md border ${i === 2 ? "bg-surface border-border-strong text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{r}</button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k, i) => (
            <Card key={k.label} className="p-4 hover:border-border-strong transition group">
              <div className="flex items-start justify-between">
                <div className="size-8 rounded-md bg-surface border border-border grid place-items-center">
                  <k.icon className="size-4 text-muted-foreground group-hover:text-primary transition" />
                </div>
                <Badge tone="success" className="gap-0.5"><TrendingUp className="size-2.5" />{k.delta}</Badge>
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-muted-foreground">{k.label}</div>
                <div className="text-2xl font-semibold tracking-tight mt-0.5">{k.value}</div>
              </div>
              <div className="mt-2 -mx-1">
                <Sparkline values={sparks[i]} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Proyectos creados por mes" desc="Tendencia anual · 2025" action={<Badge tone="primary">+34% YoY</Badge>} />
            <MonthlyChart />
          </Card>

          <Card>
            <CardHeader title="Estado de servicios" desc="Healthchecks live" action={<Badge tone="success">5/6 OK</Badge>} />
            <ul className="px-2 pb-3">
              {services.map((s) => (
                <li key={s.name} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface transition">
                  <div className="size-7 rounded-md bg-surface border border-border grid place-items-center">
                    <s.icon className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <StatusDot status={s.status} />
                    <span className="capitalize">{s.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Actividad reciente" desc="Eventos del workspace" action={
              <Link to="/logs" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">Ver logs<ArrowUpRight className="size-3" /></Link>
            } />
            <ul className="divide-y divide-border">
              {activity.map((a, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-surface/60 transition">
                  <div className={`size-8 rounded-md grid place-items-center border ${
                    a.status === "error" ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : a.status === "warning" ? "bg-warning/10 border-warning/20 text-warning"
                    : "bg-primary/10 border-primary/20 text-primary"
                  }`}>
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{a.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">{a.target}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{a.time}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Deploys por día" desc="Últimas 14 semanas" action={<Badge>1,294 total</Badge>} />
            <DeploysHeatmap />
            <div className="border-t border-border px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Tasa de éxito</div>
                <div className="text-xl font-semibold mt-0.5">98.7%</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success">
                <CheckCircle2 className="size-3.5" />SLO cumplido
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Uso de módulos" desc="Top instalados este mes" action={<Link to="/modules" className="text-xs text-primary hover:underline">Marketplace →</Link>} />
          <div className="px-5 pb-5 space-y-3">
            {[
              { name: "Billing", cat: "Administración", count: 142, pct: 92 },
              { name: "CRM", cat: "Administración", count: 128, pct: 84 },
              { name: "Inventario", cat: "Operación", count: 96, pct: 64 },
              { name: "AI Assistant", cat: "IA", count: 78, pct: 52 },
              { name: "Reportes", cat: "Analítica", count: 64, pct: 42 },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-4">
                <div className="size-9 rounded-md bg-surface border border-border grid place-items-center">
                  <Box className="size-4 text-primary" />
                </div>
                <div className="w-40">
                  <div className="text-xs font-medium">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.cat}</div>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${m.pct}%` }} />
                </div>
                <div className="text-xs font-mono text-muted-foreground w-12 text-right">{m.count}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
