import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Stack, IconButton, Typography } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import Label from '../label';
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Nạp chip</Typography>
          <Label color="error" sx={{ textTransform: 'none' }}>
            Nạp lần đầu x2 chip
          </Label>
        </Stack>

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
          <Stack alignItems="start" spacing={1}>
            <Label>1 chip = 10k</Label>
            <Typography variant="subtitle2">Quét mã bên dưới và nhập số tiền muốn nạp. </Typography>
            <Typography variant="subtitle2">Chip sẽ được cập nhật chậm nhất là 15 phút</Typography>
          </Stack>
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
