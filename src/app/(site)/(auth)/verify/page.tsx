'use client';
import { VerifyEmail } from '@/app/components/Verify';
import React, { Suspense } from 'react';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
