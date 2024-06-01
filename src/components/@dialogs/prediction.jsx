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
import DialogContentText from '@mui/material/DialogContentText';
import { Stack, Typography, IconButton, ButtonGroup } from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';

import { PredictionAPI } from 'src/api';

import Label from '../label';
import Iconify from '../iconify';

export default function PredictionDialog() {
  const { $on } = useEventBus();
  const { user, initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = useSWRConfig();

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

  const onPredict = async () => {
    if (match && user) {
      const dataToSend = {
        match: match.id,
        user: user.id,
        firstTeamScore: firstTeamScorePrediction,
        secondTeamScore: secondTeamScorePrediction,
      };
      return PredictionAPI.create(dataToSend).then(() => {
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
              xs: 8
            },
            top: {
              lg: 16,
              xs: 8
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
          >
            <Grid2 item lg={4} xs>
              <Stack direction="row" spacing={2}>
                <Stack alignItems="center" justifyContent="center">
                  <Iconify icon={`flag:${match.firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
                  {match?.topTeamName === match?.firstTeamName ? (
                    <Label
                      color="error"
                      startIcon={<Iconify icon="fluent-emoji-high-contrast:top-arrow" />}
                    >
                      {match?.firstTeamName}
                    </Label>
                  ) : (
                    <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                      {match?.firstTeamName}
                    </Typography>
                  )}
                </Stack>
                <ButtonGroup orientation="vertical" fullWidth>
                  <Stack alignItems="center">
                    <IconButton key="one" onClick={() => onChangeFirstTeamScorePrediction('plus')}>
                      <Iconify icon="line-md:arrow-small-up" />
                    </IconButton>
                  </Stack>
                  <Button key="two" disabled>
                    {firstTeamScorePrediction}
                  </Button>
                  <Stack alignItems="center">
                    <IconButton key="one" onClick={() => onChangeFirstTeamScorePrediction('minus')}>
                      <Iconify icon="line-md:arrow-small-down" />
                    </IconButton>
                  </Stack>
                </ButtonGroup>
              </Stack>
            </Grid2>

            <Grid2 item lg={1} xs={1}>
              <Stack alignItems="center">
                <Typography>:</Typography>
              </Stack>
            </Grid2>

            <Grid2 item lg={4} xs>
              <Stack direction="row" spacing={2}>
                <ButtonGroup orientation="vertical" fullWidth>
                  <Stack
                    alignItems="center"
                    onClick={() => onChangeSecondTeamScorePrediction('plus')}
                  >
                    <IconButton key="one">
                      <Iconify icon="line-md:arrow-small-up" />
                    </IconButton>
                  </Stack>
                  <Button key="two" disabled>
                    {secondTeamScorePrediction}
                  </Button>
                  <Stack alignItems="center">
                    <IconButton
                      key="one"
                      onClick={() => onChangeSecondTeamScorePrediction('minus')}
                    >
                      <Iconify icon="line-md:arrow-small-down" />
                    </IconButton>
                  </Stack>
                </ButtonGroup>
                <Stack alignItems="center" justifyContent="center" gap={0.5}>
                  <Iconify icon={`flag:${match.secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
                  {match?.topTeamName === match?.secondTeamName ? (
                    <Label
                      color="error"
                      startIcon={<Iconify icon="fluent-emoji-high-contrast:top-arrow" />}
                    >
                      {match?.secondTeamName}
                    </Label>
                  ) : (
                    <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                      {match?.secondTeamName}
                    </Typography>
                  )}
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
