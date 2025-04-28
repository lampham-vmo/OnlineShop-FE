import { Product } from '@/generated/api/models';

export interface ICartProductItem
  extends Omit<Product, 'category' | 'cartProducts'> {
  priceDiscount: number;
  quantityInCart: number;
}
