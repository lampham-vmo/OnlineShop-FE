/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useAuthStore } from '@/stores/authStore';
import {
  EPaymentMethodStatus,
  EPermissionPaymentMethod,
} from './payment-method.validation';
import { useEffect, useState } from 'react';
import { PaymentMethodResponseDto } from '@/generated/api/models';
import { getPaymentMethod } from '@/generated/api/endpoints/payment-method/payment-method';
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ChangeStatusPaymentMethod from './ChangeStatusPaymentMethod';
import CreatePaymentMethod from './CreatePaymentMethod';

interface ColumnData {
  dataKey: keyof PaymentMethodResponseDto;
  label: string;
  numeric?: boolean;
  width?: number;
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
];

const ManagePaymentMethod = () => {
  const { isAcceptPermission } = useAuthStore();

  const [dataPaymentMethods, setDataPaymentMethods] = useState<
    PaymentMethodResponseDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { paymentMethodControllerFindAll } = getPaymentMethod();

  const getListPaymentMethod = async () => {
    try {
      const response = await paymentMethodControllerFindAll();
      setDataPaymentMethods(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListPaymentMethod();
  }, []);

  if (loading) {
    return (
      <>
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error || dataPaymentMethods.length === 0) {
    return (
      <div className="text-center py-5 text-3xl text-dark">
        There are no payment method available
      </div>
    );
  }

  return (
    <Box>
      {/* Block Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Payment Method
      </Typography>

      {/* Block Create */}
      {isAcceptPermission([EPermissionPaymentMethod.CREATE_PAYMENT_METHOD]) && (
        <CreatePaymentMethod onSuccess={getListPaymentMethod} />
      )}

      {/* Table Payment Method */}
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
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPaymentMethods.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                    sx={{ backgroundColor: 'background.paper' }}
                  >
                    {item[column.dataKey]}
                  </TableCell>
                ))}
                <TableCell align="left">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-start"
                  >
                    {isAcceptPermission([
                      EPermissionPaymentMethod.CHANGE_STATUS_PAYMENT_METHOD,
                    ]) ? (
                      <ChangeStatusPaymentMethod
                        paymentMethod={item}
                        onSuccess={getListPaymentMethod}
                      />
                    ) : (
                      <>
                        {item.status === EPaymentMethodStatus.ACTIVE ? (
                          <Chip
                            label={item.status.toUpperCase()}
                            color="success"
                            variant="filled"
                          />
                        ) : (
                          <Chip
                            label={item.status.toUpperCase()}
                            color="error"
                            variant="filled"
                          />
                        )}
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DisplayPaymentMethod = () => {
  const { isAcceptPermission } = useAuthStore();
  if (!isAcceptPermission([EPermissionPaymentMethod.GET_ALL_PAYMENT_METHOD])) {
    return (
      <div className="text-dark text-4xl text-center font-semibold">
        403 Forbidden Resource
      </div>
    );
  }

  return <ManagePaymentMethod />;
};

export default DisplayPaymentMethod;
