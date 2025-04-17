'use client';
import { ManageRole } from '@/app/components/Admin/AdminRole';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function ManageRolePage() {
  const { isAcceptPermission, isAcceptRole } = useAuthStore.getState();
  // Nếu không có quyền, chuyển hướng ngay lập tức (tránh render component)
  if (!isAcceptRole([1])) {
    console.log(isAcceptRole([1]));
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null; // Tránh render bất kỳ nội dung nào
  }
  return (
    <div>
      <ManageRole />
    </div>
  );
}
