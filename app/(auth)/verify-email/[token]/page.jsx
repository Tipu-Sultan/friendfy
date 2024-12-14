"use client";

import { useParams, useRouter } from 'next/navigation'; // For query params and navigation
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const router = useRouter();
  const {token} = useParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || 'Email successfully verified!');
        setTimeout(() => router.push('/login'), 3000); // Redirect after success
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          Click the button below to verify your email address.
        </p>
      </div>

      {status && (
        <p className="text-green-600 dark:text-green-400 font-medium text-center">
          {status}
        </p>
      )}

      {error && (
        <p className="text-red-600 dark:text-red-400 font-medium text-center">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={loading || !token}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </div>
    </Card>
  );
}
