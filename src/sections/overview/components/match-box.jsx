import moment from 'moment';
import PropTypes from 'prop-types';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Card, Stack, Button, Typography, CardContent, CardActions } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const MatchBox = ({ match }) => {
  const { $emit } = useEventBus();
  const downSm = useResponsive('down', 'sm');

  const onOpenBetDialog = () => $emit('@dialog.bet.action.open', { match });

  return (
    <Card>
      <CardContent>
        <Grid2 container justifyContent="space-evenly" alignItems="start" spacing={2}>
          <Grid2 item lg={4} md={4} sm={4} xs={4}>
            <Stack alignItems="center" justifyContent="center">
              <Iconify icon={`flag:${match.firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
              <Typography variant={downSm ? 'caption' : 'subtitle2'} sx={{ textAlign: 'center' }}>
                {match?.topTeamName === match?.firstTeamName ? <mark><strong>{match?.firstTeamName}</strong></mark> : match?.firstTeamName}
              </Typography>
            </Stack>
          </Grid2>

          <Grid2 item lg={2} md={2} sm={3} xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Label color="info">Vòng bảng</Label>

              <Stack direction="row" spacing={1}>
                <Label>{match?.result?.firstTeamScore || '-'}</Label>
                <Typography>:</Typography>
                <Label>{match?.result?.secondTeamScore || '-'}</Label>
              </Stack>

              <Stack direction="row" alignItems="center" gap={0.5}>
                <Label color="warning" startIcon={<Iconify icon="mingcute:calendar-2-line" />}>
                  {moment(match?.datetime).format('DD/MM')}
                </Label>
                <Label color="success" startIcon={<Iconify icon="mingcute:time-line" />}>
                  {moment(match?.datetime).format('HH:mm')}
                </Label>
              </Stack>
            </Stack>
          </Grid2>

          <Grid2 item lg={4} md={4} sm={4} xs={4}>
            <Stack alignItems="center" justifyContent="center">
              <Iconify icon={`flag:${match.secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
              <Typography variant={downSm ? 'caption' : 'subtitle2'} sx={{ textAlign: 'center' }}>
                {match?.topTeamName === match?.secondTeamName ? <mark><strong>{match?.secondTeamName}</strong></mark> : match?.secondTeamName}
              </Typography>
            </Stack>
          </Grid2>
        </Grid2>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" onClick={onOpenBetDialog}>
          Xem kèo
        </Button>
      </CardActions>
    </Card>
  );
};

MatchBox.propTypes = {
  match: PropTypes.object,
};

export default MatchBox;
