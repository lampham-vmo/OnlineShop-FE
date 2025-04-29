'use client';

import { getCart } from '@/generated/api/endpoints/cart/cart';
import { CartProduct, Product, ProductResponse } from '@/generated/api/models';
import useCartStore from '@/stores/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface IProductItemProps {
  item: Product;
  bgWhite: boolean;
}

const ProductItem = ({ item, bgWhite = true }: IProductItemProps) => {
  const { addItemToCart } = useCartStore();
  const router = useRouter();
  const listImage: string[] = JSON.parse(item.image);

  const handleViewDetail = (id: number) => {
    router.push(`/product-details/${id}`);
  };

  const handleAddToCart = (item: Product) => {
    if (item.stock === 0) {
      toast.error(`${item.name} is out of stock`, { duration: 3000 });
      return;
    }
    addItemToCart(item);
    toast.success(`${item.name} added to cart`, { duration: 3000 });
  };

  const itemDiscountedPrice = item.price - (item.price * item.discount) / 100;

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden flex items-center justify-center rounded-lg min-h-[270px] mb-4 ${bgWhite ? 'bg-white' : 'bg-[#F6F7FB]'}`}
      >
        <img src={listImage[0]} alt="" className="w-2/3 object-cover" />

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => handleViewDetail(item.id)}
            aria-label="button for quick view"
            className="flex items-center justify-center w-18 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue"
          >
            {/* View Icon */}
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG paths */}
            </svg>
          </button>

          <button
            onClick={() => handleAddToCart(item)}
            disabled={item.stock === 0}
            aria-label="button for add to cart"
            className={`flex items-center justify-center w-18 h-9 rounded-[5px] shadow-1 ease-out duration-200 ${item.stock === 0
              ? 'text-dark bg-white cursor-not-allowed'
              : 'text-dark bg-white hover:text-white hover:bg-blue'
              }`}
          >
            {item.stock === 0 ? 'Out of Stock' : (
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG paths for cart icon */}
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: Number(item.rating) }).map((_, i) => (
            <Image
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star icon"
              width={14}
              height={14}
            />
          ))}
        </div>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
        <Link href={`/product-details/${item.id}`}>{item.name}</Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">
          ${itemDiscountedPrice.toLocaleString()}
        </span>
        <span className="text-dark-4 line-through">
          ${item.price.toLocaleString()}
        </span>
      </span>
    </div>
  );
};

export default ProductItem;