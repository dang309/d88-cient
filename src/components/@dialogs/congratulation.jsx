import _ from 'lodash';
import * as React from 'react';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Backdrop, Typography } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

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
  const [match, setMatch] = React.useState();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    $on('@dialog.congratulation.action.open', (data) => {
      setMatch(_.get(data, 'match'));
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
      <DialogTitle id="alert-dialog-title">Xin chúc mừng!</DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center">
          <Typography>Bạn đã dự đoán đúng tỉ số trận đấu</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
