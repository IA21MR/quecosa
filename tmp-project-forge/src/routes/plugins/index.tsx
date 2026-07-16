import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import { Database, Activity, Search, Boxes, BarChart3, Gauge, HardDrive, Network, Shuffle, Download, Settings2 } from "lucide-react";

export const Route = createFileRoute("/plugins/")({ component: Plugins });

const plugins = [
  { name: "PostgreSQL", desc: "Relational database, hot-standby ready.", icon: Database, color: "from-sky-500 to-indigo-500", v: "16.2", cat: "Database", installed: true },
  { name: "Redis", desc: "In-memory cache & pub/sub.", icon: Activity, color: "from-red-500 to-rose-500", v: "7.2", cat: "Cache", installed: true },
  { name: "Elasticsearch", desc: "Full-text & vector search.", icon: Search, color: "from-yellow-500 to-amber-500", v: "8.13", cat: "Search", installed: false },
  { name: "RabbitMQ", desc: "Message broker AMQP 1.0.", icon: Boxes, color: "from-orange-500 to-red-500", v: "3.13", cat: "Queue", installed: false },
  { name: "Grafana", desc: "Observability dashboards.", icon: BarChart3, color: "from-orange-400 to-pink-500", v: "10.4", cat: "Observability", installed: true },
  { name: "Prometheus", desc: "Metrics + alertmanager.", icon: Gauge, color: "from-orange-500 to-amber-500", v: "2.51", cat: "Observability", installed: true },
  { name: "MinIO", desc: "S3-compatible object storage.", icon: HardDrive, color: "from-rose-500 to-red-600", v: "RELEASE.2024", cat: "Storage", installed: false },
  { name: "Nginx", desc: "Reverse proxy & load balancer.", icon: Network, color: "from-emerald-500 to-green-600", v: "1.27", cat: "Network", installed: true },
  { name: "Traefik", desc: "Cloud-native edge router.", icon: Shuffle, color: "from-blue-500 to-cyan-500", v: "3.0", cat: "Network", installed: false },
];

function Plugins() {
  return (
    <Shell crumbs={["Marketplace", "Plugins"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Marketplace de plugins</h1>
            <p className="text-sm text-muted-foreground mt-1">Servicios técnicos · self-hosted · listos para conectar.</p>
          </div>
          <div className="flex gap-1">
            {["All", "Database", "Cache", "Queue", "Observability", "Storage", "Network"].map((c, i) => (
              <button key={c} className={`h-8 px-2.5 text-xs rounded-md ${i === 0 ? "bg-surface border border-border" : "text-muted-foreground hover:bg-surface"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {plugins.map(p => (
            <Card key={p.name} className="p-5 hover:border-border-strong transition group">
              <div className="flex items-start gap-3">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${p.color} grid place-items-center shadow-card`}>
                  <p.icon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{p.name}</h3>
                    {p.installed && <Badge tone="success">running</Badge>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{p.cat} · v{p.v}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{p.desc}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 rounded bg-surface/60 border border-border">
                  <div className="text-muted-foreground">CPU</div>
                  <div className="font-mono font-medium mt-0.5">{p.installed ? "12%" : "—"}</div>
                </div>
                <div className="p-2 rounded bg-surface/60 border border-border">
                  <div className="text-muted-foreground">RAM</div>
                  <div className="font-mono font-medium mt-0.5">{p.installed ? "284MB" : "—"}</div>
                </div>
                <div className="p-2 rounded bg-surface/60 border border-border">
                  <div className="text-muted-foreground">I/O</div>
                  <div className="font-mono font-medium mt-0.5">{p.installed ? "1.2k/s" : "—"}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {p.installed ? (
                  <button className="flex-1 h-8 text-xs rounded-md border border-border hover:bg-surface flex items-center justify-center gap-1.5"><Settings2 className="size-3" />Configurar</button>
                ) : (
                  <button className="flex-1 h-8 text-xs rounded-md bg-primary text-primary-foreground font-medium flex items-center justify-center gap-1.5"><Download className="size-3" />Desplegar</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
