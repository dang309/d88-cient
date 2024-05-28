import { Helmet } from 'react-helmet-async';

import { TransactionHistoryView } from 'src/sections/transaction-history/view';

// ----------------------------------------------------------------------

export default function RechargeWithdrawHistoryPage() {
  return (
    <>
      <Helmet>
        <title> D88 | Lịch sử nạp/rút </title>
      </Helmet>

      <TransactionHistoryView />
    </>
  );
}
