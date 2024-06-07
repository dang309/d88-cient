import qs from 'qs';
import { useMeasure } from 'react-use';
import { Fragment, useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import {
  Box,
  Card,
  Grid,
  List,
  Stack,
  Button,
  Divider,
  Skeleton,
  CardHeader,
  CardContent,
  CardActions,
  ListItemText,
  ListSubheader,
  ListItemButton,
} from '@mui/material';

import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { MatchAPI } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { Empty, Loader } from 'src/components/common';
import { MatchVersus } from 'src/components/match-versus';

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

  const [comingMatch, setComingMatch] = useState();

  const loadComingMatch = () => {
    MatchAPI.getComingMatch().then((res) => {
      console.log(res?.data?.data);
      setComingMatch(res?.data?.data);
    });
  };

  const onOpenBetDialog = (match) => $emit('@dialog.bet.action.open', { match });

  useEffect(() => {
    loadComingMatch();
  }, []);

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
          {comingMatch && (
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
                <MatchVersus match={comingMatch} showType showDatetime isComingMatch />
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" onClick={onOpenBetDialog}>
                  Xem
                </Button>
              </CardActions>
            </Card>
          )}
          {!comingMatch && (
            <Skeleton variant="rectangular" sx={{ width: '100%', height: height / 2 }} />
          )}
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
                <List
                  disablePadding
                  sx={{
                    '& ul': { padding: 0 },
                  }}
                >
                  {matches &&
                    Object.keys(matches).map((date) => (
                      <li key={`section-${date}`}>
                        <ul>
                          <ListSubheader>{date}</ListSubheader>
                          {matches[date] &&
                            matches[date].map((match) => (
                              <Fragment key={`match-${match.id}`}>
                                <ListItemButton onClick={() => onOpenBetDialog(match)}>
                                  <ListItemText
                                    primary={
                                      <MatchVersus match={match} showTime justifyContent="start" />
                                    }
                                  />
                                </ListItemButton>
                                <Divider />
                              </Fragment>
                            ))}
                        </ul>
                      </li>
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
