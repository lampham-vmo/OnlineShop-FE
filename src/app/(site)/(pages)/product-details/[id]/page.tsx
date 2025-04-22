import ProductDetails from '@/app/components/ProductDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Details',
  description: 'Product Details',
};

const ProductDetailsPage = () => {
  return <ProductDetails />;
};

export default ProductDetailsPage;
