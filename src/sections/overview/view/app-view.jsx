
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import useData from 'src/hooks/data';

import { Empty, Loader } from 'src/components/common';

import MatchBox from '../components/match-box';

// ----------------------------------------------------------------------

export default function AppView() {
  const { items: matches, isLoading } = useData('/matches');
  return (
    <Container>
      <Grid2 container justifyContent="start" spacing={1}>
        {matches &&
          matches.map((match) => (
            <Grid2 key={match.id} item lg={4} md={6} sm={12} xs={12}>
              <MatchBox match={match} />
            </Grid2>
          ))}
        {
          isLoading && <Loader />
        }
        {
          !isLoading && matches && matches.length === 0 && <Empty />
        }
      </Grid2>
    </Container>
  );
}
