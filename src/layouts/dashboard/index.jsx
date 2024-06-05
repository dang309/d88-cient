import qs from 'qs';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';

import BetDialog from 'src/components/@dialogs/bet';
import RechargeDialog from 'src/components/@dialogs/recharge';
import PredictionDialog from 'src/components/@dialogs/prediction';
import AuthenticationDialog from 'src/components/@dialogs/authentication';
import CongratulationDialog from 'src/components/@dialogs/congratulation';
import PredictionRuleDialog from 'src/components/@dialogs/prediction-rule';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const { $emit } = useEventBus();
  const { items: predictionResult } = useData(
    user &&
      `/prediction-results?${qs.stringify({
        fields: ['prize', 'isRead'],
        populate: {
          winner: {
            fields: ['id'],
            filters: {
              id: user.id,
            },
          },
          match: {
            fields: ['id', 'firstTeamName', 'firstTeamFlag', 'secondTeamName', 'secondTeamFlag'],
            populate: {
              result: true,
            },
          },
        },
      })}`
  );

  const [openNav, setOpenNav] = useState(false);

  const onCheckPredictionWinner = useCallback(() => {
    if (user && predictionResult) {
      if (predictionResult[0] && predictionResult[0].isRead) return;
      const idx = predictionResult.findIndex((item) => user && item.winner?.id === user.id);
      if (idx > -1)
        return $emit('@dialog.congratulation.action.open', { result: predictionResult[idx] });
    }
  }, [predictionResult, user, $emit]);

  useEffect(() => {
    onCheckPredictionWinner();
  }, [onCheckPredictionWinner]);

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
        <PredictionRuleDialog />
        <CongratulationDialog />
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
