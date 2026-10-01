import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "contact · the great ayaz" }] }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
