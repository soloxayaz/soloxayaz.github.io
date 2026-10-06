import { useState } from "react";
import { signIn } from "@/lib/admin";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await signIn(email.trim(), password);

      window.location.replace("/admin");
    } catch (err) {
      setLoading(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    }
  }

  return (
    <main className="admin-page admin-center">
      <section className="admin-login-card">
        <div className="admin-eyebrow">
          PORTFOLIO CMS · SECURE ACCESS
        </div>

        <h1 className="admin-login-title">
          Admin
        </h1>

        <p className="admin-muted admin-login-description">
          Sign in to manage your portfolio content.
        </p>

        <form
          onSubmit={submit}
          className="admin-form"
        >
          <label>
            <span>Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-primary-button"
          >
            {loading
              ? "AUTHENTICATING…"
              : "SIGN IN"}
          </button>
        </form>

        <a
          href="/"
          className="admin-back"
        >
          ← Return to portfolio
        </a>
      </section>
    </main>
  );
}
