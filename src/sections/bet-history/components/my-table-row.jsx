import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { MatchVersus } from 'src/components/match-versus';

// ----------------------------------------------------------------------

export default function MyTableRow({ row }) {
  const { match, value, amount, type, profit, loss, winOrLoseType } = row;
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        <MatchVersus match={match} showResult />
      </TableCell>

      <TableCell>
        <Stack gap={0.5}>
          <Label color="warning" startIcon={<Iconify icon="mingcute:calendar-2-line" />}>
            {moment(match?.datetime).format('DD/MM')}
          </Label>
          <Label color="success" startIcon={<Iconify icon="mingcute:time-line" />}>
            {moment(match?.datetime).format('HH:mm')}
          </Label>
        </Stack>
      </TableCell>

      <TableCell>
        <Label color={type === 'handicap' ? 'primary' : 'secondary'}>
          {type === 'handicap' ? 'Chấp' : 'Tài/Xỉu'}
        </Label>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">
          {type === 'handicap' ? value : value === 'over' ? 'Tài' : 'Xỉu'}
        </Typography>
      </TableCell>

      <TableCell>{amount}</TableCell>
      <TableCell>
        {(_.isNil(profit) || _.isNil(loss) || _.isNil(winOrLoseType)) && '-'}

        {winOrLoseType && profit === 0 && loss === 0 && (
          <Label endIcon={<Iconify icon="material-symbols:poker-chip" />}>0</Label>
        )}

        {winOrLoseType && profit !== 0 && (
          <Label color="success" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
            + {profit}
          </Label>
        )}

        {winOrLoseType && loss !== 0 && (
          <Label color="error" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
            - {loss}
          </Label>
        )}
      </TableCell>
    </TableRow>
  );
}

MyTableRow.propTypes = {
  row: PropTypes.object,
};
