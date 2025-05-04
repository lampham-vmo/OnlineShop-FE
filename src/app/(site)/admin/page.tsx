"use client";
import AdminDashboard from '@/app/components/Admin';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminDashboard />
      <Toaster position="top-right" />
    </div>
  );
}
