'use client';
import { ManageRole } from '@/app/components/Admin/AdminRole';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import RoleGuard from '@/HOC/withRoleGuardComponent';
import { Roles } from '@/constant/roles';
import { AllowedRoleForRolePage } from '@/constant/AllowedRole/Admin.allowed-role';
export default function ManageRolePage() {
  return (
    <div>
      <RoleGuard allowedRoles={AllowedRoleForRolePage}>
        <ManageRole />
      </RoleGuard>
    </div>
  );
}
