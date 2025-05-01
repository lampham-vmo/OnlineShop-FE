'use client';
import Login from '@/app/components/Login';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';

export default function LoginPage() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    window.location.href = '/';
    return null;
  }
  return (
    <div>
      <Login />
    </div>
  );
}
