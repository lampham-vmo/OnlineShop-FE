'use client';
import React, { useState, useEffect, useRef } from 'react';
import CategoryDropdown from './CategoryDropdown';

import ProductItem from '../Common/ProductItem';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from '@mui/material';
import { number } from 'zod';
import CustomSelect from '../ProductsWithCategory/CustomSelect';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCategory } from '@/generated/api/endpoints/category/category';
import { getProduct } from '@/generated/api/endpoints/product/product';
import {
  CategoryResponseDto,
  ProductControllerGetAllProductParams,
  ProductResponse,
} from '@/generated/api/models';

const ShopWithSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  console.log(pathName);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>('');
  useEffect(() => {
    setQuery(searchParams.get('text') ?? '');
  }, [searchParams]);
  const { categoryControllerGetAll } = getCategory();
  const {
    productControllerGetAllProduct,
    productControllerGetProductPagination,
  } = getProduct();
  const [productSidebar, setProductSidebar] = useState(false);
  const [productList, setProductList] = useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState<ProductControllerGetAllProductParams>({
    page: 1,
    pageSize: 9,
    categoryId: undefined,
  });
  const [stickyMenu, setStickyMenu] = useState(false);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const sortBlockRef = useRef<HTMLDivElement>(null);

  const getAllCategory = async () => {
    const data = await categoryControllerGetAll();
    setCategories(data.data);
  };

  const getAllProductByText = async () => {
    const data = await productControllerGetProductPagination({
      ...params,
      text: query,
    });
    setProductList(data.result.products);
    setTotalPages(data.result.pagination.totalPages || 1);
    setTotalItems(data.result.pagination.totalItems || 0);
  };

  const getListProduct = async () => {
    const data = await productControllerGetAllProduct({
      ...params,
    });
    setProductList(data.result.products);
    setTotalPages(data.result.pagination.totalPages || 1);
    setTotalItems(data.result.pagination.totalItems || 0);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({ ...prev, page: value }));
  };

  enum EOrderField {
    NAME = 'name',
    RATING = 'rating',
    PRICE = 'price',
  }

  enum EOrderBy {
    DESC = 'DESC',
    ASC = 'ASC',
  }

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
  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    if (query !== '' && pathName == '/product-search') {
      getAllProductByText();
      sortBlockRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathName == '/product-list') {
      getListProduct();
      sortBlockRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else return;
  }, [params, query]);
  if (pathName == '/product-search') {
    const filteredOptions = options.filter(
      (opt) => opt.value !== '1' && opt.value !== '2',
    );
  } else {
    const filteredOptions = options;
  }

  return (
    <>
      <section
        ref={sortBlockRef}
        className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]"
      >
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? 'translate-x-0 bg-white p-5 h-screen overflow-y-auto'
                  : '-translate-x-full'
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? 'lg:top-20 sm:top-34.5 top-35'
                    : 'lg:top-24 sm:top-39 top-37'
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- category box --> */}
                  <CategoryDropdown
                    categories={categories}
                    onCategoryChange={(id: number | undefined) => {
                      setParams((prev) => ({
                        ...prev,
                        categoryId: id,
                        page: 1,
                      }));
                    }}
                  />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* <CustomSelect options={options} /> */}

                    <p>
                      Showing{' '}
                      <span className="text-dark">
                        {params.pageSize != undefined
                          ? params.pageSize > totalItems
                            ? totalItems
                            : params.pageSize
                          : 0}{' '}
                        of {totalItems}
                      </span>{' '}
                      Products
                    </p>
                  </div>
                  <div>
                    <CustomSelect
                      options={
                        pathName == '/product-search'
                          ? options.filter(
                              (opt) => opt.value !== '1' && opt.value !== '2',
                            )
                          : options
                      }
                      setParams={setParams}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9">
                {productList.map((item, idx) => (
                  <ProductItem item={item} key={idx} bgWhite />
                ))}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
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
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
