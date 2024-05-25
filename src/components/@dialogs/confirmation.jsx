import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function ConfirmationDialog(props) {
  const { btnText, onConfirm } = props;
  const radioGroupRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onConfirm(false);
    setOpen(false)
  };

  const handleOk = () => {
    onConfirm(true);
    setOpen(false)
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Button onClick={handleClickListItem} fullWidth variant="contained" color="info">
        {btnText}
      </Button>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        keepMounted
        TransitionProps={{ onEntering: handleEntering }}
        open={open}
      >
        <DialogContent>Suy nghĩ kỹ chưa, bro ?</DialogContent>
        <DialogActions>
          <Button variant="outlined" autoFocus onClick={handleCancel}>
            Suy nghĩ lại
          </Button>
          <Button variant="contained" onClick={handleOk}>
            Chơi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

ConfirmationDialog.propTypes = {
  btnText: PropTypes.string,
  onConfirm: PropTypes.func,
};
