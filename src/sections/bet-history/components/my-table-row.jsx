import _ from 'lodash';
import PropTypes from 'prop-types';

import { Stack } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import useEventBus from 'src/hooks/event-bus';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MyTableRow({ row }) {
  const { match, value, amount, type, profit, loss, winOrLoseType } = row;

  const { $emit } = useEventBus();

  const getResultType = (_winOrLoseType) => {
    let result = '';

    if (_winOrLoseType === 'draw') result = 'Hòa';
    if (_winOrLoseType === 'winFull') result = 'Thắng đủ';
    if (_winOrLoseType === 'winHalf') result = 'Thắng nửa';
    if (_winOrLoseType === 'loseFull') result = 'Thua đủ';
    if (_winOrLoseType === 'loseHalf') result = 'Thua nửa';

    return result;
  };

  const onOpenBetDetail = () => $emit('@dialog.bet-detail.action.open', { bet: row });

  return (
    <TableRow hover tabIndex={-1} disabled onClick={onOpenBetDetail}>
      <TableCell>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography variant="caption">
              {match.firstTeamName === match.topTeamName ? (
                <mark>
                  <strong>{match.firstTeamName}</strong>
                </mark>
              ) : (
                match.firstTeamName
              )}
            </Typography>
            <Typography variant="caption">
              {' '}
              {match.secondTeamName === match.topTeamName ? (
                <mark>
                  <strong>{match.secondTeamName}</strong>
                </mark>
              ) : (
                match.secondTeamName
              )}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="caption">{match?.result?.firstTeamScore ?? '-'}</Typography>
            <Typography variant="caption">{match?.result?.secondTeamScore ?? '-'}</Typography>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        <Label color={type === 'handicap' ? 'primary' : 'secondary'}>{type === 'handicap' ? 'Chấp' : 'Tài/Xỉu'}</Label>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">{type === 'handicap' ? value : value === 'over' ? 'Tài' : 'Xỉu'}</Typography>
      </TableCell>

      <TableCell>{amount}</TableCell>
      <TableCell>
        <Stack alignItems="center" spacing={1}>
          {getResultType(winOrLoseType)}
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
