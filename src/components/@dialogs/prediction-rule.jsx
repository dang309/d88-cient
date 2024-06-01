import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Alert, Stack } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import useEventBus from 'src/hooks/event-bus';


export default function PredictionRuleDialog() {
  const { $on } = useEventBus();

  const [open, setOpen] = React.useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    $on('@dialog.prediction-rules.action.open', () => {
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
      <DialogTitle id="alert-dialog-title">Luật chơi</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Alert severity="info">
            Người chơi đoán đúng tỉ số sẽ nhận được toàn bộ số chip trong <strong>Jackpot</strong>.
          </Alert>

          <Alert severity="info">
            Nếu không có ai đoán đúng thì toàn bộ số chip trong <strong>Jackpot</strong> sẽ
            được tích lũy cho trận đấu kế tiếp.
          </Alert>

          <Alert severity="warning">
            Người chơi có thể dự đoán nhiều tỉ số trong 1 trận đấu.
          </Alert>

          <Alert severity='error'>
            Nếu dự đoán sai thì người chơi sẽ mất phí tham gia là 1 chip.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus fullWidth variant='contained'>
          Tôi đã hiểu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
