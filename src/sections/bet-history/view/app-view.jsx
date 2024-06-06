import qs from 'qs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { CardContent, TablePagination } from '@mui/material';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';

import { Loader } from 'src/components/common';
import Scrollbar from 'src/components/scrollbar';

import MyTableRow from '../components/my-table-row';
import MyTableHead from '../components/my-table-head';
import MyTableNoData from '../components/my-table-no-data';

// ----------------------------------------------------------------------

const HEAD_LABELS = [
  { id: 'match', label: 'Trận', align: 'center' },
  { id: 'datetime', label: 'Thời gian' },
  { id: 'betType', label: 'Kèo' },
  { id: 'betValue', label: 'Đã đặt' },
  { id: 'betAmount', label: 'Chip đã đặt' },
  { id: 'profitOrLoss', label: 'Thắng/ Thua' },
];

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

export default function BetHistoryPage() {
  const { user } = useAuth();

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);

  const {
    items: bets,
    isLoading,
    pagination,
  } = useData(
    user
      ? `/bets?${qs.stringify({
          populate: {
            match: {
              populate: ['result'],
            },
          },
          sort: ['createdAt:desc'],
          pagination: {
            page,
            pageSize: rowsPerPage,
          },
          filters: {
            user: {
              id: user.id,
            },
          },
        })}`
      : undefined
  );

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(DEFAULT_PAGE);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <Container>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }} size="small">
                <MyTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={bets?.length || 0}
                  onRequestSort={handleSort}
                  headLabel={HEAD_LABELS}
                />
                <TableBody>
                  {bets.map((row) => (
                    <MyTableRow key={row.id} row={row} />
                  ))}

                  {!isLoading && bets && bets.length === 0 && <MyTableNoData />}
                </TableBody>
              </Table>

              {isLoading && <Loader />}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={pagination?.total}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage=""
          />
        </CardContent>
      </Card>
    </Container>
  );
}
