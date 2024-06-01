import moment from 'moment';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MyTableRow({ row }) {
  const { match, value, amount, type } = row;
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        <Grid2 container justifyContent="space-evenly" alignItems="center" spacing={{
          lg: 0.5,
          xs: 6
        }}>
          <Grid2 item lg={4} md={4} sm={3} xs={3}>
            <Stack alignItems="center" justifyContent="center">
              <Iconify
                icon={`flag:${match.firstTeamFlag}`}
                sx={{
                  height: {
                    lg: 32,
                    xs: 24,
                  },
                  width: {
                    lg: 32,
                    xs: 24,
                  },
                }}
              />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                {match?.firstTeamName}
              </Typography>
            </Stack>
          </Grid2>

          <Grid2 item lg={2} md={2} sm={1} xs={1}>
            <Stack alignItems="center" spacing={1}>
              <Stack direction="row" spacing={1}>
                <Label>{match?.result?.firstTeamScore || '-'}</Label>
                <Typography>:</Typography>
                <Label>{match?.result?.secondTeamScore || '-'}</Label>
              </Stack>
            </Stack>
          </Grid2>

          <Grid2 item lg={4} md={4} sm={3} xs={3}>
            <Stack alignItems="center" justifyContent="center" gap={0.5}>
              <Iconify
                icon={`flag:${match.secondTeamFlag}`}
                sx={{
                  height: {
                    lg: 32,
                    xs: 24,
                  },
                  width: {
                    lg: 32,
                    xs: 24,
                  },
                }}
              />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                {match?.secondTeamName}
              </Typography>
            </Stack>
          </Grid2>
        </Grid2>
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
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
}

MyTableRow.propTypes = {
  row: PropTypes.object,
};
