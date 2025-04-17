import AdminDashboard from '@/app/components/Admin';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
