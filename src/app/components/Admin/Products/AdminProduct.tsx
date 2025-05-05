'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination, Stack } from '@mui/material';
import {
  ProductControllerGetAllProductParams,
  ProductResponse,
} from '@/generated/api/models';
import { getProduct } from '@/generated/api/endpoints/product/product';
import UpdateButton from './UpdateButton';
import DeleteProduct from './DeleteButton';
import BasicModal from './Create ProductButton';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const [params, setParams] =
    React.useState<ProductControllerGetAllProductParams>({
      page: 1,
      pageSize: 9,
      categoryId: undefined,
    });
  const { productControllerGetAllProduct } = getProduct();
  const [productList, setProductList] = React.useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const handleUpdateSuccess = () => {
    getListProduct(); // Hàm này refetch lại danh sách
  };
  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({ ...prev, page: value }));
  };
  const getListProduct = async () => {
    const data = await productControllerGetAllProduct({
      ...params,
    });
    setProductList(data.data.products);
    setTotalPages(data.data.pagination.totalPages || 1);
    setTotalItems(data.data.pagination.totalItems || 0);
    console.log(totalItems);
  };
  React.useEffect(() => {
    getListProduct();
  }, [params]);
  // Avoid a layout jump when reaching the last page with empty rows.
  return (
    <>
      <BasicModal onSuccess={handleUpdateSuccess} />
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Stock</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Discount</StyledTableCell>
                <StyledTableCell>Rating</StyledTableCell>
                <StyledTableCell>Category Name</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Update/Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>
                    {(() => {
                      try {
                        const images = JSON.parse(row.image);
                        return Array.isArray(images) ? (
                          <img
                            src={images[0]}
                            alt="product"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            }}
                          />
                        ) : null;
                      } catch {
                        return null;
                      }
                    })()}
                  </StyledTableCell>
                  <StyledTableCell>{row.stock}</StyledTableCell>
                  <StyledTableCell>{row.price}$</StyledTableCell>
                  <StyledTableCell>{row.discount}%</StyledTableCell>
                  <StyledTableCell>{row.rating}</StyledTableCell>
                  <StyledTableCell>{row.categoryName}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.createdAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex gap-x-2">
                      <UpdateButton
                        initialData={row}
                        onSuccess={handleUpdateSuccess}
                      />
                      <DeleteProduct
                        id={row.id}
                        name={row.name}
                        onSuccess={handleUpdateSuccess}
                      />
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
    </>
  );
}
