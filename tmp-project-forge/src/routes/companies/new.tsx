import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, Badge } from "@/components/ui-bits/Card";
import {
  Building2, Boxes, GitBranch, Server, KeyRound, Rocket, Check, ChevronRight,
  Upload, Github, Gitlab, Cloud, Cpu, MemoryStick, HardDrive, Plus, Eye, EyeOff, Trash2,
  CheckCircle2, Loader2, Circle, Terminal
} from "lucide-react";

export const Route = createFileRoute("/companies/new")({ component: Wizard });

const steps = [
  { id: 1, label: "Información", icon: Building2 },
  { id: 2, label: "Módulos", icon: Boxes },
  { id: 3, label: "Repositorio", icon: GitBranch },
  { id: 4, label: "Infraestructura", icon: Server },
  { id: 5, label: "Variables", icon: KeyRound },
  { id: 6, label: "Provisionar", icon: Rocket },
];

function Wizard() {
  const [step, setStep] = useState(1);

  return (
    <Shell crumbs={["Empresas", "Nueva"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Crear nueva empresa</h1>
          <p className="text-sm text-muted-foreground mt-1">Flujo guiado de provisionamiento — toma ~3 minutos.</p>
        </div>

        {/* Stepper */}
        <Card className="p-4 mb-5">
          <ol className="flex items-center">
            {steps.map((s, i) => {
              const done = s.id < step;
              const active = s.id === step;
              return (
                <li key={s.id} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => setStep(s.id)} className="flex items-center gap-2.5 group">
                    <div className={`size-8 rounded-full grid place-items-center border transition ${
                      done ? "bg-primary border-primary text-primary-foreground"
                      : active ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-surface text-muted-foreground"
                    }`}>
                      {done ? <Check className="size-4" /> : <s.icon className="size-3.5" />}
                    </div>
                    <div className="text-left">
                      <div className={`text-[10px] uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>Paso {s.id}</div>
                      <div className={`text-xs font-medium ${active || done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                    </div>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3 h-px bg-border relative">
                      <div className="absolute inset-y-0 left-0 bg-primary transition-all" style={{ width: done ? "100%" : "0%" }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
            {step === 6 && <Step6 />}

            <div className="flex items-center justify-between mt-5">
              <button onClick={() => setStep(Math.max(1, step - 1))} className="h-9 px-4 rounded-md border border-border text-sm hover:bg-surface disabled:opacity-40" disabled={step === 1}>
                Atrás
              </button>
              <div className="flex items-center gap-2">
                <Link to="/companies" className="h-9 px-4 rounded-md text-sm text-muted-foreground hover:text-foreground">Cancelar</Link>
                {step < 6 ? (
                  <button onClick={() => setStep(step + 1)} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 shadow-glow">
                    Continuar <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 shadow-glow">
                    <Rocket className="size-4" /> Lanzar provisionamiento
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side summary */}
          <aside className="space-y-4">
            <Card className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Resumen</div>
              <dl className="space-y-2.5 text-xs">
                {[
                  ["Empresa", "Lumina ERP"],
                  ["Dominio", "lumina.app"],
                  ["Módulos", "8 seleccionados"],
                  ["Repositorio", "github.com/forge/lumina"],
                  ["Infra", "Docker · DigitalOcean"],
                  ["Región", "nyc3 · 2vCPU · 4GB"],
                  ["Variables", "12 definidas"],
                ].map(([k,v]) => (
                  <div key={k} className="flex items-start justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-mono text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-border my-3" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Costo estimado</span>
                <span className="font-mono font-semibold text-base">$48<span className="text-muted-foreground text-xs font-normal">/mes</span></span>
              </div>
            </Card>

            <Card className="p-4 bg-surface/40">
              <div className="flex items-start gap-2.5">
                <div className="size-7 rounded-md bg-primary/10 border border-primary/20 grid place-items-center text-primary">
                  <Rocket className="size-3.5" />
                </div>
                <div>
                  <div className="text-xs font-medium">Provisionamiento automático</div>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Al confirmar, Forge creará el repositorio, configurará Docker, ejecutará migraciones y desplegará la primera versión.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium flex items-center justify-between">
        <span>{label}</span>{hint && <span className="text-[10px] text-muted-foreground font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const input = "w-full h-9 px-3 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground";

function Step1() {
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Información general</h2>
      <p className="text-xs text-muted-foreground mt-1">Datos básicos del tenant.</p>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <Field label="Nombre empresa"><input className={input} defaultValue="Lumina ERP" /></Field>
        <Field label="Razón social"><input className={input} defaultValue="Lumina Software S.A." /></Field>
        <Field label="Dominio principal" hint="usado para subdominios"><input className={input} defaultValue="lumina.app" /></Field>
        <Field label="Correo de contacto"><input className={input} defaultValue="ops@lumina.app" /></Field>
        <div className="col-span-2">
          <Field label="Logo de la empresa" hint="SVG · PNG · max 2MB">
            <div className="h-28 rounded-md border-2 border-dashed border-border bg-surface/50 grid place-items-center text-xs text-muted-foreground hover:border-primary/50 transition cursor-pointer">
              <div className="text-center">
                <Upload className="size-5 mx-auto mb-1.5 text-muted-foreground" />
                Arrastra el logo o haz click para subir
              </div>
            </div>
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Observaciones">
            <textarea rows={3} className={input + " h-auto py-2"} placeholder="Notas internas, requerimientos especiales…" />
          </Field>
        </div>
      </div>
    </Card>
  );
}

const modules = [
  { cat: "Operación", color: "primary", items: [
    { name: "Ventas", desc: "POS, cotizaciones, facturas", v: "3.2.0", deps: 2 },
    { name: "Arriendos", desc: "Gestión de contratos y cobros", v: "2.1.4", deps: 3 },
    { name: "Reservas", desc: "Calendario y disponibilidad", v: "1.8.0", deps: 1 },
    { name: "Compras", desc: "Órdenes de compra y proveedores", v: "2.4.1", deps: 2 },
    { name: "Inventario", desc: "Stock multi-bodega", v: "4.0.2", deps: 1 },
  ]},
  { cat: "Administración", color: "info", items: [
    { name: "Facturación", desc: "Facturación electrónica SII", v: "5.1.0", deps: 2 },
    { name: "CRM", desc: "Pipeline, contactos y deals", v: "3.6.0", deps: 0 },
    { name: "RRHH", desc: "Personal, contratos y liquidaciones", v: "2.2.0", deps: 1 },
    { name: "Mantenciones", desc: "Tickets y órdenes de trabajo", v: "1.4.0", deps: 1 },
  ]},
  { cat: "Analítica", color: "warning", items: [
    { name: "Reportes", desc: "Plantillas y exportación", v: "2.0.0", deps: 0 },
    { name: "BI", desc: "Cubos OLAP y dashboards", v: "1.5.2", deps: 1 },
    { name: "Analytics", desc: "Eventos y embudos", v: "3.1.0", deps: 0 },
  ]},
  { cat: "Inteligencia Artificial", color: "primary", items: [
    { name: "AI Assistant", desc: "Copilot embebido", v: "0.9.0-beta", deps: 2 },
    { name: "AI Reports", desc: "Resúmenes automáticos", v: "0.7.0-beta", deps: 1 },
    { name: "AI Predictions", desc: "Forecast de ventas", v: "0.5.0-alpha", deps: 2 },
  ]},
];

function Step2() {
  const [sel, setSel] = useState<string[]>(["Ventas","Inventario","Facturación","CRM","Reportes","BI","AI Assistant","RRHH"]);
  const toggle = (n: string) => setSel(s => s.includes(n) ? s.filter(x => x !== n) : [...s, n]);

  return (
    <Card className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold">Selección de módulos</h2>
          <p className="text-xs text-muted-foreground mt-1">Elige las capacidades a instalar — siempre pueden añadirse después.</p>
        </div>
        <Badge tone="primary">{sel.length} seleccionados</Badge>
      </div>

      <div className="mt-5 space-y-6">
        {modules.map((g) => (
          <div key={g.cat}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="text-xs font-semibold">{g.cat}</div>
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground">{g.items.length} disponibles</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {g.items.map((m) => {
                const active = sel.includes(m.name);
                return (
                  <button key={m.name} onClick={() => toggle(m.name)} className={`text-left p-3 rounded-lg border transition group ${
                    active ? "border-primary bg-primary/5 shadow-card" : "border-border bg-surface/40 hover:border-border-strong"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="size-7 rounded-md bg-surface border border-border grid place-items-center">
                        <Boxes className={`size-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className={`size-4 rounded border grid place-items-center transition ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <Check className="size-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="mt-2.5 text-sm font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{m.desc}</div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="font-mono">v{m.v}</span>
                      <span>·</span>
                      <span>{m.deps} deps</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Step3() {
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Repositorio</h2>
      <p className="text-xs text-muted-foreground mt-1">Selecciona el proveedor y configura el repositorio base.</p>

      <div className="grid grid-cols-3 gap-2.5 mt-5">
        {[
          { name: "GitHub", icon: Github, sel: true, org: "forge-platform" },
          { name: "GitLab", icon: Gitlab, sel: false, org: "forge/group" },
          { name: "Bitbucket", icon: GitBranch, sel: false, org: "forge-team" },
        ].map((p) => (
          <button key={p.name} className={`p-4 rounded-lg border text-left transition ${p.sel ? "border-primary bg-primary/5 shadow-card" : "border-border bg-surface/40 hover:border-border-strong"}`}>
            <p.icon className={`size-5 ${p.sel ? "text-primary" : "text-muted-foreground"}`} />
            <div className="mt-2 text-sm font-medium">{p.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.org}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <Field label="Nombre del repositorio"><input className={input} defaultValue="lumina-erp-platform" /></Field>
        <Field label="Organización"><input className={input} defaultValue="forge-platform" /></Field>
        <Field label="Branch principal"><input className={input} defaultValue="main" /></Field>
        <Field label="Visibilidad">
          <div className="flex gap-2">
            <button className="flex-1 h-9 rounded-md border border-primary bg-primary/5 text-xs font-medium text-primary">Privado</button>
            <button className="flex-1 h-9 rounded-md border border-border text-xs text-muted-foreground hover:bg-surface">Público</button>
          </div>
        </Field>
      </div>

      {/* Repo preview */}
      <div className="mt-5 rounded-lg border border-border bg-surface/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/60">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-destructive/70" />
            <div className="size-2.5 rounded-full bg-warning/70" />
            <div className="size-2.5 rounded-full bg-success/70" />
          </div>
          <div className="text-[11px] text-muted-foreground font-mono ml-2">github.com/forge-platform/lumina-erp-platform</div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            {[".github/", "apps/", "packages/", "infra/", "docker/", "scripts/"].map(f => (
              <div key={f} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface">
                <div className="size-3.5 rounded-sm bg-info/20" /><span className="font-mono">{f}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {["README.md", "package.json", "docker-compose.yml", ".env.example", "turbo.json"].map(f => (
              <div key={f} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface">
                <div className="size-3.5 rounded-sm bg-muted-foreground/20" /><span className="font-mono">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Step4() {
  const providers = [
    { name: "VPS", desc: "Bare metal", icon: Server },
    { name: "Docker", desc: "Self-hosted", icon: Boxes, sel: true },
    { name: "Kubernetes", desc: "K8s cluster", icon: Cloud },
    { name: "DigitalOcean", desc: "Droplets", icon: Cloud, sel: true },
    { name: "AWS", desc: "EC2 + ECS", icon: Cloud },
    { name: "Azure", desc: "App Service", icon: Cloud },
  ];
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Infraestructura</h2>
      <p className="text-xs text-muted-foreground mt-1">Selecciona el entorno y dimensiona los recursos.</p>

      <div className="grid grid-cols-3 gap-2.5 mt-5">
        {providers.map(p => (
          <button key={p.name} className={`p-3 rounded-lg border text-left transition ${p.sel ? "border-primary bg-primary/5 shadow-card" : "border-border bg-surface/40 hover:border-border-strong"}`}>
            <div className="flex items-center gap-2">
              <p.icon className={`size-4 ${p.sel ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{p.name}</span>
              {p.sel && <Check className="size-3 ml-auto text-primary" />}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{p.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        {[
          { icon: Cpu, label: "CPU", val: "2 vCPU", range: 40 },
          { icon: MemoryStick, label: "RAM", val: "4 GB", range: 30 },
          { icon: HardDrive, label: "Disco", val: "80 GB SSD", range: 25 },
        ].map(r => (
          <div key={r.label} className="p-4 rounded-lg border border-border bg-surface/40">
            <div className="flex items-center gap-2 text-xs">
              <r.icon className="size-3.5 text-primary" />
              <span className="text-muted-foreground">{r.label}</span>
              <span className="ml-auto font-mono font-medium">{r.val}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-background overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: `${r.range}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>min</span><span>max</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <Field label="Región">
          <select className={input}>
            <option>nyc3 — New York</option><option>sfo3 — San Francisco</option>
            <option>ams3 — Amsterdam</option><option>fra1 — Frankfurt</option>
          </select>
        </Field>
        <Field label="Dominio" hint="se generará SSL automáticamente"><input className={input} defaultValue="app.lumina.app" /></Field>
      </div>

      <div className="mt-5 p-4 rounded-lg border border-border bg-gradient-to-br from-surface to-surface/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Costo estimado mensual</div>
            <div className="text-2xl font-semibold mt-1">$48.00 <span className="text-xs text-muted-foreground font-normal">USD/mes</span></div>
          </div>
          <div className="text-right text-[10px] text-muted-foreground space-y-0.5">
            <div>Compute: $24</div><div>Storage: $8</div><div>Bandwidth: $12</div><div>SSL+DNS: $4</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Step5() {
  const vars = [
    { k: "DATABASE_URL", v: "postgres://••••••••@db:5432/lumina", scope: "secret" },
    { k: "REDIS_URL", v: "redis://cache:6379/0", scope: "private" },
    { k: "NEXT_PUBLIC_API_URL", v: "https://api.lumina.app", scope: "public" },
    { k: "JWT_SECRET", v: "••••••••••••••••••••••••", scope: "secret" },
    { k: "STRIPE_SECRET_KEY", v: "sk_live_••••••••••••", scope: "secret" },
    { k: "OPENAI_API_KEY", v: "sk-proj-••••••••••••", scope: "secret" },
    { k: "SENTRY_DSN", v: "https://o123.ingest.sentry.io/4567", scope: "private" },
    { k: "FEATURE_AI_REPORTS", v: "true", scope: "public" },
  ];
  return (
    <Card className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold">Variables de entorno</h2>
          <p className="text-xs text-muted-foreground mt-1">Configura valores, secretos y tokens.</p>
        </div>
        <div className="flex gap-2">
          <button className="h-8 px-2.5 text-xs rounded-md border border-border hover:bg-surface flex items-center gap-1.5"><Upload className="size-3.5" />Importar .env</button>
          <button className="h-8 px-2.5 text-xs rounded-md bg-primary text-primary-foreground flex items-center gap-1.5"><Plus className="size-3.5" />Añadir</button>
        </div>
      </div>

      <div className="mt-5 flex gap-1 text-xs">
        {["Todas (12)", "Public (3)", "Private (4)", "Secrets (5)"].map((t, i) => (
          <button key={t} className={`h-8 px-2.5 rounded-md ${i === 0 ? "bg-surface border border-border" : "text-muted-foreground hover:bg-surface"}`}>{t}</button>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-border overflow-hidden">
        {vars.map((v, i) => (
          <div key={v.k} className={`grid grid-cols-[1.2fr_2fr_auto_auto] items-center gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-border" : ""} hover:bg-surface/60`}>
            <div className="font-mono text-xs">{v.k}</div>
            <div className="font-mono text-xs text-muted-foreground truncate">{v.v}</div>
            <Badge tone={v.scope === "secret" ? "error" : v.scope === "private" ? "warning" : "info"}>{v.scope}</Badge>
            <div className="flex gap-0.5">
              <button className="size-7 grid place-items-center rounded hover:bg-surface-hover text-muted-foreground">{v.scope === "secret" ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}</button>
              <button className="size-7 grid place-items-center rounded hover:bg-surface-hover text-muted-foreground"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Step6() {
  const tasks = [
    { name: "Crear repositorio", status: "done", time: "1.2s" },
    { name: "Clonar template base", status: "done", time: "3.4s" },
    { name: "Instalar módulos seleccionados", status: "done", time: "12.8s" },
    { name: "Generar configuración Docker", status: "done", time: "0.8s" },
    { name: "Crear variables de entorno", status: "done", time: "0.4s" },
    { name: "Configurar servidor", status: "running", time: "..." },
    { name: "Configurar DNS y SSL", status: "pending", time: "" },
    { name: "Ejecutar migraciones", status: "pending", time: "" },
    { name: "Crear usuario administrador", status: "pending", time: "" },
    { name: "Ejecutar deployment inicial", status: "pending", time: "" },
    { name: "Validar servicios", status: "pending", time: "" },
    { name: "Proyecto listo", status: "pending", time: "" },
  ] as const;
  const done = tasks.filter(t => t.status === "done").length;
  const pct = (done / tasks.length) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-br from-surface to-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-primary/10 border border-primary/20 grid place-items-center text-primary">
                <Rocket className="size-4" />
              </div>
              <h2 className="text-base font-semibold">Provisionamiento en curso</h2>
              <Badge tone="primary" className="ml-2"><Loader2 className="size-2.5 animate-spin" />En vivo</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Lumina ERP · iniciado hace 18 segundos · ETA ~2m 12s restantes</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold tracking-tight">{Math.round(pct)}<span className="text-base text-muted-foreground">%</span></div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{done}/{tasks.length} tareas</div>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-background overflow-hidden">
          <div className="h-full bg-gradient-primary relative overflow-hidden" style={{ width: `${pct}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
        <ol className="p-4">
          {tasks.map((t, i) => (
            <li key={t.name} className="flex items-center gap-3 py-2">
              <div className="relative">
                {t.status === "done" && <div className="size-6 rounded-full bg-primary/10 border border-primary/30 grid place-items-center"><CheckCircle2 className="size-3.5 text-primary" /></div>}
                {t.status === "running" && <div className="size-6 rounded-full bg-primary/10 border border-primary/30 grid place-items-center shadow-glow"><Loader2 className="size-3.5 text-primary animate-spin" /></div>}
                {t.status === "pending" && <div className="size-6 rounded-full bg-surface border border-border grid place-items-center"><Circle className="size-3 text-muted-foreground/50" /></div>}
                {i < tasks.length - 1 && <div className="absolute left-1/2 -translate-x-1/2 top-6 w-px h-2 bg-border" />}
              </div>
              <div className="flex-1 text-xs">
                <span className={t.status === "pending" ? "text-muted-foreground" : "text-foreground font-medium"}>{t.name}</span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">{t.time}</div>
            </li>
          ))}
        </ol>

        <div className="bg-background/60">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
            <Terminal className="size-3.5" /> Logs en vivo
            <span className="ml-auto flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success animate-pulse" />streaming</span>
          </div>
          <div className="font-mono text-[11px] leading-relaxed p-4 space-y-1 max-h-[380px] overflow-auto scrollbar-thin">
            {[
              ["12:04:01", "INFO", "→ git init / repo created at github.com/forge-platform/lumina-erp"],
              ["12:04:03", "INFO", "→ template 'enterprise-saas-base@v4.2' cloned"],
              ["12:04:08", "INFO", "→ installing modules: ventas, inventario, billing, crm..."],
              ["12:04:14", "DEBUG", "  resolved 142 dependencies"],
              ["12:04:18", "INFO", "→ generated docker-compose.yml (8 services)"],
              ["12:04:19", "INFO", "→ writing .env (12 vars, 5 secrets encrypted)"],
              ["12:04:20", "INFO", "→ provisioning droplet 's-2vcpu-4gb' in nyc3"],
              ["12:04:21", "WARN", "  retry: DO API rate limit, backing off 200ms"],
              ["12:04:22", "INFO", "  droplet 412938127 created · 138.197.42.18"],
              ["12:04:23", "INFO", "→ ssh provisioning user 'forge' + sudoers"],
            ].map((l, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground/60">{l[0]}</span>
                <span className={l[1] === "WARN" ? "text-warning" : l[1] === "ERROR" ? "text-destructive" : l[1] === "DEBUG" ? "text-muted-foreground" : "text-info"}>{l[1]}</span>
                <span>{l[2]}</span>
              </div>
            ))}
            <div className="flex gap-2">
              <span className="text-muted-foreground/60">12:04:24</span>
              <span className="text-info">INFO</span>
              <span>→ configuring nginx reverse proxy<span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse align-middle" /></span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
