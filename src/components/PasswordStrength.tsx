import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMON_PASSWORDS = new Set([
  "password", "password1", "12345678", "123456789", "qwerty123", "letmein1",
  "iloveyou", "admin123", "welcome1", "monkey123", "dragon12", "football",
]);

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Upper and lower case letters", test: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: "A number", test: (pw) => /\d/.test(pw) },
  { label: "A symbol (!@#$…)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  { label: "Not a common password", test: (pw) => !COMMON_PASSWORDS.has(pw.toLowerCase()) },
];

const LEVELS = [
  { label: "Very weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { label: "Good", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  { label: "Excellent", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
];

export function scorePassword(pw: string): number {
  if (!pw) return 0;
  return RULES.reduce((n, r) => n + (r.test(pw) ? 1 : 0), 0);
}

export function PasswordStrength({ password }: { password: string }) {
  const results = useMemo(() => RULES.map((r) => r.test(password)), [password]);
  const score = useMemo(() => scorePassword(password), [password]);

  if (!password) return null;

  const level = LEVELS[score];

  return (
    <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 gap-1">
          {RULES.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i < score ? level.bar : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className={cn("text-xs font-medium", level.text)}>{level.label}</span>
      </div>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {RULES.map((rule, i) => (
          <li key={rule.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {results[i] ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground/60" />
            )}
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
