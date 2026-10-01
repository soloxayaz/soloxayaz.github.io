import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/about";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "about · the great ayaz" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <About />
    </main>
  );
}
