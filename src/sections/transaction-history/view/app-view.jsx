import QueryString from 'qs';
import { useMemo } from 'react';

import Container from '@mui/material/Container';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';

import Transactions from '../components/transactions';

// ----------------------------------------------------------------------

export default function AppView() {
  const { user } = useAuth();
  const { items: recharges } = useData(
    user
      ? `/recharges?${QueryString.stringify({
          populate: ['user'],
          filters: {
            user: {
              id: user.id,
            },
          },
        })}`
      : undefined
  );
  const { items: withdraws } = useData(
    user
      ? `/withdraws?${QueryString.stringify({
          populate: ['user'],
          filters: {
            user: {
              id: user.id,
            },
          },
        })}`
      : undefined
  );

  const data = useMemo(() => {
    if (recharges && withdraws) {
      return recharges
        .map((item) => ({
          ...item,
          type: 'recharge',
        }))
        .concat(
          withdraws.map((item) => ({
            ...item,
            type: 'withdraw',
          }))
        )
        .sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
    }
    return [];
  }, [recharges, withdraws]);

  return (
    <Container>
      <Transactions data={data} />
    </Container>
  );
}
