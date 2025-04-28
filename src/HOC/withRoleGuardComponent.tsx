// hoc/withRoleGuard.tsx
import { useAuthStore } from '@/stores/authStore';
import { Roles } from '@/constant/roles';

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: Roles[];
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
