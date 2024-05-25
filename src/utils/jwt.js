import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { JWT_COOKIE } from './constant';

// ----------------------------------------------------------------------

const isValidToken = (token) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (token) => {
  if (token) {
    Cookies.set(JWT_COOKIE, token);
  } else {
    Cookies.remove(JWT_COOKIE);
  }
};

export { setSession, isValidToken };
