import type { AuthError } from "@supabase/supabase-js";

/** Turns auth errors into patient-friendly messages, especially leaked/weak passwords. */
export function friendlyAuthError(error: AuthError | Error): string {
  const code = (error as AuthError & { code?: string; reasons?: string[] }).code;
  const reasons = (error as { reasons?: string[] }).reasons ?? [];
  const msg = error.message?.toLowerCase() ?? "";

  if (reasons.includes("pwned") || msg.includes("pwned") || msg.includes("leak") || msg.includes("known to be")) {
    return "This password has appeared in a known data breach, so it isn't safe to use. Please choose a different, unique password you don't use anywhere else.";
  }
  if (code === "weak_password" || msg.includes("weak") || msg.includes("password should")) {
    return "This password is too easy to guess. Please choose a longer one that mixes letters, numbers and symbols.";
  }
  if (code === "same_password") return "Your new password must be different from your current one.";
  return error.message;
}
