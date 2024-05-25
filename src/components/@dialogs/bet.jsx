import * as React from 'react';
import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Tab,
  List,
  Tabs,
  Stack,
  Slider,
  Divider,
  ListItem,
  TextField,
  Typography,
  IconButton,
  FormControl,
  ToggleButton,
  ListSubheader,
  InputAdornment,
  FormHelperText,
  ToggleButtonGroup,
  DialogContentText,
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { TransactionAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const MIN_BET_AMOUNT = 1;
const MAX_BET_AMOUNT = 70;

const TAB = {
  HANDICAP: 0,
  OVER_UNDER: 1,
};

export default function BetDialog(props) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { $emit, $on } = useEventBus();

  const smDown = useResponsive('down', 'sm');

  const [betValue, setBetValue] = React.useState();
  const [betAmount, setBetAmount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [match, setMatch] = React.useState();

  const onChangeBetAmount = (newVal) => {
    if (!user) return $emit('@dialog.auth.action.open');
    setBetAmount(newVal);
  };

  const onChangeBetValue = (newVal) => {
    setBetValue(newVal);
  };

  const onBlurBetAmount = () => {
    if (betAmount > user.balance) {
      setBetAmount(parseInt(user.balance, 10));
    } else if (betAmount < MIN_BET_AMOUNT) {
      setBetAmount(MIN_BET_AMOUNT);
    } else if (betAmount > MAX_BET_AMOUNT) {
      setBetAmount(MAX_BET_AMOUNT);
    }
  };

  const onChangeTab = (_, newTab) => {
    if (newTab === TAB.HANDICAP) setBetValue(match?.firstTeamName);
    else if (newTab === TAB.OVER_UNDER) setBetValue('over');
    setTab(newTab);
  };

  const onBet = (e) => {
    e.preventDefault();
    if (!user) return $emit('@dialog.auth.action.open');
    const newTransaction = {
      user: user.id,
      match: match.id,
      betType: tab === TAB.HANDICAP ? 'handicap' : 'overUnder',
      betValue,
      betAmount,
    };

    return TransactionAPI.create(newTransaction)
      .then(() =>
        enqueueSnackbar('Đặt cược thành công!', {
          variant: 'success',
        })
      )
      .then(() => onClose())
      .catch(() =>
        enqueueSnackbar('Đặt cược thất bại. Vui lòng thử lại!', {
          variant: 'error',
        })
      );
  };

  const onOpenRechargeDialog = () => $emit('@dialog.recharge.action.open');

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    $on('@dialog.bet.action.open', (data) => {
      console.log({ data });
      setMatch(data?.match);
      setBetValue(data?.match?.firstTeamName);
      onOpen();
    });
  }, [$on]);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: onBet,
      }}
    >
      <DialogTitle>
        <Grid2 container alignItems="center" justifyContent="start" spacing={1}>
          <Grid2 item lg={4}>
            <Stack alignItems="center" justifyContent="center">
              <Iconify icon={`flag:${match?.firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
              <Typography variant="subtitle2">{match?.firstTeamName}</Typography>
            </Stack>
          </Grid2>

          <Grid2 item lg={2}>
            <Stack>
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                VS
              </Typography>
            </Stack>
          </Grid2>

          <Grid2 item lg={4}>
            <Stack alignItems="center" justifyContent="center">
              <Iconify icon={`flag:${match?.secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
              <Typography variant="subtitle2">{match?.secondTeamName}</Typography>
            </Stack>
          </Grid2>
        </Grid2>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Đằng sau mỗi cú click chuột là tương lai của các bạn. Good luck!
        </DialogContentText>

        <Tabs value={tab} onChange={onChangeTab} centered>
          <Tab label="Kèo chấp" />
          <Tab label="Kèo tài/xỉu" />
        </Tabs>

        {tab === TAB.HANDICAP && (
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Label>{match?.handicap?.threshold.toFixed(1) || 0} trái</Label>
              </ListSubheader>
            }
          >
            <ListItem>
              <ToggleButtonGroup
                color="secondary"
                value={betValue}
                onChange={(_, newVal) => onChangeBetValue(newVal)}
                exclusive
                fullWidth
              >
                <ToggleButton value={match?.firstTeamName}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                  >
                    <Stack
                      direction={smDown ? 'column' : 'row'}
                      alignItems="center"
                      spacing={smDown ? 0 : 1}
                    >
                      <Iconify
                        icon={`flag:${match?.firstTeamFlag}`}
                        sx={{ height: 32, width: 32 }}
                      />
                      <Typography variant={smDown ? 'caption' : 'subtitle2'}>
                        {match?.firstTeamName}
                      </Typography>
                    </Stack>
                    <Typography variant="caption">
                      {match?.handicap?.firstTeamWinRate.toFixed(1) || 0}
                    </Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value={match?.secondTeamName}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="caption">
                      {match?.handicap?.secondTeamWinRate.toFixed(1) || 0}
                    </Typography>
                    <Stack
                      direction={smDown ? 'column-reverse' : 'row'}
                      alignItems="center"
                      spacing={smDown ? 0 : 1}
                    >
                      <Typography variant={smDown ? 'caption' : 'subtitle2'}>
                        {match?.secondTeamName}
                      </Typography>
                      <Iconify
                        icon={`flag:${match?.secondTeamFlag}`}
                        sx={{ height: 32, width: 32 }}
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
                <Label>{match?.overUnder?.threshold.toFixed(1) || 0} trái</Label>
              </ListSubheader>
            }
          >
            <ListItem>
              <ToggleButtonGroup
                color="secondary"
                value={betValue}
                onChange={(_, newVal) => onChangeBetValue(newVal)}
                exclusive
                aria-label="text alignment"
                fullWidth
              >
                <ToggleButton value="over">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="subtitle1">Tài</Typography>
                    <Typography variant="caption">
                      {match?.overUnder?.overWinRate.toFixed(1) || 0}
                    </Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value="under">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="caption">
                      {match?.overUnder?.underWinRate.toFixed(1) || 0}
                    </Typography>
                    <Typography variant="subtitle1">Xỉu</Typography>
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            </ListItem>
          </List>
        )}

        <Divider />

        <Grid2
          container
          spacing={2}
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ py: 2 }}
        >
          <Grid2 item lg={6} md={6} sm={10} xs={10}>
            <Slider
              value={typeof betAmount === 'number' ? betAmount : 0}
              min={MIN_BET_AMOUNT}
              max={MAX_BET_AMOUNT}
              marks={[
                {
                  value: MIN_BET_AMOUNT,
                  label: (
                    <Button
                      color="secondary"
                      size="small"
                      startIcon={<Iconify icon="mdi:dog" />}
                      onClick={() => onChangeBetAmount(MIN_BET_AMOUNT)}
                    >
                      Cún
                    </Button>
                  ),
                },
                {
                  value: 25,
                  label: (
                    <Button
                      color="warning"
                      size="small"
                      startIcon={<Iconify icon="mdi:human-male" />}
                      onClick={() => onChangeBetAmount(25)}
                    >
                      Người
                    </Button>
                  ),
                },
                {
                  value: MAX_BET_AMOUNT,
                  label: (
                    <Button
                      color="error"
                      size="small"
                      startIcon={<Iconify icon="mdi:emoticon-devil" />}
                      onClick={() => onChangeBetAmount(MAX_BET_AMOUNT)}
                    >
                      Quỷ
                    </Button>
                  ),
                },
              ]}
              onChange={(_, newVal) => onChangeBetAmount(newVal)}
            />
          </Grid2>

          <Grid2 item lg={4} md={4} sm={12} xs={12}>
            <FormControl fullWidth>
              <TextField
                value={betAmount}
                variant="outlined"
                label="Nhập tiền cược"
                fullWidth
                onChange={(e) => onChangeBetAmount(e.target.value)}
                onBlur={onBlurBetAmount}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="material-symbols:poker-chip" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: MIN_BET_AMOUNT,
                  max: MAX_BET_AMOUNT,
                  type: 'number',
                }}
              />
              <FormHelperText component="div">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" spacing={0.5}>
                    <Typography noWrap variant="subtitle2">
                      Số dư:{' '}
                    </Typography>

                    <Label endIcon={<Iconify icon="material-symbols:poker-chip" />}>
                      {user?.balance || 0}
                    </Label>
                  </Stack>

                  <Button
                    endIcon={<Iconify icon="material-symbols:poker-chip" />}
                    variant="outlined"
                    size="small"
                    onClick={onOpenRechargeDialog}
                  >
                    Nạp
                  </Button>
                </Stack>
              </FormHelperText>
            </FormControl>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button type="submit" fullWidth variant="contained" color="info">
          Đặt cược
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BetDialog.propTypes = {};
