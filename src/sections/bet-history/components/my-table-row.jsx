import _ from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Stack } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { MatchVersus } from 'src/components/match-versus';

// ----------------------------------------------------------------------

export default function MyTableRow({ row }) {
  const { match, value, amount, type, profit, loss, winOrLoseType } = row;


  const betFormula = useMemo(() => {
    if(_.isNil(winOrLoseType)) return '';
    if(winOrLoseType === 'winFull') return `Số chip đã đặt * tỉ lệ cược`
    if(winOrLoseType === 'winHalf') return `(Số chip đã đặt * tỉ lệ cược) / 2`
    if(winOrLoseType === 'loseFull') return `Mất toàn bộ tiền cược`
    if(winOrLoseType === 'loseHalf') return `Số chip đã đặt / 2`
  }, [winOrLoseType])

  const getResultType = (_winOrLoseType) => {
    let result = '';

    if (_winOrLoseType === 'draw') result = 'Hòa';
    if (_winOrLoseType === 'winFull') result = 'Thắng đủ';
    if (_winOrLoseType === 'winHalf') result = 'Thắng nửa';
    if (_winOrLoseType === 'loseFull') result = 'Thua đủ';
    if (_winOrLoseType === 'loseHalf') result = 'Thua nửa';

    return result;
  };

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        <MatchVersus match={match} showResult />
      </TableCell>

      <TableCell>
        <Label startIcon={<Iconify icon="mingcute:calendar-2-line" />}>
          {moment(match?.datetime).format('DD/MM HH:mm')}
        </Label>
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
        <Stack alignItems="center" spacing={1}>
          {getResultType(winOrLoseType)}
          {winOrLoseType && (
            <Typography variant='caption'>
              {betFormula}
            </Typography>
          )}
        </Stack>
      </TableCell>
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
