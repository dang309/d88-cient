import _ from 'lodash';
import * as React from 'react';
import { useSWRConfig } from 'swr';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Backdrop, Typography, IconButton } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import { PredictionResultAPI } from 'src/api';

import Label from '../label';
import Iconify from '../iconify';
import { MatchVersus } from '../match-versus';

const CustomBackdrop = () => {
  const { width, height } = useWindowSize();
  return (
    <Backdrop open>
      <ReactConfetti width={width} height={height} />
    </Backdrop>
  );
};

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
      PredictionResultAPI.update(result.id, { isRead: true }).then(() => {
        mutate((key) => typeof key === 'string' && key.startsWith('/prediction-results'));
      }).finally(() => {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slots={{
        backdrop: CustomBackdrop,
      }}
    >
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
