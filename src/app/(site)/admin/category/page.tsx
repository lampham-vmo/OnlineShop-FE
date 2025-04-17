import ManageCategory from '@/app/components/Admin/Category';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Category',
  description: 'Manage Category',
};

const ManageCategoryPage = () => {
  return <ManageCategory />;
};

export default ManageCategoryPage;
