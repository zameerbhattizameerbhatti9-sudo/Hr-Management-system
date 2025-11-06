"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/Dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative w-full max-w-lg px-4">
        <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-[128px]" />
        <div className="absolute -right-4 top-0 h-72 w-72 rounded-full bg-indigo-300 opacity-20 blur-[128px]" />
        <Card className="relative overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-lg">
          <CardHeader className="space-y-3 pb-8 text-center">
            <CardTitle className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-slate-400">
              Sign in to your account using email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-slate-800 bg-slate-900/50 text-slate-200 placeholder:text-slate-400 hover:border-slate-700 focus:border-slate-700 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-slate-800 bg-slate-900/50 text-slate-200 hover:border-slate-700 focus:border-slate-700 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              {error && (
                <div className="rounded-md bg-red-900/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="h-12 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-base font-semibold tracking-wide text-white transition-all hover:scale-[1.02] hover:opacity-90 disabled:opacity-50" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-center">
                <div className="text-sm font-medium text-slate-400">
                  Demo accounts
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-300">Admin:</span>{" "}
                    <span className="font-mono text-indigo-400">admin@example.com</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-300">Employee:</span>{" "}
                    <span className="font-mono text-indigo-400">employee@example.com</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-300">Password:</span>{" "}
                    <span className="font-mono text-purple-400">password</span>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
