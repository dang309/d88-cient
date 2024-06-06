import _ from 'lodash';
import * as React from 'react';
import { useSWRConfig } from 'swr';
import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Typography, IconButton } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { PredictionAPI } from 'src/api';

import Iconify from '../iconify';

export default function PredictionDialog() {
  const { $on, $emit } = useEventBus();
  const { user, initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = useSWRConfig();
  const downSm = useResponsive('down', 'sm');

  const [match, setMatch] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [firstTeamScorePrediction, setFirstTeamScorePrediction] = React.useState(0);
  const [secondTeamScorePrediction, setSecondTeamScorePrediction] = React.useState(0);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setFirstTeamScorePrediction(0);
    setSecondTeamScorePrediction(0);
  };

  const onChangeFirstTeamScorePrediction = (action) => {
    if (action === 'plus') setFirstTeamScorePrediction((prev) => prev + 1);
    else if (action === 'minus')
      setFirstTeamScorePrediction((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
  };

  const onChangeSecondTeamScorePrediction = (action) => {
    if (action === 'plus') setSecondTeamScorePrediction((prev) => prev + 1);
    else if (action === 'minus')
      setSecondTeamScorePrediction((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
  };

  const explodeConfetti = async () => {
    if (_.isNil(window.confetti)) return;
    const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

    function fire(particleRatio, opts) {
      window.confetti(
        { ...defaults, ...opts, particleCount: Math.floor(count * particleRatio),}
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const onPredict = async () => {
    if (_.isNil(user)) {
      return $emit('@dialog.auth.action.open');
    }
    if (match && user) {
      const dataToSend = {
        match: match.id,
        user: user.id,
        firstTeamScore: firstTeamScorePrediction,
        secondTeamScore: secondTeamScorePrediction,
      };
      return PredictionAPI.create(dataToSend).then(() => {
        explodeConfetti();
        enqueueSnackbar('Dự đoán thành công!', {
          variant: 'success',
        });
        onClose();
        initialize();
        mutate((key) => typeof key === 'string' && key.startsWith('/predictions'), undefined, {
          revalidate: true,
        });
      });
    }
  };

  React.useEffect(() => {
    $on('@dialog.prediction.action.open', (data) => {
      setMatch(_.get(data, 'match'));
      onOpen();
    });
  }, [$on, mutate]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        Dự đoán tỉ số
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
        <DialogContentText id="alert-dialog-description">
          Lệ phí tham gia là 1 chip
        </DialogContentText>

        {match && (
          <Grid2
            container
            justifyContent={{
              lg: 'center',
              xs: 'center',
            }}
            alignItems="center"
            spacing={2}
            sx={{ py: 2 }}
          >
            <Grid2 item lg={4} xs sx={{ p: 0 }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Stack alignItems="center" justifyContent="center">
                  <Iconify icon={`circle-flags:${match.firstTeamFlag}`} height={32} width={32} />
                  <Typography
                    variant={downSm ? 'caption' : 'subtitle2'}
                    sx={{ textAlign: 'center' }}
                  >
                    {match?.topTeamName === match?.firstTeamName ? (
                      <mark>
                        <strong>{match?.firstTeamName}</strong>
                      </mark>
                    ) : (
                      match?.firstTeamName
                    )}
                  </Typography>
                </Stack>
                <Stack>
                  <Stack alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => onChangeFirstTeamScorePrediction('plus')}
                    >
                      <Iconify icon="line-md:arrow-small-up" sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </Stack>
                  <Button variant="outlined" size="small" disabled>
                    {firstTeamScorePrediction}
                  </Button>
                  <Stack alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => onChangeFirstTeamScorePrediction('minus')}
                    >
                      <Iconify icon="line-md:arrow-small-down" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </Grid2>

            <Grid2 item lg={1} xs={1} sx={{ p: 0 }}>
              <Stack alignItems="center">
                <Typography>:</Typography>
              </Stack>
            </Grid2>

            <Grid2 item lg={4} xs sx={{ p: 0 }}>
              <Stack direction="row" justifyContent="flex-start" spacing={1}>
                <Stack>
                  <Stack
                    alignItems="center"
                    onClick={() => onChangeSecondTeamScorePrediction('plus')}
                  >
                    <IconButton size="small">
                      <Iconify icon="line-md:arrow-small-up" sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </Stack>
                  <Button variant="outlined" size="small" disabled>
                    {secondTeamScorePrediction}
                  </Button>
                  <Stack alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => onChangeSecondTeamScorePrediction('minus')}
                    >
                      <Iconify icon="line-md:arrow-small-down" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack alignItems="center" justifyContent="center">
                  <Iconify icon={`circle-flags:${match.secondTeamFlag}`} height={32} width={32} />
                  <Typography
                    variant={downSm ? 'caption' : 'subtitle2'}
                    sx={{ textAlign: 'center' }}
                  >
                    {match?.topTeamName === match?.secondTeamName ? (
                      <mark>
                        <strong>{match?.secondTeamName}</strong>
                      </mark>
                    ) : (
                      match?.secondTeamName
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onPredict} fullWidth variant="contained">
          Dự đoán (1
          <Iconify icon="material-symbols:poker-chip" />)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
