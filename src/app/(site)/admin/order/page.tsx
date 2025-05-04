import OrderTable from '@/app/components/Admin/Orders';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Order',
  description: 'Manage Order',
};

const ManageOrderPage = () => {
  return <OrderTable />;
};

export default ManageOrderPage;
