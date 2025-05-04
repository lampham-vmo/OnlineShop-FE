/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useParams } from 'next/navigation';
import CustomSelect from './CustomSelect';
import { useEffect, useRef, useState } from 'react';
import {
  ProductControllerGetAllProductParams,
  ProductResponse,
} from '@/generated/api/models';
import { getProduct } from '@/generated/api/endpoints/product/product';
import ProductItem from '../Common/ProductItem';
import { Box, CircularProgress, Pagination, Stack } from '@mui/material';
import Breadcrumb from '../Common/Breadcrumb';

enum EOrderField {
  NAME = 'name',
  RATING = 'rating',
  PRICE = 'price',
}

enum EOrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

const ProductsWithCategory = () => {
  const routeParams = useParams();
  const categoryId = Number(routeParams.id);

  const options = [
    { label: 'Order By', value: '0' },
    {
      label: 'Name: A - Z',
      value: '1',
      orderField: EOrderField.NAME,
      orderBy: EOrderBy.ASC,
    },
    {
      label: 'Name: Z - A',
      value: '2',
      orderField: EOrderField.NAME,
      orderBy: EOrderBy.DESC,
    },
    {
      label: 'Price: Lowest To Highest',
      value: '3',
      orderField: EOrderField.PRICE,
      orderBy: EOrderBy.ASC,
    },
    {
      label: 'Price: Highest To Lowest',
      value: '4',
      orderField: EOrderField.PRICE,
      orderBy: EOrderBy.DESC,
    },
    {
      label: 'Rating: Highest To Lowest',
      value: '7',
      orderField: EOrderField.RATING,
      orderBy: EOrderBy.DESC,
    },
    {
      label: 'Rating: Lowest To Highest',
      value: '8',
      orderField: EOrderField.RATING,
      orderBy: EOrderBy.ASC,
    },
  ];

  const [products, setProducts] = useState<ProductResponse[]>();
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState<ProductControllerGetAllProductParams>({
    page: 1,
    pageSize: 8,
  });
  const [categoryName, setCategoryName] = useState('');

  const sortBlockRef = useRef<HTMLDivElement>(null);

  const getListProduct = async () => {
    const data = await getProduct().productControllerGetAllProduct({
      categoryId: categoryId,
      ...params,
    });
    setProducts(data.data.products);
    setTotalPages(data.data.pagination.totalPages || 1);
    setTotalItems(data.data.pagination.totalItems || 0);
    setCategoryName(data.data.products[0]?.categoryName || 'Category');
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({ ...prev, page: value }));
  };

  const scrollToSortBlock = () => {
    if (sortBlockRef.current) {
      const yOffset = -100;
      const y =
        sortBlockRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    getListProduct();
    scrollToSortBlock();
  }, [params]);

  if (!products) {
    return (
      <div className="py-20">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <>
      {products.length === 0 ? (
        <div className="py-20 text-center text-blue-500 text-3xl font-semibold">
          Doesn&apos;t exist products in this category
        </div>
      ) : (
        <>
          <Breadcrumb title={categoryName} />
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* Sort Block */}
              <div
                ref={sortBlockRef}
                className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6"
              >
                <div className="flex items-center gap-4">
                  <CustomSelect options={options} setParams={setParams} />

                  <p>
                    Showing{' '}
                    <span className="text-dark">
                      {products.length} of {totalItems}
                    </span>{' '}
                    Products
                  </p>
                </div>
              </div>

              {/* List Product In Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9">
                {products.map((item, idx) => (
                  <ProductItem item={item} key={idx} bgWhite />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-10">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={params.page}
                    defaultPage={1}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Stack>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ProductsWithCategory;
