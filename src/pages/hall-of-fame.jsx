import { Helmet } from 'react-helmet-async';

import { HallOfFameView } from 'src/sections/hall-of-fame/view';

// ----------------------------------------------------------------------

export default function HallOfFamePage() {
  return (
    <>
      <Helmet>
        <title> D88 | Hall of Fame </title>
      </Helmet>

      <HallOfFameView />
    </>
  );
}
