"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { User, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const identifier = formData.get("identifier"); // Email or Username
    const password = formData.get("password");

    const result = await signIn("credentials", {
      redirect: false,
      identifier, // Now supports both email & username
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Peopulse.com</h1>
      </div>
      <Card className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="identifier">Email or Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Enter your email or username"
                className="pl-10 w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          {error && (
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-primary py-2 hover:underline font-medium"
            >
              Forgot Password
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            {"Don't"} have an account?{" "}
          </span>
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </>
  );
}
