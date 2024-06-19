import qs from 'qs';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import useAuth from 'src/hooks/auth';
import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';

import { BetAPI, PredictionAPI } from 'src/api';

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
  const { $emit, $on } = useEventBus();

  const { items: predictions, mutate: mutatePredictions } = useData(
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
            {
              user: user.id,
            },
          ],
        },
        populate: {
          user: {
            fields: ['id'],
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

  const { items: bets, mutate: mutateBets } = useData(
    user &&
      `/bets?${qs.stringify({
        fields: ['id', 'isCelebrated', 'profit'],
        filters: {
          $and: [
            {
              profit: {
                $gt: 0,
              },
            },
            {
              isCelebrated: false,
            },
            {
              user: user.id,
            },
          ],
        },
        populate: {
          user: {
            fields: ['id'],
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
  const [forceCloseCelebration, setForceCloseCelebration] = useState(false);

  const onTurnOffCelebration = useCallback(async () => {
    setForceCloseCelebration(true);
    if (!_.isNil(predictions) && !_.isEmpty(predictions)) {
      const promises = [];
      predictions.forEach((prediction) => {
        promises.push(
          PredictionAPI.update(prediction.id, {
            isCelebrated: true,
          })
        );
      });
      await Promise.all(promises);
      mutatePredictions();
    }
    if (!_.isNil(bets) && !_.isEmpty(bets)) {
      const promises = [];
      bets.forEach((bet) => {
        promises.push(
          BetAPI.update(bet.id, {
            isCelebrated: true,
          })
        );
      });
      await Promise.all(promises);
      mutateBets();
    }
  }, [predictions, bets, mutateBets, mutatePredictions]);

  const onCheckPredictionWinner = useCallback(() => {
    if (_.isNil(predictions) && _.isNil(bets)) return;
    if (_.isEmpty(predictions) && _.isEmpty(bets)) return;
    if (forceCloseCelebration) return;
    return $emit('@dialog.congratulation.action.open', { predictions, bets, callback: onTurnOffCelebration });
  }, [predictions, bets, onTurnOffCelebration, $emit, forceCloseCelebration]);

  useEffect(() => {
    onCheckPredictionWinner();
  }, [onCheckPredictionWinner]);

  useEffect(() => {
    $on('@dialog.congratulation.action.close', onTurnOffCelebration);
  }, [$on, onTurnOffCelebration]);

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
