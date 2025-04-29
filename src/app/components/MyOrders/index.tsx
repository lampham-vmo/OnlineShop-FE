'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Pagination,
} from '@mui/material';
import { getOrders } from '@/generated/api/endpoints/orders/orders';
import { OrderResponseDTO, PaginationDTO } from '@/generated/api/models';
import OrderDetails from './OrderDetails';

const MyOrders = () => {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);

  const { ordersControllerFindAll } = getOrders();

  const getListOrders = async () => {
    try {
      const response = await ordersControllerFindAll({
        page: page,
      });
      setOrders(response.data.order);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  useEffect(() => {
    getListOrders();
  }, [page]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-3xl text-dark font-semibold">
        Internal Server Error
      </div>
    );
  }

  return (
    <>
      {orders.length === 0 ? (
        <Box display="flex" justifyContent="center" my={5}>
          <Typography variant="body1">There aren't any orders</Typography>
        </Box>
      ) : (
        <>
          <section className="overflow-hidden py-20 bg-gray-2">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 1170 }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
                          <TableCell sx={{ minWidth: 250 }}>Receiver</TableCell>
                          <TableCell sx={{ minWidth: 150 }}>Phone</TableCell>
                          <TableCell sx={{ minWidth: 280 }}>Address</TableCell>
                          <TableCell sx={{ minWidth: 180 }}>
                            Subtotal ($)
                          </TableCell>
                          <TableCell sx={{ minWidth: 180 }}>
                            Total ($)
                          </TableCell>
                          <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            Created At
                          </TableCell>
                          <TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.receiver}</TableCell>
                            <TableCell>{order.receiver_phone}</TableCell>
                            <TableCell>{order.delivery_address}</TableCell>
                            <TableCell>
                              {order.subTotal.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {order.total.toLocaleString()}
                            </TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <OrderDetails order={order} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" my={4}>
                <Pagination
                  count={pagination?.totalPages || 1}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default MyOrders;
