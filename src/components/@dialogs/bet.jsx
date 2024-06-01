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
  Box,
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
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { BetAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const MIN_BET_AMOUNT = 1;
const MAX_BET_AMOUNT = 70;

const TAB = {
  HANDICAP: 0,
  OVER_UNDER: 1,
};

export default function BetDialog(props) {
  const { user, initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { $emit, $on } = useEventBus();

  const downSm = useResponsive('down', 'sm');

  const [betValue, setBetValue] = React.useState();
  const [betAmount, setBetAmount] = React.useState(1);
  const [err, setErr] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [match, setMatch] = React.useState();

  const onChangeBetAmount = (newVal) => {
    if (!user) return $emit('@dialog.auth.action.open');
    if (err) setErr('');
    setBetAmount(newVal);
  };

  const onChangeBetValue = (newVal) => {
    setBetValue(newVal);
  };

  const validateBetAmount = (amount, balance = 0) => {
    let _err = '';
    if (amount % 1 !== 0) {
      _err = 'Số chip không được lẻ';
    } else if (amount < MIN_BET_AMOUNT) {
      _err = 'Tối thiểu 1 chip';
    } else if (amount > MAX_BET_AMOUNT) {
      _err = 'Tối đa là 70 chip';
    } else if (amount > balance) {
      _err = 'Không đủ chip';
    }
    return _err;
  };

  const onBlurBetAmount = () => {
    setErr('');
    const error = validateBetAmount(betAmount, user?.balance);
    setErr(error);
  };

  const onChangeTab = (_, newTab) => {
    if (newTab === TAB.HANDICAP) setBetValue(match?.firstTeamName);
    else if (newTab === TAB.OVER_UNDER) setBetValue('over');
    setTab(newTab);
  };

  const onBet = (e) => {
    e.preventDefault();
    if (!user) return $emit('@dialog.auth.action.open');

    setErr('');
    const error = validateBetAmount(betAmount, user?.balance);
    if (error) return setErr(error);

    const newBet = {
      user: user.id,
      match: match.id,
      type: tab === TAB.HANDICAP ? 'handicap' : 'overUnder',
      value: betValue,
      amount: betAmount,
    };

    return BetAPI.create(newBet)
      .then(() => {
        enqueueSnackbar('Đặt cược thành công!', {
          variant: 'success',
        });
      })
      .then(() => {
        initialize().then(() => {
          onClose();
        });
      });
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
        noValidate: true,
      }}
      disableScrollLock
    >
      <DialogTitle>
        Đặt cược
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
                          direction={downSm ? 'column' : 'row'}
                          alignItems="center"
                          spacing={downSm ? 0 : 1}
                        >
                          <Iconify
                            icon={`flag:${match?.firstTeamFlag}`}
                            sx={{ height: 32, width: 32 }}
                          />
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
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
                          direction={downSm ? 'column-reverse' : 'row'}
                          alignItems="center"
                          spacing={downSm ? 0 : 1}
                        >
                          <Typography variant={downSm ? 'caption' : 'subtitle2'}>
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
          </Box>

          <Divider>
            {user && (
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
                  color="warning"
                  size="small"
                  onClick={onOpenRechargeDialog}
                >
                  Nạp thêm
                </Button>
              </Stack>
            )}
          </Divider>

          <Grid2
            container
            spacing={2}
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ pt: 2 }}
          >
            <Grid2 item lg={6} md={6} sm={10} xs={10}>
              <Slider
                value={betAmount}
                min={MIN_BET_AMOUNT}
                max={MAX_BET_AMOUNT}
                valueLabelDisplay='auto'
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

            <Grid2 item lg={4} md={4} sm={8} xs={10}>
              <FormControl fullWidth>
                <TextField
                  value={betAmount}
                  variant="outlined"
                  label="Nhập tiền cược"
                  required
                  error={Boolean(err)}
                  helperText={err}
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
                <FormHelperText component="div" />
              </FormControl>
            </Grid2>
          </Grid2>
        </Stack>
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
