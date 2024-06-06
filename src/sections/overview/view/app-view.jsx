import qs from 'qs';

import Container from '@mui/material/Container';
import { Card, Grid, List, Divider, CardHeader, CardContent, ListItemButton } from '@mui/material';

import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';

import Label from 'src/components/label';
import { Empty, Loader } from 'src/components/common';
import { MatchVersus } from 'src/components/match-versus';

import MatchBox from '../components/match-box';

// ----------------------------------------------------------------------

export default function AppView() {
  const { items: matches, isLoading } = useData(
    `/matches?${qs.stringify({
      populate: ['result', 'handicap', 'overUnder'],
    })}`
  );
  const { $emit } = useEventBus();

  const onOpenBetDialog = (match) => $emit('@dialog.bet.action.open', { match });

  const comingMatch = matches && matches[0];

  return (
    <Container>
      <Grid
        container
        justifyContent={{
          lg: 'start',
          md: 'start',
          sm: 'center',
          xs: 'center',
        }}
        alignItems="start"
        spacing={1}
      >
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <MatchBox match={comingMatch} isComingMatch />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card>
            <CardHeader title={<Label color="info">Vòng bảng</Label>} />
            <CardContent>
              <List disablePadding>
                {matches &&
                  matches.slice(1, matches.length).map((match, index) => (
                    <>
                      <ListItemButton key={match.id} onClick={() => onOpenBetDialog(match)}>
                        <MatchVersus
                          match={match}
                          showVersus
                          justifyContent="space-evenly"
                          sx={{
                            width: '100%',
                          }}
                        />
                      </ListItemButton>
                      {index !== matches.length - 1 && <Divider component="li" />}
                    </>
                  ))}
                {isLoading && <Loader />}
                {!isLoading && matches && matches.length === 0 && <Empty />}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
