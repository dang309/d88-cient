import qs from 'qs';
import { useMeasure } from 'react-use';

import Container from '@mui/material/Container';
import { Card, Grid, List, Divider, CardHeader, CardContent, ListItemButton } from '@mui/material';

import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
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
  const downSm = useResponsive('down', 'sm');

  const [ref, { height }] = useMeasure();

  console.log({ height });

  const onOpenBetDialog = (match) => $emit('@dialog.bet.action.open', { match });

  const comingMatch = matches && matches[0];

  return (
    <Container ref={ref} sx={{ maxHeight: '100%', pb: 2 }}>
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
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <MatchBox match={comingMatch} isComingMatch />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card>
            <CardHeader title={<Label color="info">Vòng bảng</Label>} />
            <CardContent>
              <Scrollbar
                sx={{
                  maxHeight: downSm ? 'auto' : height || 'auto',
                  overflow: downSm ? 'hidden' : 'auto',
                }}
              >
                <List disablePadding>
                  {matches &&
                    matches.map((match, index) => (
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
                        <Divider component="li" />
                      </>
                    ))}
                  {isLoading && <Loader />}
                  {!isLoading && matches && matches.length === 0 && <Empty />}
                </List>
              </Scrollbar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
