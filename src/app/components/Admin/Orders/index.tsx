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
import { getOrders } from '@/generated/api/endpoints/orders/orders';
import { OrderResponseDTO } from '@/generated/api/models';
import {
  Chip,
  Pagination,
  Stack,
} from '@mui/material';
import ConfirmModalOrder from './confirm.modal';
import OrderDetails from '../../MyOrders/OrderDetails';

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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const { ordersControllerFindAll, ordersControllerChangeStatus } = getOrders();
  const [orderData, SetOrderData] = React.useState<OrderResponseDTO[]>([]);
  const [params, setParams] = React.useState({ page: 1, search: '' });
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);


  enum Status {
    UNPAID = 'UNPAID',
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'UNPAID':
        return 'default';
      case 'CONFIRMED':
        return 'info';
      case 'SHIPPING':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getListOrder = async () => {
    const data = await ordersControllerFindAll(params);
    SetOrderData(data.data.order);
    setTotalPages(data.data.pagination.totalPages || 1);
    setTotalItems(data.data.pagination.totalItems || 0);
    console.log(totalItems)
  };

  const updateStatus = async (id: number, status: Status) => {
    await ordersControllerChangeStatus({
      id: id.toString(),
      status: status,
    });
    getListOrder();
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({ ...prev, page: value }));
  };

  React.useEffect(() => {
    getListOrder();
  }, [params]);

  return (
    <>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Receiver</StyledTableCell>
              <StyledTableCell>Receiver Phone</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Payment</StyledTableCell>
              <StyledTableCell>Paypal ID</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>View Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.receiver}</StyledTableCell>
                <StyledTableCell>{row.receiver_phone}</StyledTableCell>
                <StyledTableCell>{row.delivery_address}</StyledTableCell>
                <StyledTableCell>{row.payment.name}</StyledTableCell>
                <StyledTableCell>{row.orderPaypalId}</StyledTableCell>
                <StyledTableCell>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })
                    : ''}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <div className="flex flex-wrap gap-2">
                    {row.status === Status.PENDING && (
                      <>
                        <ConfirmModalOrder
                          title="Accept"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.CONFIRMED);
                          }}
                        />
                        <ConfirmModalOrder
                          title="Cancel"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.CANCELLED);
                          }}
                        />
                      </>
                    )}
                    {row.status === Status.CONFIRMED && (
                      <ConfirmModalOrder
                        title="Shipping"
                        onConfirm={async () => {
                          await updateStatus(row.id, Status.SHIPPING);
                        }}
                      />
                    )}
                    {row.status === Status.SHIPPING && (
                      <>
                        <ConfirmModalOrder
                          title="Delivered"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.DELIVERED);
                          }}
                        />
                        <ConfirmModalOrder
                          title="Failed"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.FAILED);
                          }}
                        />
                      </>
                    )}
                    {row.status === Status.FAILED && (
                      <>
                        <ConfirmModalOrder
                          title="Re-Delivery"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.SHIPPING);
                          }}
                        />
                        <ConfirmModalOrder
                          title="Cancel"
                          onConfirm={async () => {
                            await updateStatus(row.id, Status.CANCELLED);
                          }}
                        />
                      </>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <OrderDetails order={row} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={params.page}
            onChange={handleChangePage}
            color="primary"
          />
        </Stack>
      </div>
    </>
  );
}
