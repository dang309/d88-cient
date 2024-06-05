import qs from 'qs';

import { Grid } from '@mui/material';
import Container from '@mui/material/Container';

import useData from 'src/hooks/data';

import { Empty, Loader } from 'src/components/common';

import MatchBox from '../components/match-box';

// ----------------------------------------------------------------------

export default function AppView() {
  const { items: matches, isLoading } = useData(
    `/matches?${qs.stringify({
      populate: ['result', 'handicap', 'overUnder'],
    })}`
  );
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
        alignItems="stretch"
        spacing={1}
      >
        {matches &&
          matches.map((match, index) => {
            const isComingMatch = index === 0;
            return (
              <Grid
                key={match.id}
                item
                lg={isComingMatch ? 8 : 4}
                md={isComingMatch ? 12 : 6}
                sm={isComingMatch ? 12 : 10}
                xs={isComingMatch ? 12 : 11}
                sx={{display: 'flex'}}
              >
                <MatchBox match={match} isComingMatch={isComingMatch} />
              </Grid>
            );
          })}
        {isLoading && <Loader />}
        {!isLoading && matches && matches.length === 0 && <Empty />}
      </Grid>
    </Container>
  );
}
