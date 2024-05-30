import QueryString from 'qs';

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
  const { items: transactions, isLoading } = useData(
    user
      ? `/transactions?${QueryString.stringify({
          populate: ['user'],
          filters: {
            user: {
              id: user.id,
            },
          },
        })}`
      : undefined
  );

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
          {transactions &&
            transactions.map((item, index) => (
              <Transaction
                key={item.id}
                item={item}
                lastTimeline={index === transactions.length - 1}
              />
            ))}

          {isLoading && <Loader />}

          {!isLoading && transactions.length === 0 && <Empty />}
        </Timeline>
      </Card>
    </Container>
  );
}
