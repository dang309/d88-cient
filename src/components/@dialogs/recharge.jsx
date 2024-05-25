import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Stack, IconButton, Typography } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import Iconify from '../iconify';

export default function RechargeDialog() {
  const { $on } = useEventBus();

  const [open, setOpen] = React.useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    $on('@dialog.recharge.action.open', () => {
      onOpen();
    });
  }, [$on]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h6">Nạp chip</Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Quét mã bên dưới để chuyển tiền. Chip sẽ được cập nhật chậm nhất là 1 tiếng
        </DialogContentText>
        <Stack alignItems="center" sx={{ p: 2 }}>
          <Box
            component="img"
            src="/assets/qr-momo.jpg"
            alt="qr-momo"
            sx={{
              width: 300,
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
