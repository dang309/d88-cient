
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import useData from 'src/hooks/data';

import MatchBox from '../components/match-box';

// ----------------------------------------------------------------------

export default function AppView() {
  const { items: matches } = useData('/matches');
  return (
    <Container>
      <Grid2 container justifyContent="start" spacing={1}>
        {matches &&
          matches.map((match) => (
            <Grid2 key={match.id} item lg={4} md={4} sm={12} xs={12}>
              <MatchBox match={match} />
            </Grid2>
          ))}
      </Grid2>
    </Container>
  );
}
