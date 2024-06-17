import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useState, Fragment, useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';

import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  List,
  Card,
  Stack,
  Paper,
  Avatar,
  Button,
  Divider,
  ListItem,
  Typography,
  CardHeader,
  IconButton,
  CardContent,
  CardActions,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import useData from 'src/hooks/data';
import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';

import request from 'src/utils/request';

import { MatchAPI, PredictionAPI } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Empty, Loader } from 'src/components/common';
import { MatchVersus } from 'src/components/match-versus';

// ----------------------------------------------------------------------

export default function AppView() {
  const { $emit } = useEventBus();
  const [scope, animate] = useAnimate();
  const { user, initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [match, setMatch] = useState();
  const [jackpot, setJackpot] = useState(0);

  const {
    items: predictions,
    isLoading: isLoadingPrediction,
    mutate,
  } = useData(match && user ? `/predictions?populate=*&filters[match][id][$eq]=${match.id}&sort=createdAt:desc` : null);

  const loadJackpot = () => {
    request.get('/jackpot').then((res) => {
      if (res.data) {
        setJackpot(res.data?.data?.amount);
      }
    });
  };

  const onOpenPredictionDialog = () => {
    if (_.isNil(user)) {
      return $emit('@dialog.auth.action.open');
    }
    $emit('@dialog.prediction.action.open', { match, callback: loadJackpot });
  };

  const onOpenMiniGameRuleDialog = () => {
    $emit('@dialog.prediction-rules.action.open');
  };

  const onDeletePrection = (predictionId) =>
    PredictionAPI.delete(predictionId)
      .then(() =>
        enqueueSnackbar('Hủy thành công!', {
          variant: 'success',
        })
      )
      .then(() => mutate())
      .then(() => {
        initialize();
      });

  const onOpenConfirmationDialog = (predictionId) =>
    $emit('dialog.confirmation.action.open', {
      callback: () => {
        onDeletePrection(predictionId);
      },
    });

  useEffect(() => {
    const loadComingMatch = () => {
      MatchAPI.getComingMatch().then((res) => {
        setMatch(res?.data?.data);
      });
    };

    loadComingMatch();
    loadJackpot();
  }, []);

  useEffect(() => {
    const onAnimate = async () => {
      await animate(
        'span',
        { y: -4 },
        {
          delay: stagger(0.1),
          repeat: Infinity,
          repeatType: 'reverse',
        }
      );
    };

    onAnimate();
  }, [animate]);

  return (
    <Container>
      <Grid2 container alignItems="start" spacing={2}>
        <Grid2 item lg={6} md={6} sm={12} xs={12}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
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
              elevation={6}
              variant="outlined"
              sx={{
                p: 2,

                textAlign: 'center',
                borderStyle: 'dashed',
              }}
            >
              <Stack direction="row" justifyContent="center" ref={scope} spacing={0.5}>
                {['J', 'a', 'c', 'k', 'p', 'o', 't'].map((char, index) => (
                  <Typography
                    key={index}
                    component={motion.span}
                    variant="h2"
                    color="error"
                    sx={{
                      fontFamily: 'Ruslan Display',
                    }}
                  >
                    {char}
                  </Typography>
                ))}
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Jaro',
                  }}
                >
                  {jackpot || 0}
                </Typography>

                <Iconify icon="material-symbols:poker-chip" sx={{ width: 32, height: 32 }} />
              </Stack>
            </Paper>

            <Card elevation={6}>
              <CardHeader
                title={
                  <Typography textAlign="center" variant="h6">
                    Trận đấu
                  </Typography>
                }
              />
              <CardContent>
                <MatchVersus match={match} showVersus />
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" onClick={onOpenPredictionDialog}>
                  Dự đoán (1 <Iconify icon="material-symbols:poker-chip" />)
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </Grid2>

        <Grid2 item lg={6} md={6} sm={12} xs={12}>
          <Card>
            <CardHeader title="Danh sách dự đoán" />
            <CardContent>
              <List disablePadding>
                {predictions &&
                  predictions.map((prediction, index) => (
                    <Fragment key={prediction.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={prediction?.user?.username} src={prediction?.user?.avatarUrl} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={0.7}>
                              <Typography variant="subtitle2">{prediction?.user?.username}</Typography>
                              <Typography variant="caption">đã dự đoán</Typography>
                            </Stack>
                          }
                          secondary={
                            <Grid2 container justifyContent="flex-start" alignItems="center" spacing={1}>
                              <Grid2 item lg="auto" md="auto" sm="auto" xs="auto">
                                <Stack alignItems="center">
                                  <Iconify icon={`circle-flags:${prediction?.match?.firstTeamFlag}`} height={20} width={20} />
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
                                  <Iconify icon={`circle-flags:${prediction?.match?.secondTeamFlag}`} height={20} width={20} />
                                </Stack>
                              </Grid2>
                            </Grid2>
                          }
                        />
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ alignSelf: 'center' }}
                          onClick={() => onOpenConfirmationDialog(prediction.id)}
                        >
                          Hủy
                        </Button>
                      </ListItem>
                      {index !== predictions.length - 1 && <Divider variant="inset" />}
                    </Fragment>
                  ))}

                {isLoadingPrediction && <Loader />}

                {!isLoadingPrediction && !predictions?.length && <Empty text="Chưa có dự đoán" />}
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
