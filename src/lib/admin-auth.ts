/**
 * Pure admin-access decision, kept free of imports so it can be unit tested.
 *
 * This only decides what the UI shows. Real enforcement is Supabase Auth plus
 * the row level security policies on the database.
 */

export type AdminPhase =
  | { status: "login" }
  | { status: "verifying" }
  | { status: "denied"; email: string }
  | { status: "ready"; email: string }
  | { status: "error"; message: string };

export function resolvePhase(
  email: string | null | undefined,
  adminEmail: string,
): AdminPhase {
  const current = email?.trim();

  if (!current) {
    return { status: "login" };
  }

  if (current.toLowerCase() === adminEmail.trim().toLowerCase()) {
    return { status: "ready", email: current };
  }

  return { status: "denied", email: current };
}

export function samePhase(a: AdminPhase, b: AdminPhase): boolean {
  if (a.status !== b.status) return false;

  if (
    (a.status === "ready" || a.status === "denied") &&
    (b.status === "ready" || b.status === "denied")
  ) {
    return a.email === b.email;
  }

  if (a.status === "error" && b.status === "error") {
    return a.message === b.message;
  }

  return true;
}

/** Supabase errors are not always `Error` instances, so read `message` safely. */
export function errorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string" && err) return err;

  if (typeof err === "object" && err !== null && "message" in err) {
    const message = String((err as { message: unknown }).message ?? "");

    if (/coerce the result to a single json object/i.test(message)) {
      return "The database refused the change (no row was affected). Check that you are signed in as the admin and that the row level security policies allow it.";
    }

    if (message) return message;
  }

  return fallback;
}
