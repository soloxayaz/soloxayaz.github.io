import { createFileRoute } from "@tanstack/react-router";
import { Skills } from "@/components/skills";

export const Route = createFileRoute("/skills")({
  head: () => ({ meta: [{ title: "skills · the great ayaz" }] }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <main>
      <Skills />
    </main>
  );
}
