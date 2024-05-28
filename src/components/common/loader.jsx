import * as React from 'react';

import { Stack, CircularProgress } from '@mui/material';

export default function Loader() {
  return (
    <Stack alignItems='center' justifyContent='center' sx={{ width: '100%', height: '100%' }}>
      <CircularProgress />
    </Stack>
  );
}
