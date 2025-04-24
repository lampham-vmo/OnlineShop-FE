`use client`;
import { VerifyConfirmResetPassword } from '@/app/components/Verify';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';

export default function VerifyPage() {
    const user = useAuthStore((state) => state.user);
    
    
        if (user){
          window.location.href="/"
          return null
        }
  return (
    <div>
      <VerifyConfirmResetPassword/>
    </div>
  );
}
