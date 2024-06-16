import PropTypes from 'prop-types';
import { useLocalStorage } from 'react-use';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Tab, Link, Tabs, Alert, Button, Container, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { HEADER } from './config-layout';
import navConfig from './config-navigation';
import AccountPopover from './common/account-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { $emit } = useEventBus();
  const location = useLocation();
  const [shouldShowMiniGameAlert, setShouldShowMiniGameAlert] = useLocalStorage('shouldShowMiniGameAlert', true);

  const downLg = useResponsive('down', 'lg');

  const [navItem, setNavItem] = useState(0);

  const onOpenRechargeDialog = () => $emit('@dialog.recharge.action.open');
  const onOpenAuthDialog = () => $emit('@dialog.auth.action.open');

  const onChangeNavItem = (_e, newNavItem) => {
    setNavItem(newNavItem);
  };

  const onCloseAlert = useCallback(() => {
    setShouldShowMiniGameAlert(false);
  }, [setShouldShowMiniGameAlert]);

  const renderContent = (
    <>
      {downLg ? (
        <IconButton onClick={onOpenNav}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      ) : (
        <Logo />
      )}

      {!downLg && (
        <Tabs centered value={navItem} onChange={onChangeNavItem}>
          {navConfig.map((item, index) => {
            if (item.type === 'authenticated' && !user) return null;

            return (
              <Tab label={item.title} component={RouterLink} href={item.path} icon={item.icon}>
                {item.title}
              </Tab>
            );
          })}
        </Tabs>
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
          <Button variant="contained" onClick={onOpenAuthDialog} size={downLg ? 'small' : 'medium'}>
            Đăng nhập
          </Button>
        )}
      </Stack>
    </>
  );

  useEffect(() => {
    if (location.pathname.includes('mini-game')) {
      onCloseAlert();
    }

    if (shouldShowMiniGameAlert === false) {
      onCloseAlert();
    }

    navConfig.forEach((nav, index) => {
      if (location.pathname.includes(nav.path)) {
        setNavItem(index);
      }
    });
  }, [location, shouldShowMiniGameAlert, onCloseAlert]);

  return (
    <AppBar
      position={shouldShowMiniGameAlert ? 'static' : 'fixed'}
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        background: 'transparent !important',
        backgroundImage: 'none',
        mt: shouldShowMiniGameAlert ? 0 : 2,
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
            variant="standard"
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

        <Toolbar
          variant="regular"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            bgcolor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
          }}
        >
          {renderContent}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
