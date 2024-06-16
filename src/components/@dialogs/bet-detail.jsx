import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useSWRConfig } from 'swr';
import { useSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Box,
  List,
  Stack,
  ListItem,
  Typography,
  IconButton,
  ToggleButton,
  ListSubheader,
  ToggleButtonGroup,
  DialogContentText,
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { fRound } from 'src/utils/format-number';

import { BetAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { MatchVersus } from '../match-versus';

const BET_TYPE = {
  HANDICAP: 'handicap',
  OVER_UNDER: 'overUnder',
};

export default function BetDetailDialog(props) {
  const { initialize } = useAuth();
  const { mutate } = useSWRConfig();
  const { $emit, $on } = useEventBus();
  const { enqueueSnackbar } = useSnackbar();
  const downSm = useResponsive('down', 'sm');

  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [bet, setBet] = React.useState();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onDeleteBet = () => {
    if (_.isNil(bet)) return;
    setIsLoading(true);
    return BetAPI.delete(bet.id)
      .then(() =>
        enqueueSnackbar('Hủy thành công!', {
          variant: 'success',
        })
      )
      .then(() => {
        initialize();
        mutate((key) => typeof key === 'string' && key.startsWith('/bets'));
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onOpenConfirmationDialog = () =>
    $emit('dialog.confirmation.action.open', {
      callback: onDeleteBet,
    });

  React.useEffect(() => {
    $on('@dialog.bet-detail.action.open', (data) => {
      if (_.isNil(data) || _.isNil(data.bet))
        return enqueueSnackbar('Có lỗi xảy ra. Vui lòng reload lại trang!', {
          variant: 'error',
        });

      console.log(data.bet);

      setBet(data.bet);

      onOpen();
    });
  }, [$on, enqueueSnackbar, bet]);

  if (_.isNil(bet)) return <div />;

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose} disableScrollLock>
      <DialogTitle>
        Chi tiết cược
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: {
              lg: 16,
              xs: 8,
            },
            top: {
              lg: 16,
              xs: 8,
            },
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <MatchVersus
            match={bet.match}
            showVersus
            sx={{
              justifyContent: {
                lg: 'flex-start',
                md: 'flex-start',
                sm: 'center',
                xs: 'center',
              },
            }}
          />
        </DialogContentText>
        <Stack>
          <Box>
            {bet.type === BET_TYPE.HANDICAP && (
              <List
                dense
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    <Stack alignItems="center" sx={{ pt: 2 }}>
                      <Label>{fRound(bet.handicap?.threshold)} trái</Label>
                    </Stack>
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ToggleButtonGroup color="secondary" value={bet.value} disabled exclusive fullWidth>
                    <ToggleButton value={bet.match?.firstTeamName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Stack direction={downSm ? 'column' : 'row'} alignItems="center" spacing={downSm ? 0.5 : 1}>
                          <Iconify
                            icon={`circle-flags:${bet.match?.firstTeamFlag}`}
                            height={downSm ? 24 : 32}
                            width={downSm ? 24 : 32}
                          />
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
                            {bet.match?.firstTeamName === bet.match?.topTeamName ? (
                              <strong>
                                <mark>{bet.match?.firstTeamName}</mark>
                              </strong>
                            ) : (
                              bet.match?.firstTeamName
                            )}
                          </Typography>
                        </Stack>
                        <Typography variant="caption">{fRound(bet.handicap?.firstTeamWinRate)}</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value={bet.match?.secondTeamName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Typography variant="caption">{fRound(bet.handicap?.secondTeamWinRate)}</Typography>
                        <Stack direction={downSm ? 'column-reverse' : 'row'} alignItems="center" spacing={downSm ? 0.5 : 1}>
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
                            {bet.match?.secondTeamName === bet.match?.topTeamName ? (
                              <strong>
                                <mark>{bet.match?.secondTeamName}</mark>
                              </strong>
                            ) : (
                              bet.match?.secondTeamName
                            )}
                          </Typography>
                          <Iconify
                            icon={`circle-flags:${bet.match?.secondTeamFlag}`}
                            height={downSm ? 24 : 32}
                            width={downSm ? 24 : 32}
                          />
                        </Stack>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItem>
              </List>
            )}

            {bet.type === BET_TYPE.OVER_UNDER && (
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    <Stack alignItems="center" sx={{ pt: 2 }}>
                      <Label>{fRound(bet.overUnder?.threshold)} trái</Label>
                    </Stack>
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ToggleButtonGroup
                    color="secondary"
                    value={bet.value}
                    disabled
                    exclusive
                    aria-label="text alignment"
                    fullWidth
                  >
                    <ToggleButton value="over">
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">Tài</Typography>
                        <Typography variant="caption">{fRound(bet.overUnder?.overWinRate)}</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="under">
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="caption">{fRound(bet.overUnder?.underWinRate)}</Typography>
                        <Typography variant="subtitle1">Xỉu</Typography>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItem>
              </List>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="error"
          loading={isLoading}
          disabled={
            moment().isSameOrAfter(moment(bet?.match?.datetime)) ||
            !_.isNil(bet?.match?.result?.firstTeamScore) ||
            !_.isNil(bet?.match?.result?.secondTeamScore) ||
            bet.winOrLoseType
          }
          onClick={onOpenConfirmationDialog}
        >
          Hủy cược
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

BetDetailDialog.propTypes = {};
