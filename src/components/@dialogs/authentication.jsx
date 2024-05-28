import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
  Tab,
  Box,
  Tabs,
  Stack,
  alpha,
  Divider,
  useTheme,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  InputAdornment,
} from '@mui/material';

import useAuth from 'src/hooks/auth';
import useEventBus from 'src/hooks/event-bus';

import Logo from '../logo';
import Iconify from '../iconify';

const TAB = {
  LOGIN: 0,
  REGISTER: 1,
};

export default function AuthenticationDialog() {
  const theme = useTheme();
  const { signIn, register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { $on } = useEventBus();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(TAB.LOGIN);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = handleSubmit(async (data) => {
    if (tab === TAB.LOGIN) {
      signIn(data.username, data.password).then(() => {
        enqueueSnackbar('Đăng nhập thành công!', {
          variant: 'success',
        });
        onClose();
      });
    } else if (tab === TAB.REGISTER) {
      register(data).then(() => {
        enqueueSnackbar('Đăng Ký thành công!', {
          variant: 'success',
        });
        onClose();
      });
    }
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChangeTab = (_, newTab) => {
    setTab(newTab);
  };

  const loginForm = (
    <Box sx={{ pt: 2 }}>
      <Stack spacing={2}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextField label="Tên" required value={value} onChange={onChange} />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextField
              name="password"
              label="Mật khẩu"
              value={value}
              onChange={onChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Link variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack> */}

        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          color="inherit"
          type="submit"
          loading={isSubmitting}
        >
          Đăng nhập
        </LoadingButton>
      </Stack>
    </Box>
  );

  const registerForm = (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextField label="Tên" autoComplete="off" value={value} onChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField label="Email" type="email" value={value} onChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isSubmitting}
      >
        Đăng ký
      </LoadingButton>
    </Stack>
  );

  React.useEffect(() => {
    $on('@dialog.auth.action.open', () => {
      onOpen();
    });
  }, [$on]);

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit,
      }}
    >
      <DialogTitle>
        <Logo />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={onChangeTab} aria-label="basic tabs example">
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        <Box sx={{ pt: 2 }}>
          {tab === TAB.LOGIN && loginForm}

          {tab === TAB.REGISTER && registerForm}
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hoặc
          </Typography>
        </Divider>

        <Stack direction="row">
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            type="link"
            href={`${import.meta.env.VITE_API_ROOT}/api/connect/google`}
            startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" />}
            sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
          >
            Đăng nhập bằng Google
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
