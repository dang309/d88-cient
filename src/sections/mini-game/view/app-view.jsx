import { useState, Fragment, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  List,
  Card,
  Stack,
  Paper,
  Button,
  Avatar,
  Divider,
  ListItem,
  Typography,
  CardHeader,
  IconButton,
  CardContent,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import useData from 'src/hooks/data';
import useEventBus from 'src/hooks/event-bus';

import { MatchAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Empty, Loader } from 'src/components/common';

// ----------------------------------------------------------------------

export default function AppView() {
  const { $emit } = useEventBus();

  const [match, setMatch] = useState();

  const {
    items: predictions,
    pagination,
    isLoading,
  } = useData(match ? `/predictions?populate=*&filters[match][id][$eq]=${match.id}` : null);

  const onOpenPredictionDialog = () => {
    $emit('@dialog.prediction.action.open', { match });
  };

  const onOpenMiniGameRuleDialog = () => {
    $emit('@dialog.prediction-rules.action.open');
  }

  useEffect(() => {
    const loadComingMatch = () => {
      MatchAPI.getComingMatch().then((res) => {
        setMatch(res?.data?.data);
      });
    };

    loadComingMatch();
  }, []);

  return (
    <Container>
      <Stack alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Chakra Petch',
            }}
          >
            Dự đoán tỉ số
          </Typography>

          <IconButton onClick={onOpenMiniGameRuleDialog}>
            <Iconify icon="line-md:question-circle" />
          </IconButton>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 2,

            width: '100%',
            maxWidth: {
              lg: 512,
              md: 512,
              sm: 360,
              xs: '100%',
            },

            textAlign: 'center',
            borderStyle: 'dashed',
          }}
        >
          <Typography
            variant="h2"
            color="error"
            sx={{
              fontFamily: 'Ruslan Display',
            }}
          >
            Jackpot
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'Jaro',
              }}
            >
              {pagination?.total || 0}
            </Typography>

            <Iconify icon="material-symbols:poker-chip" sx={{ width: 32, height: 32 }} />
          </Stack>
        </Paper>

        {match && (
          <Grid2
            container
            alignItems="center"
            spacing={2}
            sx={{
              width: '100%',
              maxWidth: {
                lg: 512,
                md: 512,
                sm: 360,
                xs: '100%',
              },
            }}
          >
            <Grid2 item lg={4} md={4} sm={4} xs={3.5}>
              <Stack alignItems="center" justifyContent="center">
                <Iconify icon={`flag:${match.firstTeamFlag}`} sx={{ height: 32, width: 32 }} />
                {match?.topTeamName === match?.firstTeamName ? (
                  <Label
                    color="error"
                    startIcon={<Iconify icon="fluent-emoji-high-contrast:top-arrow" />}
                  >
                    {match?.firstTeamName}
                  </Label>
                ) : (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {match?.firstTeamName}
                  </Typography>
                )}
              </Stack>
            </Grid2>

            <Grid2 item lg={4} md={4} sm={4} xs={5}>
              <Button variant="outlined" size="small" fullWidth onClick={onOpenPredictionDialog}>
              Dự đoán (1 <Iconify icon="material-symbols:poker-chip" />)
              </Button>
            </Grid2>

            <Grid2 item lg={4} md={4} sm={4} xs={3.5}>
              <Stack alignItems="center" justifyContent="center" gap={0.5}>
                <Iconify icon={`flag:${match.secondTeamFlag}`} sx={{ height: 32, width: 32 }} />
                {match?.topTeamName === match?.secondTeamName ? (
                  <Label
                    color="error"
                    startIcon={<Iconify icon="fluent-emoji-high-contrast:top-arrow" />}
                  >
                    {match?.secondTeamName}
                  </Label>
                ) : (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                    {match?.secondTeamName}
                  </Typography>
                )}
              </Stack>
            </Grid2>
          </Grid2>
        )}

        <Card
          sx={{
            width: '100%',
            maxWidth: {
              lg: 512,
              md: 512,
              sm: 360,
              xs: '100%',
            },
          }}
        >
          <CardHeader title="Danh sách dự đoán" />
          <CardContent>
            <List disablePadding>
              {predictions &&
                predictions.map((prediction, index) => (
                  <Fragment key={prediction.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt={prediction?.user?.username}
                          src={prediction?.user?.avatarUrl}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={0.7}>
                            <Typography variant="subtitle2">
                              {prediction?.user?.username}
                            </Typography>
                            <Typography variant="caption">đã dự đoán</Typography>
                          </Stack>
                        }
                        secondary={
                          <Grid2
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid2 item lg="auto" md="auto" sm="auto" xs="auto">
                              <Stack alignItems="center">
                                <Iconify
                                  icon={`flag:${prediction?.match?.firstTeamFlag}`}
                                  sx={{ height: 24, width: 24 }}
                                />
                              </Stack>
                            </Grid2>

                            <Grid2 item lg="auto" md="auto" sm="auto" xs="auto">
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Label>{prediction?.firstTeamScore || 0}</Label>
                                <Typography>:</Typography>
                                <Label>{prediction?.secondTeamScore || 0}</Label>
                              </Stack>
                            </Grid2>

                            <Grid2 item lg="auto" md="auto" sm="auto" xs="auto">
                              <Stack alignItems="center">
                                <Iconify
                                  icon={`flag:${prediction?.match?.secondTeamFlag}`}
                                  sx={{ height: 24, width: 24 }}
                                />
                              </Stack>
                            </Grid2>
                          </Grid2>
                        }
                      />
                    </ListItem>
                    {index !== predictions.length - 1 && <Divider variant="inset" />}
                  </Fragment>
                ))}

              {isLoading && <Loader />}

              {!isLoading && !predictions?.length && <Empty text="Chưa có dự đoán" />}
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
