import { signOut } from "@/lib/admin";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminPanel } from "@/components/admin/admin-panel";
import { useAdminAuth } from "@/components/admin/use-admin-auth";

function AdminVerifying() {
  return (
    <main className="admin-page admin-center">
      <div className="admin-loading">
        <span className="admin-dot" />
        Verifying session…
      </div>
    </main>
  );
}

function AdminDenied({ title, message }: { title: string; message: string }) {
  return (
    <main className="admin-page admin-center">
      <section className="admin-denied">
        <div className="admin-eyebrow">ACCESS DENIED</div>

        <h1>{title}</h1>

        <p>{message}</p>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            void signOut().catch(() => undefined);
          }}
        >
          SIGN OUT
        </button>
      </section>
    </main>
  );
}

/**
 * Auth gate for /admin.
 *
 * - No stored session: the login form is the very first frame.
 * - Stored session: a short "Verifying session…" until Supabase answers.
 * - Signed in as the admin: the panel, which loads its own data inline.
 * - Signed in as anyone else: access denied.
 */
export function AdminDashboard() {
  const phase = useAdminAuth();

  switch (phase.status) {
    case "login":
      return <AdminLogin onSuccess={() => undefined} />;

    case "verifying":
      return <AdminVerifying />;

    case "denied":
      return (
        <AdminDenied
          title="Not authorized"
          message={`Signed in as ${phase.email}. This account is not authorized for the portfolio CMS.`}
        />
      );

    case "error":
      return <AdminDenied title="Admin unavailable" message={phase.message} />;

    case "ready":
      return <AdminPanel email={phase.email} />;
  }
}
