import { SistemaShell } from "@/components/sistema/SistemaShell";
import EconoApp from "@/modules/econo/EconoApp";

// The ECONO module is the full tournament simulator migrated from the econo project.
// It runs as a self-contained React subtree inside the sistema shell.
export default function EconoView() {
  return (
    <SistemaShell title="ECONO 2026">
      <EconoApp />
    </SistemaShell>
  );
}
