import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import BetDialog from 'src/components/@dialogs/bet';
import RechargeDialog from 'src/components/@dialogs/recharge';
import PredictionDialog from 'src/components/@dialogs/prediction';
import AuthenticationDialog from 'src/components/@dialogs/authentication';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>

        <RechargeDialog />
        <AuthenticationDialog />
        <BetDialog />
        <PredictionDialog />
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
