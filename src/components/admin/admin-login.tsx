import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/admin";
import { errorMessage } from "@/lib/admin-auth";

type AdminLoginProps = {
  /**
   * Called after a successful sign in. The admin dashboard passes a no-op
   * because it reacts to Supabase's auth listener; rendered on its own, the
   * form falls back to going to /admin.
   */
  onSuccess?: () => void;
};

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await signIn(email.trim(), password);

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.replace("/admin");
      }
    } catch (err) {
      setError(errorMessage(err, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page admin-center">
      <section className="admin-login-card">
        <div className="admin-eyebrow">PORTFOLIO CMS · SECURE ACCESS</div>

        <h1 className="admin-login-title">Admin</h1>

        <p className="admin-muted admin-login-description">
          Sign in to manage your portfolio content.
        </p>

        <form onSubmit={submit} className="admin-form">
          <label>
            <span>Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              autoFocus
              required
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="admin-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-primary-button"
          >
            {loading ? "AUTHENTICATING…" : "SIGN IN"}
          </button>
        </form>

        <a href="/" className="admin-back">
          ← Return to portfolio
        </a>
      </section>
    </main>
  );
}
