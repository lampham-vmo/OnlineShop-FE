`use client`;
import CustomizedTables from '@/app/components/Admin/Products/AdminProduct';
import BasicModal from '@/app/components/Admin/Products/Create ProductButton';
import { Button } from '@mui/material';
import React from 'react';

export default function ManageRolePage() {
  return (
    <div>
      <BasicModal />
      <CustomizedTables />
    </div>
  );
}
