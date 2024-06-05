import PropTypes from 'prop-types';
import { useLocalStorage } from 'react-use';
import { useEffect, useCallback } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Link, Alert, Button, Container, Typography } from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { NavItem } from './nav';
import { HEADER } from './config-layout';
import navConfig from './config-navigation';
import AccountPopover from './common/account-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { $emit } = useEventBus();
  const location = useLocation();
  const [shouldShowMiniGameAlert, setShouldShowMiniGameAlert] = useLocalStorage(
    'shouldShowMiniGameAlert',
    true
  );

  const downLg = useResponsive('down', 'lg');

  const onOpenRechargeDialog = () => $emit('@dialog.recharge.action.open');
  const onOpenAuthDialog = () => $emit('@dialog.auth.action.open');

  const onCloseAlert = useCallback(() => {
    setShouldShowMiniGameAlert(false);
  }, [setShouldShowMiniGameAlert]);

  const renderContent = (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {downLg ? (
          <IconButton onClick={onOpenNav}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        ) : (
          <Logo />
        )}

        {!downLg && (
          <Stack direction="row" component="nav" spacing={0.5} sx={{ px: 1 }}>
            {navConfig.map((item) => {
              if (item.type === 'authenticated' && !user) return null;
              return <NavItem key={item.title} item={item} />;
            })}
          </Stack>
        )}

        {downLg && (
          <Stack alignItems="center" sx={{ flexGrow: 1 }}>
            <Logo sx={{ height: 32 }} />
          </Stack>
        )}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            ml: {
              lg: 0,
              md: 0,
              sm: 'auto',
              xs: 'auto',
            },
          }}
        >
          {user ? (
            <>
              <Button
                color="warning"
                variant="outlined"
                onClick={onOpenRechargeDialog}
                endIcon={<Iconify icon="material-symbols:poker-chip" />}
              >
                {user?.balance || 0}
              </Button>
              {/* <NotificationsPopover /> */}
              <AccountPopover />
            </>
          ) : (
            <Button variant="contained" onClick={onOpenAuthDialog}>
              Đăng nhập
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );

  useEffect(() => {
    if (location.pathname.includes('mini-game')) {
      onCloseAlert();
    }

    if (shouldShowMiniGameAlert === false) {
      onCloseAlert();
    }
  }, [location, shouldShowMiniGameAlert, onCloseAlert]);

  return (
    <AppBar
      position={shouldShowMiniGameAlert ? 'static' : 'fixed'}
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(!downLg && {
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Container>
        {shouldShowMiniGameAlert && (
          <Alert
            severity="info"
            variant="outlined"
            action={
              <IconButton onClick={onCloseAlert}>
                <Iconify icon="line-md:close" />
              </IconButton>
            }
            sx={{ width: '100%' }}
          >
            <Typography variant="caption">
              Tham gia mini game ngay để tăng thu nhập thôi nào!{' '}
              <Link component={RouterLink} variant="caption" to="/mini-game" onClick={onCloseAlert}>
                Tham gia ngay
              </Link>
            </Typography>
          </Alert>
        )}
      </Container>
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
