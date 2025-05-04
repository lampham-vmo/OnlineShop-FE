'use client';

import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getOrders } from '../../../generated/api/endpoints/orders/orders';
import { OrderMonthTotal, SoldQuantityProduct } from '@/generated/api/models';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardMain() {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [ordersByMonth, setOrdersByMonth] = useState<OrderMonthTotal[] | null>(
    null,
  );
  const [topProducts, setTopProducts] = useState<SoldQuantityProduct[] | null>(
    null,
  );
  const [topProductCount, setTopProductCount] = useState<number>(5);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const ordersApi = getOrders();
        const totalOrdersResponse =
          await ordersApi.ordersControllerGetTotalOrders();
        const totalRevenueResponse =
          await ordersApi.ordersControllerGetTotalRevenue();
        const ordersByMonthResponse =
          await ordersApi.ordersControllerGetOrdersByMonth();
        const topProductsResponse =
          await ordersApi.ordersControllerGetTopProduct(
            topProductCount.toString(),
          );

        setTotalOrders(totalOrdersResponse.data);
        setTotalRevenue(totalRevenueResponse.data);
        setOrdersByMonth(ordersByMonthResponse.data.orders);
        setTopProducts(topProductsResponse.data.topProducts);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStatistics();
  }, [topProductCount]);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          This is your dashboard. From here, you can manage users, view reports,
          and control system settings.
        </Typography>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Dashboard Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Total Orders</Typography>
                <Typography variant="h4">
                  {totalOrders !== null ? totalOrders : 'Loading...'}
                </Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">
                  {totalRevenue !== null ? `$${totalRevenue}` : 'Loading...'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Orders by Month
          </Typography>
          {ordersByMonth ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            'Loading...'
          )}
        </Box>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Top Products
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              Select number of top products to display:
            </Typography>
            <Select
              value={topProductCount}
              onChange={(e) => setTopProductCount(Number(e.target.value))}
              size="small"
            >
              {[5, 10, 15].map((count) => (
                <MenuItem key={count} value={count}>
                  Top {count}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {topProducts ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Quantity Sold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            'Loading...'
          )}
        </Box>
      </Paper>
    </Container>
  );
}
