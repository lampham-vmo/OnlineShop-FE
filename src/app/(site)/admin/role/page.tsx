'use client';
import { ManageRole } from '@/app/components/Admin/AdminRole';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function ManageRolePage() {
  const { isAcceptPermission } = useAuthStore.getState();
  // Nếu không có quyền, chuyển hướng ngay lập tức (tránh render component)
  const isAccept = isAcceptPermission([
    'get all permission',
    'admin get all role',
  ]);
  if (!isAccept) {
    if (typeof window !== 'undefined') {
      window.location.href = '/403';
    }
    return null; // Tránh render bất kỳ nội dung nào
  }
  return (
    <div>
      <ManageRole />
    </div>
  );
}
