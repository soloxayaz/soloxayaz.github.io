import { createFileRoute } from "@tanstack/react-router";
import { Assets } from "@/components/assets";

export const Route = createFileRoute("/assets")({
  head: () => ({ meta: [{ title: "assets · the great ayaz" }] }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <main>
      <Assets />
    </main>
  );
}
