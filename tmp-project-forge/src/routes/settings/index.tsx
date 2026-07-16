import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/settings/")({ component: () => <Placeholder title="Configuración" desc="Equipo, API tokens, billing, integraciones y branding." /> });
