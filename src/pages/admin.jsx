import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title> D88 | Admin </title>
      </Helmet>

      <AppView />
    </>
  );
}
