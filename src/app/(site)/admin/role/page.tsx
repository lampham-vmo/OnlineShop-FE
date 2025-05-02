'use client';
import { ManageRole } from '@/app/components/Admin/AdminRole';
import React from 'react';
import RoleGuard from '@/HOC/withRoleGuardComponent';
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
