import PropTypes from 'prop-types';

import { Box, Card, Stack, Button, CardHeader, CardContent, CardActions } from '@mui/material';

import useEventBus from 'src/hooks/event-bus';

import { MatchVersus } from 'src/components/match-versus';

const MatchBox = ({ match, isComingMatch }) => {
  const { $emit } = useEventBus();

  const onOpenBetDialog = () => $emit('@dialog.bet.action.open', { match });

  return (
    <Card
      elevation={8}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 64 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/UEFA_Euro_2024_logo.svg/2560px-UEFA_Euro_2024_logo.svg.png"
                alt=""
              />
            </Box>
          </Stack>
        }
      />
      <CardContent>
        <MatchVersus match={match} showResult showType showDatetime isComingMatch={isComingMatch} />
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" onClick={onOpenBetDialog}>
          Xem
        </Button>
      </CardActions>
    </Card>
  );
};

MatchBox.propTypes = {
  match: PropTypes.object,
  isComingMatch: PropTypes.bool,
};

export default MatchBox;
