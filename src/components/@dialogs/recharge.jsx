import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Stack, Divider, IconButton, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Nạp chip</Typography>
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
            <Typography variant="subtitle2">Quét mã bên dưới</Typography>
          </Stack>
        </DialogContentText>
        <Stack sx={{ p: 2 }} divider={<Divider>Hoặc dùng link</Divider>} spacing={2}>
          <Box
            component="img"
            src="/assets/qr-momo.jpg"
            alt="qr-momo"
            sx={{
              width: 300,
              alignSelf: 'center',
            }}
          />

          <Typography
            component={RouterLink}
            href="https://me.momo.vn/74IAT4t3UbsOf5IWfDtJU3"
            variant="subtitle2"
            textAlign="center"
          >
            https://bit.ly/momo-recharge
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
