import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import CardHeader from '@mui/material/CardHeader';
import { timelineItemClasses } from '@mui/lab/TimelineItem';

import TransactionItem from './transaction-item';

// ----------------------------------------------------------------------

export default function Transactions({ data, ...other }) {
  return (
    <Card {...other} sx={{ m: 2 }}>
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
            <TransactionItem key={item.id} item={item} lastTimeline={index === data.length - 1} />
          ))}
      </Timeline>
    </Card>
  );
}

Transactions.propTypes = {
  data: PropTypes.array,
};

// ----------------------------------------------------------------------
