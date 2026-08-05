import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Stethoscope } from "lucide-react";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your full name").max(100);

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isDoctor, loading } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? (isDoctor ? "/doctor" : "/dashboard"), { replace: true });
    }
  }, [user, isDoctor, loading, navigate, location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password") }).safeParse({ email, password });
    if (!parsed.success) return setError(parsed.error.errors[0].message);

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (signInError) return setError(signInError.message);
    toast({ title: "Welcome back" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = z
      .object({ email: emailSchema, password: passwordSchema, fullName: nameSchema })
      .safeParse({ email, password, fullName });
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    if (role === "doctor" && specialization.trim().length < 2) {
      return setError("Enter your specialization");
    }

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, role },
      },
    });
    setSubmitting(false);

    if (signUpError) return setError(signUpError.message);

    if (role === "doctor" && data.session && data.user) {
      await supabase.from("doctors").insert({
        user_id: data.user.id,
        name: parsed.data.fullName,
        specialization: specialization.trim(),
        keywords: [specialization.trim().toLowerCase()],
        years_of_experience: 0,
        rating: 0,
        availability: true,
        verified: false,
        email: parsed.data.email,
      });
    }

    if (!data.session) {
      setCheckEmail(true);
      return;
    }

    toast({ title: "Account created", description: "You're all set." });
  };

  const handleForgotPassword = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError("Enter your email above first");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) return setError(resetError.message);
    toast({ title: "Reset link sent", description: "Check your inbox." });
  };

  if (checkEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Confirm your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to {email}. Click it to activate your account, then sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setCheckEmail(false)}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-primary">
          <Stethoscope className="h-6 w-6" />
          <span className="text-xl font-bold">HelloDoc</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in or create your HelloDoc account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" onValueChange={() => setError(null)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                  <button type="button" onClick={handleForgotPassword} className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline">
                    Forgot your password?
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input id="signup-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as "patient" | "doctor")} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="role-patient" />
                        <Label htmlFor="role-patient" className="font-normal">Patient</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="role-doctor" />
                        <Label htmlFor="role-doctor" className="font-normal">Doctor</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {role === "doctor" && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-spec">Specialization</Label>
                      <Input id="signup-spec" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Cardiology" />
                      <p className="text-xs text-muted-foreground">
                        Doctor accounts appear in the public directory after verification.
                      </p>
                    </div>
                  )}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Auth;
