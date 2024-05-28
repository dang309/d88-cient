import QueryString from 'qs';
import { useMemo } from 'react';

import Container from '@mui/material/Container';
import { Card, CardHeader } from '@mui/material';
import { Timeline, timelineItemClasses } from '@mui/lab';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';

import { Empty, Loader } from 'src/components/common';

import Transaction from '../components/transaction';

// ----------------------------------------------------------------------

export default function AppView() {
  const { user } = useAuth();
  const { items: recharges, isLoading: isLoadingRecharges } = useData(
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
  const { items: withdraws, isLoading: isLoadingWithdraws } = useData(
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
      <Card>
        <CardHeader title="Lịch sử nạp/rút" />

        <Timeline
          sx={{
            m: 0,
            p: 3,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {data &&
            data.map((item, index) => (
              <Transaction key={item.id} item={item} lastTimeline={index === data.length - 1} />
            ))}

          {(isLoadingRecharges || isLoadingWithdraws) && <Loader />}

          {!isLoadingRecharges && !isLoadingWithdraws && data.length === 0 && <Empty />}
        </Timeline>
      </Card>
    </Container>
  );
}
