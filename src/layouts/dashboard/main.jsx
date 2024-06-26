import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from './config-layout';

// ----------------------------------------------------------------------

const SPACING = 24;

export default function Main({ children, sx, ...other }) {
  const downLg = useResponsive('down', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(!downLg && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
