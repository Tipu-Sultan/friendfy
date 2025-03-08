"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setUserDetails } from '@/redux/slices/authSlice';
import {validateForm} from '@/utils/validateForm'

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error, status, userFormData } = useSelector((state) => state.auth);
  const [clientError, setClientError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before dispatching
    const validationError = validateForm(userFormData);

    if (validationError) {
      // If validation error exists, set it in the state
      setClientError(validationError);
      return; // Stop the form submission if there's an error
    }

    try {
      // If no validation errors, proceed with dispatch
      dispatch(registerUser(userFormData));
      setClientError(null)
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputDetails = (key, value) => {
    dispatch(setUserDetails({ field: key, value }));
  };
  return (
    <Card className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to get started with our platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type='text'
              name='username'
              placeholder="Create your username"
              className="pl-10"
              value={userFormData?.username}
              onChange={(e) => handleInputDetails('username', e.target.value)}
              
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              name='email'
              placeholder="Enter your email"
              className="pl-10"
              value={userFormData?.email}
              onChange={(e) => handleInputDetails('email', e.target.value)}
              
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
              name='password'
              placeholder="Create a password"
              className="pl-10"
              value={userFormData?.password}
              onChange={(e) => handleInputDetails('password', e.target.value)}
             
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">confirmPassword</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              name='confirmPassword'
              placeholder="Confirm Password Your Password"
              className="pl-10"
              value={userFormData?.confirmPassword}
              onChange={(e) => handleInputDetails('confirmPassword', e.target.value)}
             
            />
          </div>
        </div>
        {clientError && (
          <p className="text-red-600 dark:text-red-400 font-medium">
            {clientError}
          </p>
        )}

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

        <Button type="submit" className="w-full" disabled={loading==='registerUser'}>
          {loading==='registerUser' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </div>
    </Card>
  );
}