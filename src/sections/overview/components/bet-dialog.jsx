import * as React from 'react';
import PropTypes from 'prop-types';
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
  FormControl,
  ToggleButton,
  ListSubheader,
  InputAdornment,
  FormHelperText,
  ToggleButtonGroup,
  DialogContentText,
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import { useResponsive } from 'src/hooks/use-responsive';

import { TransactionAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import ConfirmationDialog from 'src/components/@dialogs/confirmation';

const MIN_BET_AMOUNT = 1;
const MAX_BET_AMOUNT = 70;

const TAB = {
  HANDICAP: 0,
  OVER_UNDER: 1,
};

export default function BetDialog(props) {
  const { match } = props;

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const smDown = useResponsive('down', 'sm');

  const [betValue, setBetValue] = React.useState(match?.firstTeamName);
  const [betAmount, setBetAmount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);

  const onChangeBetAmount = (newVal) => {
    setBetAmount(newVal);
  };

  const onChangeBetValue = (newVal) => {
    setBetValue(newVal);
  };

  const onBlurBetAmount = () => {
    if (betAmount < MIN_BET_AMOUNT) {
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

  const onBet = (isConfirmed) => {
    if (isConfirmed) {
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
        .then(() => handleClose())
        .catch(() =>
          enqueueSnackbar('Đặt cược thất bại. Vui lòng thử lại!', {
            variant: 'error',
          })
        );
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" fullWidth onClick={handleClickOpen}>
        Xem kèo
      </Button>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const { email } = formJson;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>
          <Grid2 container alignItems="center" justifyContent="space-evenly" spacing={1}>
            <Grid2 item lg={4}>
              <Stack alignItems="center" justifyContent="center">
                <Iconify icon={`flag:${match.firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
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
                <Iconify icon={`flag:${match.secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
                <Typography variant="subtitle2">{match?.secondTeamName}</Typography>
              </Stack>
            </Grid2>
          </Grid2>
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
                          icon={`flag:${match.firstTeamFlag}`}
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
                          icon={`flag:${match.secondTeamFlag}`}
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
            <Grid2 item lg={6} md={8} sm={10} xs={10}>
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
                <FormHelperText>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography>1</Typography>
                    <Iconify icon="material-symbols:poker-chip" />
                    <Typography>=</Typography>
                    <Typography>10k VND</Typography>
                  </Stack>
                </FormHelperText>
              </FormControl>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <ConfirmationDialog btnText="Đặt cược" onConfirm={onBet} />
        </DialogActions>
      </Dialog>
    </>
  );
}

BetDialog.propTypes = {
  match: PropTypes.object,
};
