// utils
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, createContext } from 'react';

import { JWT_COOKIE } from 'src/utils/constant';
import { setSession, isValidToken } from 'src/utils/jwt';

import { AuthAPI, UserAPI } from 'src/api';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  UPDATE: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  initialize: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  register: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
});

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const signIn = async (email, password) => {
    const res = await AuthAPI.login(email, password);
    const { user, jwt } = res.data;
    user.token = jwt;

    setSession(jwt);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (data) => {
    try {
      const res = await AuthAPI.register(data);
      const { user, jwt } = res.data;
      user.token = jwt;

      setSession(jwt);
      dispatch({
        type: 'REGISTER',
        payload: {
          user,
        },
      });
    } catch (err) {
      return err;
    }
  };

  const signInWithGoogle = async (accessToken) => {
    try {
      const res = await AuthAPI.loginWithGoogle(accessToken);
      const { user, jwt } = res.data;
      user.token = jwt;

      setSession(jwt);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (error) {
      return error;
    }
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
    Cookies.remove(JWT_COOKIE);
  };

  const changePassword = () => {};

  const updateProfile = async (id, data) =>
    UserAPI.update(id, data).then((res) => {
      if (res.status === 200) {
        const user = res.data.data;
        dispatch({
          type: 'UPDATE',
          payload: {
            user,
          },
        });
      }
    });

  const initialize = async () => {
    try {
      const jwt = Cookies.get(JWT_COOKIE);

      if (jwt && isValidToken(jwt)) {
        setSession(jwt);

        const res = await UserAPI.me();
        const user = res.data;
        user.token = jwt;

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      method: 'jwt',
      initialize,
      signIn,
      register,
      signInWithGoogle,
      signOut,
      changePassword,
      updateProfile,
    }),
    [state]
  );

  useEffect(() => {
    initialize();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export { AuthContext, AuthProvider };
