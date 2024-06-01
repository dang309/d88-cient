import PropTypes from 'prop-types';

import { Card, Button, CardContent, CardActions } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { MatchVersus } from 'src/components/match-versus';

const MatchBox = ({ match }) => {
  const { $emit } = useEventBus();
  const downSm = useResponsive('down', 'sm');

  const onOpenBetDialog = () => $emit('@dialog.bet.action.open', { match });

  return (
    <Card>
      <CardContent>
        <MatchVersus match={match} showResult showType showDatetime />
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" onClick={onOpenBetDialog}>
          Xem kèo
        </Button>
      </CardActions>
    </Card>
  );
};

MatchBox.propTypes = {
  match: PropTypes.object,
};

export default MatchBox;
