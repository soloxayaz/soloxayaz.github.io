import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PageShell } from "@/components/page-shell";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { NotFound } from "@/components/not-found";
import appCss from "../styles.css?url";

const APP_NAME = "THE GREAT AYAZ — Cybersecurity • Development • Web Design";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Portfolio of Ayaz — cybersecurity enthusiast, ethical hacking learner, web developer, designer, and open-source builder.",
      },
      { name: "theme-color", content: "#0f1216" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Outfit:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootDocument,
});

function AdminAwareShell() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return <Outlet />;
  }

  return (
    <PageShell>
      <Outlet />
    </PageShell>
  );
}

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-paper">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
