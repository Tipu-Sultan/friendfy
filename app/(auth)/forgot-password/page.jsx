"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, setForgotEmail } from '@/redux/slices/authSlice';

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { loading, error, status, forgotEmail } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(forgotPassword({ email: forgotEmail })).unwrap();
      if (response?.status === 200) {
        router.push('/reset-password');
      } else {
        alert("forgotting failed:", response?.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };


  return (
    <Card className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Forgot Your Password</h1>
        <p className="text-sm text-muted-foreground">
          Please send an email for OTP to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="Enter your email"
              className="pl-10"
              required
              value={forgotEmail}
              onChange={(e) => dispatch(setForgotEmail(e.target.value))}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        )}
        {status && (
          <p className="text-green-600 dark:text-green-400 font-medium">
            {status}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send email'
          )}
        </Button>
      </form>


      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">{"Don't"} Rememberd password </span>
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Login 
        </Link>
      </div>
    </Card>
  );
}