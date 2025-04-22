import DisplayPaymentMethod from '@/app/components/Admin/PaymentMethod';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Payment Method',
  description: 'Manage Payment Method',
};

const ManageCategoryPage = () => {
  return <DisplayPaymentMethod />;
};

export default ManageCategoryPage;
