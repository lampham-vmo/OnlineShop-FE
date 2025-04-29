import Breadcrumb from '@/app/components/Common/Breadcrumb';
import MyOrders from '@/app/components/MyOrders';

const UserOrdersPage = () => {
  return (
    <>
      <Breadcrumb title="Orders" />
      <MyOrders />
    </>
  );
};

export default UserOrdersPage;
