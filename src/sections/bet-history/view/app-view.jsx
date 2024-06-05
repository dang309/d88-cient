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
  { id: 'profitOrLoss', label: 'Thắng/ Thua' },
  ];

export default function BetHistoryPage() {
  const { user } = useAuth();
  const { items: bets } = useData(
    user
      ? `/bets?${qs.stringify({
          populate: {
            match: {
              populate: ['result']
            }
          },
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
                {dataFiltered.map((row) => (
                  <MyTableRow key={row.id} row={row} />
                ))}

                {notFound && <MyTableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}
