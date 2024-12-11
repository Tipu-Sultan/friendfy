"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassowrd, setResetDetails } from '@/redux/slices/authSlice';

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { loading, error, status, resetFormData } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(resetPassowrd(resetFormData)).unwrap();
      if (response?.status === 200) {
        router.push('/login');
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };


  const handleInputDetails = (key, value) => {
    dispatch(setResetDetails({ field: key, value }));
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Reset Your Pasword</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">OTP</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="resetOtp"
              name="resetOtp"
              type="text"
              placeholder="Enter your email"
              className="pl-10"
              required
              value={resetFormData?.resetOtp}
              onChange={(e) => handleInputDetails('resetOtp', e.target.value)}
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
              value={resetFormData?.password}
              onChange={(e) => handleInputDetails('password', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmedPassword">Confirmed Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmedPassword"
              type="password"
              name="confirmedPassword"
              placeholder="Enter your confirmedPassword"
              className="pl-10"
              required
              value={resetFormData?.confirmedPassword}
              onChange={(e) => handleInputDetails('confirmedPassword', e.target.value)}
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

        <Button type="submit" className="w-full" disabled={loading==='resetPassowrd'}>
          {loading==='resetPassowrd' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reseting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>

    </Card>
  );
}