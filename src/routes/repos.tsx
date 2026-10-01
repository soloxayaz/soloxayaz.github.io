import { createFileRoute } from "@tanstack/react-router";
import { ReposBoard } from "@/components/repos-board";

export const Route = createFileRoute("/repos")({
  head: () => ({ meta: [{ title: "repos · the great ayaz" }] }),
  component: ReposPage,
});

function ReposPage() {
  return (
    <main>
      <ReposBoard />
    </main>
  );
}
