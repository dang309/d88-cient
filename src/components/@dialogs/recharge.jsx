import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Stack } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function RechargeDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="warning" onClick={handleClickOpen}>
        Nạp chip
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Nạp chip</DialogTitle>
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
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
