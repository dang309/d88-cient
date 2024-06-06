import _ from 'lodash';
import * as React from 'react';
import { useSWRConfig } from 'swr';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Typography, IconButton } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import { PredictionResultAPI } from 'src/api';

import Label from '../label';
import Iconify from '../iconify';
import { MatchVersus } from '../match-versus';

export default function CongratulationDialog() {
  const { $on } = useEventBus();
  const { mutate } = useSWRConfig();

  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    if (result.id) {
      PredictionResultAPI.update(result.id, { isRead: true })
        .then(() => {
          mutate((key) => typeof key === 'string' && key.startsWith('/prediction-results'));
        })
        .finally(() => {
          setOpen(false);
        });
    }
  };

  React.useEffect(() => {
    $on('@dialog.congratulation.action.open', (data) => {
      setResult(_.get(data, 'result'));
      onOpen();
    });
  }, [$on]);

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
          <MatchVersus
            match={result?.match}
            showResult
            sx={{
              spacing: 4,
            }}
          />
        </Stack>

        <Stack alignItems="center">
          <Label color="warning" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
            + {result?.prize || 0}
          </Label>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
