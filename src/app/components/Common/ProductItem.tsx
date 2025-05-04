'use client';
import { ProductResponse } from '@/generated/api/models';
import Image from 'next/image';
import Link from 'next/link';

interface IProductItemProps {
  item: ProductResponse;
  bgWhite: boolean;
}

const ProductItem = ({ item, bgWhite = true }: IProductItemProps) => {
  const listImage: string[] = JSON.parse(item.image);

  const itemDiscountedPrice = item.price - (item.price * item.discount) / 100;

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden flex items-center justify-center rounded-lg min-h-[270px] mb-4 ${bgWhite ? 'bg-white' : 'bg-[#F6F7FB]'}`}
      >
        <img src={listImage[0]} alt="" className="w-2/3 object-cover" />
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
