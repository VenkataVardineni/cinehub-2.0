import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

const TOKEN_KEY = 'cinehub_token';
const USER_KEY = 'cinehub_user';

function loadStoredAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

const initial = loadStoredAuth();

interface AuthState {
  token: string | null;
  user: User | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initial.token,
    user: initial.user,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
