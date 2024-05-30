import * as React from 'react';

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Link, Stack, Typography, IconButton } from '@mui/material';

import Iconify from '../iconify';

export default function HotNew() {
  const [open, setOpen] = React.useState(true);

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Collapse in={open} sx={{width: '100%'}}>
        <Alert
          severity="info"
          variant="outlined"
          action={
            <IconButton onClick={onClose}>
              <Iconify icon="line-md:close" />
            </IconButton>
          }
        >
          <Stack direction='row' alignItems="center" spacing={1}>
            <Typography variant="caption">Tham gia mini game ngay để tăng thu nhập thôi nào!</Typography>
            <Link variant='caption'>Tham gia</Link>
          </Stack>
        </Alert>
      </Collapse>
  );
}
