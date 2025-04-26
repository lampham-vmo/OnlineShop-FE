'use client';
import Signup from '@/app/components/Signup';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';

export default function SignupPage() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    window.location.href = '/';
    return null;
  }
  return (
    <div>
      <Signup />
    </div>
  );
}
