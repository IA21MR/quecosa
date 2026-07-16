import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge, StatusDot } from "@/components/ui-bits/Card";
import { Server, Cpu, MemoryStick, HardDrive, MapPin, Activity } from "lucide-react";

export const Route = createFileRoute("/infrastructure/")({ component: Infra });

const nodes = [
  { name: "node-us-east-1a", region: "us-east-1", role: "primary", cpu: 34, ram: 62, disk: 41, status: "healthy" },
  { name: "node-us-east-1b", region: "us-east-1", role: "replica", cpu: 28, ram: 54, disk: 39, status: "healthy" },
  { name: "node-eu-west-2", region: "eu-west-2", role: "primary", cpu: 82, ram: 71, disk: 56, status: "warning" },
  { name: "node-sa-east-1", region: "sa-east-1", role: "primary", cpu: 19, ram: 34, disk: 22, status: "healthy" },
  { name: "node-ap-southeast-1", region: "ap-southeast-1", role: "primary", cpu: 44, ram: 58, disk: 31, status: "healthy" },
  { name: "node-edge-cdn-01", region: "global", role: "edge", cpu: 12, ram: 22, disk: 8, status: "healthy" },
] as const;

function Infra() {
  return (
    <Shell crumbs={["Infraestructura"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Infraestructura</h1>
          <p className="text-sm text-muted-foreground mt-1">32 nodos · 6 regiones · 184 servicios desplegados.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { l: "Nodos activos", v: "32", s: "5 regiones" },
            { l: "Carga promedio", v: "38%", s: "p95 71%" },
            { l: "Tráfico", v: "1.4 TB", s: "últimas 24h" },
            { l: "Costo mes", v: "$3,840", s: "+12% vs mes ant." },
          ].map(s => (
            <Card key={s.l} className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <div className="text-2xl font-semibold mt-1">{s.v}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.s}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Nodos & recursos</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Estado en tiempo real</p>
            </div>
            <Badge tone="success">5/6 healthy</Badge>
          </div>

          <div className="divide-y divide-border">
            {nodes.map(n => (
              <div key={n.name} className="px-5 py-4 grid grid-cols-1 lg:grid-cols-[1.2fr_auto_3fr_auto] items-center gap-5">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-md bg-surface border border-border grid place-items-center">
                    <Server className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium font-mono">{n.name}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="size-2.5" />{n.region} · {n.role}</div>
                  </div>
                </div>

                <Badge tone={n.role === "primary" ? "primary" : n.role === "replica" ? "info" : "default"}>{n.role}</Badge>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { i: Cpu, l: "CPU", v: n.cpu },
                    { i: MemoryStick, l: "RAM", v: n.ram },
                    { i: HardDrive, l: "Disk", v: n.disk },
                  ].map(r => (
                    <div key={r.l}>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><r.i className="size-2.5" />{r.l}</span>
                        <span className="font-mono">{r.v}%</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-surface overflow-hidden">
                        <div className={`h-full rounded-full ${r.v > 75 ? "bg-warning" : "bg-gradient-primary"}`} style={{ width: `${r.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <StatusDot status={n.status} />
                  <span className="capitalize text-muted-foreground">{n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold">Distribución por región</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Tráfico últimas 24h</p>
          <div className="mt-5 space-y-2.5">
            {[
              { r: "us-east-1", v: 42, t: "618 GB" },
              { r: "eu-west-2", v: 28, t: "412 GB" },
              { r: "ap-southeast-1", v: 14, t: "208 GB" },
              { r: "sa-east-1", v: 10, t: "152 GB" },
              { r: "us-west-2", v: 6, t: "88 GB" },
            ].map(r => (
              <div key={r.r} className="flex items-center gap-3">
                <div className="w-32 text-xs font-mono">{r.r}</div>
                <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${r.v}%` }} />
                </div>
                <div className="w-20 text-right text-xs font-mono text-muted-foreground">{r.t}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
