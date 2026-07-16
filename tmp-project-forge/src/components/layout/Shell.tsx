import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children, crumbs, action }: { children: React.ReactNode; crumbs?: string[]; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar crumbs={crumbs} action={action} />
        <main className="flex-1 bg-mesh">{children}</main>
      </div>
    </div>
  );
}
