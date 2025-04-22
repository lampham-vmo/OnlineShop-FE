// hoc/withRoleGuard.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { RoleId } from '@/constant/roles';
type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: RoleId[];
};
const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { isAcceptRole } = useAuthStore();

  if (!isAcceptRole(allowedRoles)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null; // Tránh render bất kỳ nội dung nào
  }

  return <>{children}</>;
};
export default RoleGuard;
