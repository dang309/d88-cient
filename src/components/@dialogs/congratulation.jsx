import _ from 'lodash';
import * as React from 'react';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Backdrop, Typography, IconButton } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import { PredictionResultAPI } from 'src/api';

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

  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    if (result.id) {
      PredictionResultAPI.update(result.id, { isRead: true });
    }
    setOpen(false);
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

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Typography variant="subtitle2">Số chip nhận được: </Typography>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography variant="h5" sx={{}}>
              {result?.prize || 0}
            </Typography>

            <Iconify icon="material-symbols:poker-chip" sx={{ width: 24, height: 24 }} />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
