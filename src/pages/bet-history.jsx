import { Helmet } from 'react-helmet-async';

import { BetHistoryView } from 'src/sections/bet-history/view';

// ----------------------------------------------------------------------

export default function BetHistoryPage() {
  return (
    <>
      <Helmet>
        <title> D88 | Lịch sử cược </title>
      </Helmet>

      <BetHistoryView />
    </>
  );
}
