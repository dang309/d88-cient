import { Fragment } from 'react';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  List,
  Card,
  Stack,
  Avatar,
  Divider,
  ListItem,
  Container,
  Typography,
  CardHeader,
  CardContent,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import useData from 'src/hooks/data';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Empty, Loader } from 'src/components/common';

const HallOfFamePage = () => {
  const { items: top3Players, isLoading } = useData('/bets/hall-of-fame');
  return (
    <Container>
      <Grid2 container justifyContent="center">
        <Grid2 item lg={6} md={8} sm={10} xs={12}>
          <Card>
            <CardHeader
              sx={{ p: 0.5 }}
              title={
                <Stack justifyContent="center" alignItems="center">
                  <Iconify icon="noto-v1:crown" sx={{ height: 64, width: 64 }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: 'Ruslan Display',
                    }}
                  >
                    Hall of fame
                  </Typography>
                </Stack>
              }
            />
            <CardContent>
              {top3Players && (
                <List>
                  {top3Players
                    .sort((a, b) => b.profit - a.profit)
                    .slice(0, 3)
                    .map((player, index) => {
                      const icon =
                        index === 0 ? 'noto:1st-place-medal' : index === 1 ? 'noto:2nd-place-medal' : 'noto:3rd-place-medal';
                      const iconSize = index === 0 ? 48 : index === 1 ? 40 : 32;
                      return (
                        <Fragment key={index}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar alt="Remy Sharp" src={player.avatarUrl} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={player.username}
                              secondary={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="caption" color="text.primary">
                                    Tổng chip đã thắng:
                                  </Typography>
                                  <Label color="warning" endIcon={<Iconify icon="material-symbols:poker-chip" />}>
                                    {player?.profit?.toFixed(2)}
                                  </Label>
                                </Stack>
                              }
                            />
                            <Iconify icon={icon} sx={{ height: iconSize, width: iconSize }} />
                          </ListItem>
                          {index !== top3Players.length - 1 && <Divider variant="inset" component="li" />}
                        </Fragment>
                      );
                    })}
                </List>
              )}
              {isLoading && <Loader />}

              {!isLoading && top3Players && !top3Players.length && <Empty />}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default HallOfFamePage;
