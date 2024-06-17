import qs from 'qs';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import useAuth from 'src/hooks/auth';
import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';

import BetDialog from 'src/components/@dialogs/bet';
import RechargeDialog from 'src/components/@dialogs/recharge';
import BetDetailDialog from 'src/components/@dialogs/bet-detail';
import PredictionDialog from 'src/components/@dialogs/prediction';
import ConfirmationDialog from 'src/components/@dialogs/confirmation';
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

  const { items: predictions, mutate } = useData(
    user &&
      `/predictions?${qs.stringify({
        fields: ['prize', 'isCorrect'],
        filters: {
          $and: [
            {
              isCorrect: true,
            },
            {
              isCelebrated: false,
            },
          ],
        },
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
    if (_.isNil(predictions) || _.isEmpty(predictions)) return;
    return $emit('@dialog.congratulation.action.open', { predictions, mutate });
  }, [predictions, mutate, $emit]);

  useEffect(() => {
    onCheckPredictionWinner();
  }, [onCheckPredictionWinner]);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          maxHeight: '100%',
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
        <ConfirmationDialog />
        <BetDetailDialog />
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
