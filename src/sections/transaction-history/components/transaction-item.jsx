import moment from 'moment';
import PropTypes from 'prop-types';

import {
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineOppositeContent,
} from '@mui/lab';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function TransactionItem({ item, lastTimeline }) {
  const { type, amount, createdAt } = item;
  return (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary" variant="subtitle2">
        <Label startIcon={<Iconify icon="mingcute:time-line" />} variant="ghost">
        {moment(createdAt).format('DD/MM HH:mm')}
        </Label>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={type === 'recharge' ? 'success' : 'error'} variant='outlined' />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Label
          color={type === 'recharge' ? 'success' : 'error'}
          endIcon={<Iconify icon="material-symbols:poker-chip" />}
        >
          {type === 'recharge' ? '+' : '-'} {amount}
        </Label>
      </TimelineContent>
    </TimelineItem>
  );
}

TransactionItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
};
