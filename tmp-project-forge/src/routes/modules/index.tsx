import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import {
  Search, Star, Download, Settings2, ArrowUpCircle, ShoppingCart, Boxes, Briefcase,
  BarChart3, Sparkles, Calendar, Wrench, MessageCircle, FileText, Receipt, Users, TrendingUp
} from "lucide-react";

export const Route = createFileRoute("/modules/")({ component: Marketplace });

const cats = ["Todos", "Operación", "Administración", "Analítica", "Inteligencia Artificial", "Integraciones"];

const featured = {
  name: "AI Assistant Pro",
  desc: "Copilot conversacional embebido. Resúmenes automáticos, generación de reportes y análisis predictivo sobre tus datos.",
  v: "1.0.0", cat: "Inteligencia Artificial",
};

const items = [
  { name: "Ventas", desc: "POS, cotizaciones y embudo comercial.", v: "3.2.0", cat: "Operación", icon: ShoppingCart, installed: true, rating: 4.9, installs: "142" },
  { name: "Arriendos", desc: "Contratos, cobros y renovaciones automáticas.", v: "2.1.4", cat: "Operación", icon: Calendar, installed: false, rating: 4.7, installs: "38" },
  { name: "Inventario", desc: "Stock multi-bodega con reposición.", v: "4.0.2", cat: "Operación", icon: Boxes, installed: true, rating: 4.8, installs: "96" },
  { name: "CRM", desc: "Pipeline, contactos y automatizaciones.", v: "3.6.0", cat: "Administración", icon: Users, installed: true, rating: 4.9, installs: "128", update: true },
  { name: "Facturación Electrónica", desc: "Integración SII Chile y México.", v: "5.1.0", cat: "Administración", icon: Receipt, installed: true, rating: 4.6, installs: "104" },
  { name: "RRHH", desc: "Personal, contratos y liquidaciones.", v: "2.2.0", cat: "Administración", icon: Briefcase, installed: false, rating: 4.5, installs: "62" },
  { name: "Mantenciones", desc: "Tickets, OTs y SLA.", v: "1.4.0", cat: "Operación", icon: Wrench, installed: false, rating: 4.4, installs: "29" },
  { name: "Reportes", desc: "Plantillas, schedule y export.", v: "2.0.0", cat: "Analítica", icon: FileText, installed: true, rating: 4.7, installs: "64" },
  { name: "Business Intelligence", desc: "Cubos OLAP y dashboards.", v: "1.5.2", cat: "Analítica", icon: BarChart3, installed: false, rating: 4.8, installs: "47" },
  { name: "AI Reports", desc: "Resúmenes generados por LLM.", v: "0.7.0-beta", cat: "Inteligencia Artificial", icon: Sparkles, installed: false, rating: 4.6, installs: "21" },
  { name: "AI Predictions", desc: "Forecast de ventas y demanda.", v: "0.5.0-alpha", cat: "Inteligencia Artificial", icon: TrendingUp, installed: false, rating: 4.3, installs: "9" },
  { name: "WhatsApp", desc: "Integración Cloud API + plantillas.", v: "1.2.0", cat: "Integraciones", icon: MessageCircle, installed: false, rating: 4.5, installs: "73" },
];

function Marketplace() {
  const [cat, setCat] = useState("Todos");
  const list = cat === "Todos" ? items : items.filter(i => i.cat === cat);

  return (
    <Shell crumbs={["Marketplace", "Módulos"]}>
      <div className="p-6 space-y-5 max-w-[1600px]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Marketplace de módulos</h1>
          <p className="text-sm text-muted-foreground mt-1">Funcionalidades de negocio listas para instalar en cualquier proyecto.</p>
        </div>

        {/* Featured */}
        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <Badge tone="primary" className="mb-3"><Sparkles className="size-2.5" />Destacado</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">{featured.name}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">{featured.desc}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono">v{featured.v}</span><span>·</span>
                <span>{featured.cat}</span><span>·</span>
                <span className="flex items-center gap-1"><Star className="size-3 fill-warning text-warning" />4.9</span>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 shadow-glow"><Download className="size-3.5" />Instalar</button>
                <button className="h-9 px-4 rounded-md border border-border text-sm hover:bg-surface">Ver detalles</button>
              </div>
            </div>
            <div className="size-32 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="size-14 text-primary-foreground" />
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 h-9 px-2.5 rounded-md bg-surface border border-border w-72">
            <Search className="size-3.5 text-muted-foreground" />
            <input placeholder="Buscar módulos…" className="bg-transparent text-xs outline-none flex-1" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`h-8 px-3 text-xs rounded-md transition ${cat === c ? "bg-surface border border-border-strong text-foreground" : "text-muted-foreground hover:bg-surface"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map(m => (
            <Card key={m.name} className="p-5 hover:border-border-strong transition group">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl bg-gradient-to-br from-surface to-surface-hover border border-border grid place-items-center group-hover:border-primary/30 transition">
                  <m.icon className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold truncate">{m.name}</h3>
                    {m.update && <Badge tone="warning">update</Badge>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.cat} · v{m.v}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{m.desc}</p>

              <div className="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="size-2.5 fill-warning text-warning" />{m.rating}</span>
                <span>·</span>
                <span>{m.installs} instalaciones</span>
              </div>

              <div className="mt-4 flex gap-2">
                {m.installed ? (
                  <>
                    <button className="flex-1 h-8 text-xs rounded-md border border-border hover:bg-surface flex items-center justify-center gap-1.5"><Settings2 className="size-3" />Configurar</button>
                    {m.update && <button className="h-8 px-3 text-xs rounded-md bg-warning/10 border border-warning/20 text-warning flex items-center gap-1.5"><ArrowUpCircle className="size-3" />Actualizar</button>}
                  </>
                ) : (
                  <button className="flex-1 h-8 text-xs rounded-md bg-primary text-primary-foreground font-medium flex items-center justify-center gap-1.5"><Download className="size-3" />Instalar</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
