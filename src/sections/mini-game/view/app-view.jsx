import { useState, useEffect } from 'react';

import { grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  List,
  Stack,
  Paper,
  Button,
  Avatar,
  ListItem,
  Typography,
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
  const { items: predictions, isLoading } = useData('/predictions?populate=*');

  const [match, setMatch] = useState();

  const onOpenPredictionDialog = () => {
    $emit('@dialog.prediction.action.open', { match });
  };

  useEffect(() => {
    const loadComingMatch = () => {
      MatchAPI.getComingMatch().then((res) => {
        setMatch(res.data.data);
      });
    };

    loadComingMatch();
  }, []);

  return (
    <Container>
      <Stack alignItems="center" spacing={2}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Chakra Petch',
          }}
        >
          Dự đoán tỉ số
        </Typography>

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
              {10}
            </Typography>

            <Iconify icon="material-symbols:poker-chip" />
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
            <Grid2 item lg={4} md={4} sm={4} xs={4}>
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

            <Grid2 item lg={4} md={4} sm={4} xs={4}>
              <Button variant="outlined" size="small" fullWidth onClick={onOpenPredictionDialog}>
                Dự đoán
              </Button>
            </Grid2>

            <Grid2 item lg={4} md={4} sm={4} xs={4}>
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

        <List
          sx={{
            width: '100%',
            maxWidth: {
              lg: 512,
              md: 512,
              sm: 360,
              xs: '100%',
            },
            bgcolor: 'transparent',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: grey[400],
            borderRadius: 2,
          }}
        >
          {predictions &&
            predictions.map((prediction) => (
              <ListItem key={prediction.id} alignItems="flex-start">
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
            ))}

          {isLoading && <Loader />}

          {!isLoading && !predictions?.length && <Empty text="Chưa có dự đoán" />}
        </List>
      </Stack>
    </Container>
  );
}
