import _ from 'lodash';
import * as React from 'react';
import { useSnackbar } from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  Tab,
  Box,
  List,
  Tabs,
  Stack,
  Divider,
  ListItem,
  Typography,
  IconButton,
  ToggleButton,
  ListSubheader,
  ToggleButtonGroup,
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { fRound } from 'src/utils/format-number';
import { randomInRange } from 'src/utils/common';

import { BetAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const MIN_BET_AMOUNT = 1;
const MAX_BET_AMOUNT = 55;

const TAB = {
  HANDICAP: 0,
  OVER_UNDER: 1,
};

export default function BetDialog(props) {
  const { user, initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { $emit, $on } = useEventBus();
  const downSm = useResponsive('down', 'sm');

  const confettiRef = React.useRef(null);

  const [betValue, setBetValue] = React.useState();
  const [betAmount, setBetAmount] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [match, setMatch] = React.useState();
  const [handicap, setHandicap] = React.useState({});
  const [overUnder, setOverUnder] = React.useState({});

  const onChangeBetAmount = (newVal) => {
    if (!user) return $emit('@dialog.auth.action.open');
    if (err) setErr('');
    setBetAmount(newVal);
  };

  const onChangeBetValue = (newVal) => {
    if (!_.isNil(newVal)) {
      setBetValue(newVal);
    }
  };

  const explodeConfetti = async () => {
    if (_.isNil(window.confetti)) return;
    const defaults = {
      zIndex: 9999,
    };

    window.confetti({
      ...defaults,
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      count: randomInRange(50, 100),
      position: { y: randomInRange(70, 80) },
    });
  };

  const validateBetAmount = (amount, balance = 0) => {
    let _err = '';
    if (amount < MIN_BET_AMOUNT) {
      _err = `Tiền cược tối thiểu ${MIN_BET_AMOUNT} chip`;
    } else if (amount > MAX_BET_AMOUNT) {
      _err = `Tiền cược tối đa là ${MAX_BET_AMOUNT} chip`;
    } else if (amount > balance) {
      _err = 'Số dư không đủ';
    }
    return _err;
  };

  const onBlurBetAmount = () => {
    setErr('');
    const error = validateBetAmount(betAmount, user?.balance);
    setErr(error);
  };

  const onChangeTab = (_e, newTab) => {
    if (newTab === TAB.HANDICAP) setBetValue(match?.firstTeamName);
    else if (newTab === TAB.OVER_UNDER) setBetValue('over');
    setTab(newTab);
  };

  const onBet = () => {
    if (!user) return $emit('@dialog.auth.action.open');

    if (!betValue) {
      if (tab === TAB.HANDICAP)
        return enqueueSnackbar(`Vui lòng chọn ${match?.firstTeamName} hoặc ${match?.secondTeamName}`, {
          variant: 'error',
        });
      if (tab === TAB.OVER_UNDER)
        return enqueueSnackbar(`Vui lòng chọn Tài hoặc Xỉu`, {
          variant: 'error',
        });
    }

    setErr('');
    setIsLoading(true);
    const error = validateBetAmount(betAmount, user?.balance);
    if (error) {
      setIsLoading(false);
      setErr(error);
      return;
    }

    const newBet = {
      user: user.id,
      match: match.id,
      value: betValue,
      amount: parseFloat(betAmount),
    };

    if (tab === TAB.HANDICAP) {
      newBet.type = 'handicap';
      newBet.handicap = handicap;
    } else if (tab === TAB.OVER_UNDER) {
      newBet.type = 'overUnder';
      newBet.overUnder = overUnder;
    }

    return BetAPI.create(newBet)
      .then(() => {
        explodeConfetti();
      })
      .then(() => {
        enqueueSnackbar('Đặt cược thành công!', {
          variant: 'success',
        });
      })
      .then(() => {
        initialize().then(() => {
          setErr('');
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onOpenConfirmationDialog = (e) => {
    e.preventDefault();

    $emit('dialog.confirmation.action.open', {
      callback: onBet,
    });
  };

  const onOpenRechargeDialog = () => $emit('@dialog.recharge.action.open');

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setErr('');
    setBetAmount(1);
  };

  React.useEffect(() => {
    $on('@dialog.bet.action.open', (data) => {
      if (_.isNil(data) || _.isNil(data.match))
        return enqueueSnackbar('Có lỗi xảy ra. Vui lòng reload lại trang!', {
          variant: 'error',
        });

      const { handicap: lastestHandicap, overUnder: latestOverUnder } = data.match;

      if (_.isNil(lastestHandicap) || _.isNil(latestOverUnder))
        return enqueueSnackbar('Có lỗi xảy ra. Vui lòng reload lại trang!', {
          variant: 'error',
        });

      setMatch(data.match);
      setHandicap(lastestHandicap);
      setOverUnder(latestOverUnder);

      if (tab === TAB.HANDICAP) setBetValue(data?.match?.firstTeamName);
      else if (tab === TAB.OVER_UNDER) setBetValue('over');

      onOpen();
    });
  }, [$on, enqueueSnackbar, tab, match]);

  React.useEffect(() => {
    if (window.confetti) {
      confettiRef.current = window.confetti;
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current = null;
      }
    };
  }, []);

  if (_.isNil(match) || _.isNil(handicap) || _.isNil(overUnder)) return <div />;

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: onOpenConfirmationDialog,
        noValidate: true,
      }}
      disableScrollLock
    >
      <DialogTitle>
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
        <Stack>
          <Tabs value={tab} onChange={onChangeTab} centered>
            <Tab label="Kèo chấp" />
            <Tab label="Kèo tài/xỉu" />
          </Tabs>

          <Box>
            {tab === TAB.HANDICAP && (
              <List
                dense
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    <Stack alignItems="center" sx={{ pt: 2 }}>
                      <Label>{fRound(handicap.threshold)} trái</Label>
                    </Stack>
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ToggleButtonGroup
                    color="secondary"
                    value={betValue}
                    onChange={(_e, newVal) => onChangeBetValue(newVal)}
                    exclusive
                    fullWidth
                  >
                    <ToggleButton value={match.firstTeamName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Stack direction={downSm ? 'column' : 'row'} alignItems="center" spacing={downSm ? 0.5 : 1}>
                          <Iconify
                            icon={`circle-flags:${match.firstTeamFlag}`}
                            height={downSm ? 24 : 32}
                            width={downSm ? 24 : 32}
                          />
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
                            {match.firstTeamName === match.topTeamName ? (
                              <strong>
                                <mark>{match.firstTeamName}</mark>
                              </strong>
                            ) : (
                              match.firstTeamName
                            )}
                          </Typography>
                        </Stack>
                        <Typography variant="caption">{fRound(handicap.firstTeamWinRate)}</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value={match.secondTeamName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Typography variant="caption">{fRound(handicap.secondTeamWinRate)}</Typography>
                        <Stack direction={downSm ? 'column-reverse' : 'row'} alignItems="center" spacing={downSm ? 0.5 : 1}>
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
                            {match.secondTeamName === match.topTeamName ? (
                              <strong>
                                <mark>{match.secondTeamName}</mark>
                              </strong>
                            ) : (
                              match.secondTeamName
                            )}
                          </Typography>
                          <Iconify
                            icon={`circle-flags:${match.secondTeamFlag}`}
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

            {tab === TAB.OVER_UNDER && (
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    <Stack alignItems="center" sx={{ pt: 2 }}>
                      <Label>{fRound(overUnder.threshold)} trái</Label>
                    </Stack>
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ToggleButtonGroup
                    color="secondary"
                    value={betValue}
                    onChange={(_e, newVal) => onChangeBetValue(newVal)}
                    exclusive
                    aria-label="text alignment"
                    fullWidth
                  >
                    <ToggleButton value="over">
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">Tài</Typography>
                        <Typography variant="caption">{fRound(overUnder.overWinRate)}</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="under">
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="caption">{fRound(overUnder.underWinRate)}</Typography>
                        <Typography variant="subtitle1">Xỉu</Typography>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItem>
              </List>
            )}
          </Box>

          <Divider>
            {user && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={0.5}>
                  <Typography noWrap variant="subtitle2">
                    Số dư:{' '}
                  </Typography>

                  <Label endIcon={<Iconify icon="material-symbols:poker-chip" />}>{fRound(user?.balance)}</Label>
                </Stack>
              </Stack>
            )}
          </Divider>

          
        </Stack>
      </DialogContent>
      
    </Dialog>
  );
}

BetDialog.propTypes = {};
