'use client';
import ResetPasswordForm from '@/app/components/Verify';
import { useAuthStore } from '@/stores/authStore';
import React, { Suspense } from 'react';

export default function VerifyPage() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    window.location.href = '/';
    return null;
  }
  return (
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

  );
}
