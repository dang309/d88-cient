import moment from 'moment';
import PropTypes from 'prop-types';

import { Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import Label from '../label';
import Iconify from '../iconify';

const MatchVersus = ({ match = {}, showResult, showVersus, showType, showDatetime }) => {
  const {
    firstTeamFlag,
    firstTeamName,
    secondTeamFlag,
    secondTeamName,
    topTeamName,
    datetime,
    result,
  } = match;

  const isFirstTeamTop = topTeamName === firstTeamName;
  const isSecondTeamTop = topTeamName === secondTeamName;

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="space-evenly"
      spacing={{
        lg: 1,
        md: 4,
        sm: 4,
        xs: 4,
      }}
    >
      <Grid2 item lg={2} md={3} sm={3} xs={3}>
        <Stack alignItems="center" justifyContent="center">
          <Iconify icon={`flag:${firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
          <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
            {isFirstTeamTop ? (
              <mark>
                <strong>{firstTeamName}</strong>
              </mark>
            ) : (
              firstTeamName
            )}
          </Typography>
        </Stack>
      </Grid2>

      <Grid2 item lg={4} md={4} sm={4} xs={4}>
        <Stack alignItems="center" spacing={1}>
          {showType && <Label color="info">Vòng bảng</Label>}

          {showResult && (
            <Stack direction="row" spacing={1}>
              <Label>{result?.firstTeamScore || '-'}</Label>
              <Typography>:</Typography>
              <Label>{result?.secondTeamScore || '-'}</Label>
            </Stack>
          )}

          {showVersus && (
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              VS
            </Typography>
          )}

          {showDatetime && (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Label color="warning" startIcon={<Iconify icon="mingcute:calendar-2-line" />}>
                {moment(datetime).format('DD/MM')}
              </Label>
              <Label color="success" startIcon={<Iconify icon="mingcute:time-line" />}>
                {moment(datetime).format('HH:mm')}
              </Label>
            </Stack>
          )}
        </Stack>
      </Grid2>

      <Grid2 item lg={2} md={3} sm={3} xs={3}>
        <Stack alignItems="center" justifyContent="center">
          <Iconify icon={`flag:${secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
          <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
            {isSecondTeamTop ? (
              <mark>
                <strong>{secondTeamName}</strong>
              </mark>
            ) : (
              secondTeamName
            )}
          </Typography>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

MatchVersus.propTypes = {
  match: PropTypes.object,
  showResult: PropTypes.bool,
  showVersus: PropTypes.bool,
  showType: PropTypes.bool,
  showDatetime: PropTypes.bool,
};

export default MatchVersus;
