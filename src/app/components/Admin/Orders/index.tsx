'use client'
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
import { Button, Chip, MenuItem, Pagination, Select, Stack } from '@mui/material';

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
    const {ordersControllerFindAll,ordersControllerChangeStatus} = getOrders()
    const [orderData,SetOrderData] = React.useState<OrderResponseDTO[]>([])
    const [params,setParams] = React.useState({page: 1})
    const [totalPages, setTotalPages] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState(0);
    const [status, setStatus] = React.useState<Status>()
    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setParams((prev) => ({ ...prev, page: value }));
    };
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PENDING':
          return 'warning';
        case 'UNPAID':
          return 'default';
        case 'CONFIRMED':
          return 'info'; // CONFIRMED sẽ là màu "info"
        case 'SHIPPING':
          return 'primary'; // SHIPPING nên là primary (đang vận chuyển)
        case 'DELIVERED':
          return 'success'; // giao thành công
        case 'CANCELLED':
          return 'error'; // hủy
        case 'FAILED':
          return 'error'; // lỗi giao cũng error
        default:
          return 'default';
      }
    };



    enum Status{
      UNPAID = 'UNPAID',              
      PENDING = 'PENDING',               
      CONFIRMED = 'CONFIRMED',           
      SHIPPING = 'SHIPPING',            
      DELIVERED = 'DELIVERED',           
      CANCELLED = 'CANCELLED',           
      FAILED = 'FAILED'  
    }
    const getListOrder = async()=>{
        const data  = await ordersControllerFindAll(params)
        SetOrderData(data.data.order)
        setTotalPages(data.data.pagination.totalPages || 1);
        setTotalItems(data.data.pagination.totalItems || 0);
    }
    const updateStatus = async(id:number,status: Status) => {
      const data = await ordersControllerChangeStatus({id: id.toString(),status: status})
      getListOrder()
    }
    React.useEffect(()=>{
        getListOrder()
    },[params])
  return (
    <>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell>{row.receiver}</StyledTableCell>
              <StyledTableCell>{row.receiver_phone}</StyledTableCell>
              <StyledTableCell>{row.delivery_address}</StyledTableCell>
              <StyledTableCell>{row.payment.name}</StyledTableCell>
              <StyledTableCell>{row.orderPaypalId}</StyledTableCell>
              <StyledTableCell>
                {row.createdAt ? new Date(row.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }) : ''}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                </StyledTableCell>

                <StyledTableCell >
                  <div className="flex gap-x-2">

                    {row.status === Status.PENDING && (
                      <>
                        <Button variant="contained" onClick={() => {
                          updateStatus(row.id, Status.CONFIRMED)
                          setStatus(Status.CONFIRMED)
                        }}>Accept</Button>
                        <Button variant="contained" onClick={() => {
                          updateStatus(row.id, Status.CANCELLED)
                          setStatus(Status.CANCELLED)
                        }
                          } color="error">Cancel</Button>
                      </>
                    )}

                    {row.status === Status.CONFIRMED && (
                      <Button variant="contained" onClick={() => {updateStatus(row.id, Status.SHIPPING)
                        setStatus(Status.SHIPPING)
                      }}>Shipping</Button>
                    )}

                    {row.status === Status.SHIPPING && (
                      <>
                        <Button variant="contained" onClick={() => {updateStatus(row.id, Status.DELIVERED)
                          setStatus(Status.DELIVERED)
                        }}>Delivered</Button>
                        <Button variant="contained" onClick={() => {updateStatus(row.id, Status.FAILED)
                          setStatus(Status.FAILED)
                        }} color="warning">Failed</Button>
                      </>
                    )}

                    {row.status === Status.FAILED && (
                      <>
                        <Button variant="contained" onClick={() => {updateStatus(row.id, Status.SHIPPING)
                          setStatus(Status.SHIPPING)
                        }}>Re-Delivery</Button>
                        <Button variant="contained" onClick={() => {updateStatus(row.id, Status.CANCELLED)
                          setStatus(Status.CANCELLED)
                        }} color="error">Cancel</Button>
                      </>
                    )}
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
    </>
  );
}