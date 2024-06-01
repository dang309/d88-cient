import qs from 'qs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';

import Scrollbar from 'src/components/scrollbar';

import MyTableRow from '../components/my-table-row';
import MyTableHead from '../components/my-table-head';
import MyTableNoData from '../components/my-table-no-data';
import { applyFilter, getComparator } from '../components/utils';

// ----------------------------------------------------------------------

const HEAD_LABELS = [
  { id: 'match', label: 'Trận', align: 'center' },
  { id: 'datetime', label: 'Thời gian' },
  { id: 'betType', label: 'Kèo' },
  { id: 'betValue', label: 'Đã đặt' },
  { id: 'betAmount', label: 'Chip đã đặt' },
  { id: 'profit', label: 'Thắng' },
  { id: 'loss', label: 'Thua' },
];

export default function BetHistoryPage() {
  const { user } = useAuth();
  const { items: bets } = useData(
    user
      ? `/bets?${qs.stringify({
          populate: ['match', 'user'],
          sort: ['createdAt:desc'],
          filters: {
            user: {
              id: user.id,
            },
          },
        })}`
      : undefined
  );


  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setPage(0);
  //   setRowsPerPage(parseInt(event.target.value, 10));
  // };

  const dataFiltered = applyFilter({
    inputData: bets,
    comparator: getComparator(order, orderBy),
  });

  const notFound = !dataFiltered.length;

  return (
    <Container>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MyTableHead
                order={order}
                orderBy={orderBy}
                rowCount={bets?.length || 0}
                onRequestSort={handleSort}
                headLabel={HEAD_LABELS}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <MyTableRow key={row.id} row={row} />
                  ))}

                {notFound && <MyTableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <TablePagination
          page={page}
          component="div"
          count={bets?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
        /> */}
      </Card>
    </Container>
  );
}
