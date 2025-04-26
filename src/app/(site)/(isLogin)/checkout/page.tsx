import Checkout from '@/app/components/Checkout';
import Breadcrumb from '@/app/components/Common/Breadcrumb';

const CheckoutPage = () => {
  return (
    <>
      <Breadcrumb title="Checkout" />
      <Checkout />
    </>
  );
};

export default CheckoutPage;
