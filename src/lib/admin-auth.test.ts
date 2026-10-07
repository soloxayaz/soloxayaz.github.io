import assert from "node:assert/strict";
import { test } from "node:test";
import { errorMessage, resolvePhase, samePhase } from "./admin-auth.ts";

const ADMIN = "ahmadayaz0704@gmail.com";

test("no email resolves to the login screen", () => {
  assert.deepEqual(resolvePhase(null, ADMIN), { status: "login" });
  assert.deepEqual(resolvePhase(undefined, ADMIN), { status: "login" });
  assert.deepEqual(resolvePhase("   ", ADMIN), { status: "login" });
});

test("the admin email is ready, case and whitespace insensitive", () => {
  assert.equal(resolvePhase(ADMIN, ADMIN).status, "ready");
  assert.equal(resolvePhase("  AhmadAyaz0704@Gmail.com ", ADMIN).status, "ready");
});

test("any other signed-in email is denied", () => {
  assert.deepEqual(resolvePhase("someone@example.com", ADMIN), {
    status: "denied",
    email: "someone@example.com",
  });
});

test("samePhase ignores identical phases and detects changes", () => {
  assert.equal(
    samePhase({ status: "ready", email: "a@b.c" }, { status: "ready", email: "a@b.c" }),
    true,
  );
  assert.equal(
    samePhase({ status: "ready", email: "a@b.c" }, { status: "denied", email: "a@b.c" }),
    false,
  );
  assert.equal(samePhase({ status: "login" }, { status: "verifying" }), false);
  assert.equal(samePhase({ status: "login" }, { status: "login" }), true);
});

test("errorMessage reads plain Supabase-style error objects", () => {
  assert.equal(errorMessage({ message: "Invalid login credentials" }, "x"), "Invalid login credentials");
  assert.equal(errorMessage(new Error("boom"), "x"), "boom");
  assert.equal(errorMessage(null, "fallback"), "fallback");
  assert.match(
    errorMessage({ message: "Cannot coerce the result to a single JSON object" }, "x"),
    /row level security/,
  );
});
