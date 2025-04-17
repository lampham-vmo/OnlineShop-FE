'use client';

import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  Category,
  CategoryControllerGetListParams,
  CategoryPaginationData,
} from '@/generated/api/models';
import { getCategory } from '@/generated/api/endpoints/category/category';
import CreateCategory from './CreateCategory';
import UpdateCategory from './UpdateCategory';
import DeleteCategory from './DeleteCategory';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

interface ColumnData {
  dataKey: keyof Category;
  label: string;
  numeric?: boolean;
  width?: number;
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

const columns: ColumnData[] = [
  {
    label: 'ID',
    dataKey: 'id',
  },
  {
    label: 'Name',
    dataKey: 'name',
  },
  {
    label: 'Description',
    dataKey: 'description',
  },
];

const ManageCategory = () => {
  const [dataCategories, setDataCategories] =
    useState<CategoryPaginationData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [params, setParams] = useState<CategoryControllerGetListParams>({
    page: 1,
    pageSize: 10,
    order: 'ASC',
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setParams((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const getListCategory = async () => {
    try {
      const response = await getCategory().categoryControllerGetList(params);
      setDataCategories(response.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const emptyRows = Math.max(
    0,
    Number(params.page) * Number(params.pageSize) -
      (dataCategories?.pagination.totalItems ?? 0),
  );

  useEffect(() => {
    getListCategory();
  }, [params]);

  return (
    <Box>
      {/* Block Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Category
      </Typography>

      {/* Block Create */}
      <CreateCategory onSuccess={getListCategory} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : error ||
        !dataCategories ||
        !dataCategories.result ||
        dataCategories.result.length === 0 ? (
        <div className="text-center py-5 text-3xl text-dark">
          Doesn't exist any catagory
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{ backgroundColor: 'background.paper' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="left">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataCategories.result.map((category) => (
                <TableRow key={category.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.dataKey}
                      align={column.numeric || false ? 'right' : 'left'}
                      sx={{ backgroundColor: 'background.paper' }}
                    >
                      {category[column.dataKey]}
                    </TableCell>
                  ))}
                  <TableCell align="left">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-start"
                    >
                      <UpdateCategory
                        category={category}
                        onSuccess={getListCategory}
                      />

                      <DeleteCategory
                        {...category}
                        onSuccess={getListCategory}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 63.55 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  colSpan={3}
                  count={dataCategories.pagination.totalItems}
                  rowsPerPage={params.pageSize || 10}
                  page={Number(params.page) - 1 || 0}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageCategory;
