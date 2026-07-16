import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui-bits/Card";
import { Construction } from "lucide-react";

export function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <Shell crumbs={[title]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        <Card className="p-10 mt-6 text-center">
          <Construction className="size-8 text-primary mx-auto" />
          <div className="mt-3 text-sm font-medium">Vista en construcción</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">Este apartado forma parte del mockup. Conserva el lenguaje visual y los componentes del sistema.</p>
        </Card>
      </div>
    </Shell>
  );
}
