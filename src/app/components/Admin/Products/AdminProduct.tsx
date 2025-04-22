'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Stack,
  TableFooter,
  TablePagination,
} from '@mui/material';
import {
  ProductControllerGetAllProductParams,
  ProductResponse,
} from '@/generated/api/models';
import { getProduct } from '@/generated/api/endpoints/product/product';
import UpdateButton from './UpdateButton';
import DeleteProduct from './DeleteButton';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

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
  const handleDelete = (id: number) => {
    console.log(id);
  };
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
    setProductList(data.result.products);
    setTotalPages(data.result.pagination.totalPages || 1);
    setTotalItems(data.result.pagination.totalItems || 0);
  };
  const handleUpdate = () => {};
  React.useEffect(() => {
    getListProduct();
  }, [params]);
  // Avoid a layout jump when reaching the last page with empty rows.
  return (
    <>
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
                  <StyledTableCell>{row.createdAt}</StyledTableCell>
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
