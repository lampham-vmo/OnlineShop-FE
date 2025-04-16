import ProductsWithCategory from '@/app/components/ProductsWithCategory';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Category',
  description: 'Category',
};

const CategoryWithProductsPage = () => {
  return <ProductsWithCategory />;
};

export default CategoryWithProductsPage;
