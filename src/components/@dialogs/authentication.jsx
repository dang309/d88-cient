import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
  Tab,
  Box,
  Link,
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

import Logo from '../logo';
import Iconify from '../iconify';

const TAB = {
  LOGIN: 0,
  REGISTER: 1,
};

export default function AuthenticationDialog() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: '',
      phone: '',
    },
  });

  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(TAB.LOGIN);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = handleSubmit(async (data) => {
    await signIn(data.username, data.password)  
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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
            <TextField label="Tên" value={value} onChange={onChange} />
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

        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Link variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          color="inherit"
          onClick={onSubmit}
        >
          Đăng nhập
        </LoadingButton>
      </Stack>
    </Box>
  );

  // const registerForm = (
  //   <Stack spacing={2} sx={{ pt: 2 }}>
  //     <TextField
  //       name="username"
  //       label="Tên"
  //       value={authData.username}
  //       onChange={(e) => onChangeAuthData('username', e.target.value)}
  //     />

  //     <TextField
  //       name="phone"
  //       label="Số điện thoại"
  //       value={authData.phone}
  //       onChange={(e) => onChangeAuthData('phone', e.target.value)}
  //     />

  //     <TextField
  //       name="password"
  //       label="Mật khẩu"
  //       type={showPassword ? 'text' : 'password'}
  //       value={authData.password}
  //       onChange={(e) => onChangeAuthData('password', e.target.value)}
  //       InputProps={{
  //         endAdornment: (
  //           <InputAdornment position="end">
  //             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
  //               <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
  //             </IconButton>
  //           </InputAdornment>
  //         ),
  //       }}
  //     />

  //     <LoadingButton
  //       fullWidth
  //       size="large"
  //       type="submit"
  //       variant="contained"
  //       color="inherit"
  //       onClick={onSubmit}
  //     >
  //       Đăng ký
  //     </LoadingButton>
  //   </Stack>
  // );

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Đăng nhập
      </Button>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   component: 'form',
        //   onSubmit,
        // }}
      >
        <DialogTitle>
          <Logo />
        </DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={onChangeTab} aria-label="basic tabs example">
            <Tab label="Đăng nhập" />
            <Tab label="Đăng ký" />
          </Tabs>

          {tab === TAB.LOGIN && loginForm}

          {/* {tab === TAB.REGISTER && registerForm} */}

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
              type='link'
              href='http://localhost:1337/api/connect/google'
              startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" />}
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              Đăng nhập bằng Google
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
