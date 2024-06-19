import _ from 'lodash';
import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Divider, Typography, IconButton } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import Label from '../label';
import Iconify from '../iconify';
import { MatchVersus } from '../match-versus';

export default function CongratulationDialog() {
  const { $emit, $on } = useEventBus();

  const [open, setOpen] = React.useState(false);
  const [predictions, setPredictions] = React.useState();
  const [bets, setBets] = React.useState();

  const totalPrize = React.useMemo(() => {
    if (_.isNil(predictions) || _.isEmpty(predictions)) return 0;

    return predictions.reduce((sum, prediction) => sum + prediction.prize, 0);
  }, [predictions]);

  const totalProfit = React.useMemo(() => {
    if (_.isNil(bets) || _.isEmpty(bets)) return 0;

    return bets.reduce((sum, prediction) => sum + prediction.profit, 0);
  }, [bets]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = async () => {
    setOpen(false);
    return $emit('@dialog.congratulation.action.close');
  };

  React.useEffect(() => {
    $on('@dialog.congratulation.action.open', (data) => {
      if (_.isNil(data)) return;
      if (!_.isNil(data.predictions)) setPredictions(data.predictions);
      if (!_.isNil(data.bets)) setBets(data.bets);
      onOpen();
    });
  }, [$on, predictions, bets]);

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
        <Stack spacing={1} divider={<Divider />}>
          {!_.isNil(bets) && !_.isEmpty(bets) && (
            <Stack alignItems="center" spacing={1}>
              <Typography variant="subtitle1">Bạn đã dành chiến thắng trận đấu</Typography>
              {bets.map((item) => (
                <MatchVersus
                  match={item?.match}
                  showResult
                  sx={{
                    spacing: 4,
                  }}
                />
              ))}
              <Label color="warning" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
                + {totalProfit}
              </Label>
            </Stack>
          )}

          {!_.isNil(predictions) && !_.isEmpty(predictions) && (
            <Stack alignItems="center" spacing={1}>
              <Typography variant="subtitle1">Bạn đã dự đoán đúng tỉ số trận đấu</Typography>
              {predictions.map((item) => (
                <MatchVersus
                  match={item?.match}
                  showResult
                  sx={{
                    spacing: 4,
                  }}
                />
              ))}
              <Label color="warning" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
                + {totalPrize}
              </Label>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
