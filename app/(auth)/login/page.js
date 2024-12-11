"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setLoginDetails } from '@/redux/slices/authSlice';

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { loading, error, status, loginFormData } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(loginUser(loginFormData)).unwrap();
      if (response?.status === 'success') {
        router.push('/');
      } else {
        alert("Login failed:", response?.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };


  const handleInputDetails = (key, value) => {
    dispatch(setLoginDetails({ field: key, value }));
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              placeholder="Enter your email"
              className="pl-10"
              required
              value={loginFormData?.emailOrUsername}
              onChange={(e) => handleInputDetails('emailOrUsername', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="pl-10"
              required
              value={loginFormData?.password}
              onChange={(e) => handleInputDetails('password', e.target.value)}
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

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-primary py-2 hover:underline font-medium"
          >
            Forgot Password
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading==='loginUser'}>
          {loading==='loginUser' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>


      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">{"Don't"} have an account? </span>
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </div>
    </Card>
  );
}