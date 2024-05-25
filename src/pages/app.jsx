import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useAuth from 'src/hooks/auth';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    (async function () {
      const accessToken = searchParams.get('access_token');

      if (accessToken) {
        await signInWithGoogle(accessToken);
      }

      return navigate('/');
    })();
  }, [searchParams, navigate, signInWithGoogle]);

  return (
    <>
      <Helmet>
        <title> D88 | Nhà cái đến từ hư vô </title>
      </Helmet>

      <AppView />
    </>
  );
}
