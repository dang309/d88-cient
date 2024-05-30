import { Helmet } from 'react-helmet-async';

import { MiniGameView } from 'src/sections/mini-game/view';

// ----------------------------------------------------------------------

export default function MiniGamePage() {
  return (
    <>
      <Helmet>
        <title> D88 | Mini Game </title>
      </Helmet>

      <MiniGameView />
    </>
  );
}
