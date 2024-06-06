import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import Label from '../label';
import Iconify from '../iconify';

const MatchVersus = ({
  match = {},
  showResult,
  showVersus,
  showType,
  showDatetime,
  isComingMatch,
  sx,
}) => {
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
  const iconSize = isComingMatch ? 64 : 32;

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
      {...sx}
    >
      <Grid2 item lg={2} md={3} sm={3} xs={3}>
        <Stack alignItems="center" justifyContent="center">
          <Iconify icon={`circle-flags:${firstTeamFlag}`} height={iconSize} width={iconSize} />
          <Typography noWrap variant="caption" sx={{ textAlign: 'center' }}>
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
              <Label>{_.isNil(result?.firstTeamScore) ? '-' : result?.firstTeamScore}</Label>
              <Typography>:</Typography>
              <Label>{_.isNil(result?.secondTeamScore) ? '-' : result?.secondTeamScore}</Label>
            </Stack>
          )}

          {showVersus && (
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              VS
            </Typography>
          )}

          {showDatetime && (
            <Stack alignItems="center" gap={0.5}>
              <Label variant="outlined" startIcon={<Iconify icon="mingcute:calendar-2-line" />}>
                {moment(datetime).format('DD/MM | HH:mm')}
              </Label>
              {isComingMatch && (
                <Label color="warning" startIcon={<Iconify icon="svg-spinners:3-dots-scale" />}>
                  Sắp diễn ra
                </Label>
              )}
            </Stack>
          )}
        </Stack>
      </Grid2>

      <Grid2 item lg={2} md={3} sm={3} xs={3}>
        <Stack alignItems="center" justifyContent="center">
          <Iconify icon={`circle-flags:${secondTeamFlag}`} sx={{ height: iconSize, width: iconSize }} />
          <Typography noWrap variant="caption" sx={{ textAlign: 'center' }}>
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
  isComingMatch: PropTypes.bool,
  sx: PropTypes.object,
};

export default MatchVersus;
