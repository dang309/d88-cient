import _ from 'lodash';
import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Typography, IconButton } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import { PredictionAPI } from 'src/api';

import Label from '../label';
import Iconify from '../iconify';
import { MatchVersus } from '../match-versus';

export default function CongratulationDialog() {
  const { $on } = useEventBus();

  const [open, setOpen] = React.useState(false);
  const [predictions, setPredictions] = React.useState();

  const totalPrize = React.useMemo(() => {
    if (_.isNil(predictions) || _.isEmpty(predictions)) return 0;

    return predictions.reduce((sum, prediction) => sum + prediction.prize, 0);
  }, [predictions]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = async () => {
    if (_.isNil(predictions)) return;

    const promises = [];

    predictions.forEach((prediction) => {
      promises.push(
        PredictionAPI.update(prediction.id, {
          isCelebrated: true,
        })
      );
    });

    return Promise.all(promises).then(() => {
      setOpen(false);
    });
  };

  React.useEffect(() => {
    $on('@dialog.congratulation.action.open', (data) => {
      if (_.isNil(data) || _.isNil(data.predictions)) return;
      setPredictions(data.predictions);
      onOpen();
    });
  }, [$on, predictions]);

  React.useEffect(() => {
    if (!window.confetti || !open) return;
    const duration = 5 * 60 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const count = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      window.confetti('tsparticles', {
        ...defaults,
        count,
        position: { x: randomInRange(10, 30), y: randomInRange(0, 100) - 20 },
      });
      window.confetti('tsparticles', {
        ...defaults,
        count,
        position: { x: randomInRange(70, 90), y: randomInRange(0, 100) - 20 },
      });
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        Xin chúc mừng!
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
        <Stack alignItems="center" spacing={1}>
          <Typography variant="subtitle1">Bạn đã dự đoán đúng tỉ số trận đấu</Typography>
          {predictions &&
            predictions.map((prediction) => (
              <MatchVersus
                match={prediction?.match}
                showResult
                sx={{
                  spacing: 4,
                }}
              />
            ))}
        </Stack>

        <Stack alignItems="center">
          <Label color="warning" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
            + {totalPrize}
          </Label>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
