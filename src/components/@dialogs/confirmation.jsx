import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import useEventBus from 'src/hooks/event-bus';

export default function ConfirmationDialog(props) {
  const { $on } = useEventBus();

  const callbackRef = React.useRef(null)
  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onConfirm = () => {
    if(callbackRef.current) {
      callbackRef.current()
      onClose()
    }
  }

  React.useEffect(() => {
    $on('dialog.confirmation.action.open', (data) => {
      if(data.callback) callbackRef.current = data.callback
      onOpen();
    });
  }, [$on]);

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
    >
      <DialogContent>Suy nghĩ kỹ chưa, my friend ?</DialogContent>
      <DialogActions>
        <Button variant="outlined" autoFocus onClick={onClose}>
          Suy nghĩ lại
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Rồi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {};
