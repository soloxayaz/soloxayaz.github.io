import { createFileRoute } from "@tanstack/react-router";
import { Manifesto } from "@/components/manifesto";

export const Route = createFileRoute("/manifesto")({
  head: () => ({ meta: [{ title: "manifesto · the great ayaz" }] }),
  component: ManifestoPage,
});

function ManifestoPage() {
  return (
    <main>
      <Manifesto />
    </main>
  );
}
