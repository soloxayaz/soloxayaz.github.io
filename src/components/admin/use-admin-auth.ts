import { useEffect, useState } from "react";
import { ADMIN_EMAIL } from "@/lib/admin";
import {
  resolvePhase,
  samePhase,
  type AdminPhase,
} from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

/**
 * Supabase keeps its own session in localStorage under `sb-<ref>-auth-token`.
 * Its presence is ONLY a hint for the first frame: a logged-out visitor has no
 * key, so the login form renders immediately. Authorization is always decided
 * by the real session below, never by this hint.
 */
function hasStoredSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return Object.keys(window.localStorage).some((key) =>
      /^sb-.+-auth-token$/.test(key),
    );
  } catch {
    return false;
  }
}

function initialPhase(): AdminPhase {
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured. Check your environment variables.",
    };
  }

  return hasStoredSession() ? { status: "verifying" } : { status: "login" };
}

export function useAdminAuth(): AdminPhase {
  const [phase, setPhase] = useState<AdminPhase>(initialPhase);

  useEffect(() => {
    const client = supabase;

    if (!client) return;

    let active = true;

    const apply = (email: string | null | undefined) => {
      if (!active) return;

      const next = resolvePhase(email, ADMIN_EMAIL);
      setPhase((current) => (samePhase(current, next) ? current : next));
    };

    client.auth
      .getSession()
      .then(({ data, error }) => {
        apply(error ? null : data.session?.user.email);
      })
      .catch(() => apply(null));

    // Fires on sign in, sign out and token refresh. Only sets state here;
    // never call Supabase from inside this callback.
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      apply(session?.user.email);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return phase;
}
