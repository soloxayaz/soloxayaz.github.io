import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/projects";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [{ title: "work · the great ayaz" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <main>
      <Projects />
    </main>
  );
}
