import { createSlice, Slice } from '@reduxjs/toolkit';
import { IAuthUser, IReduxAddAuthUser } from 'src/features/auth/interfaces/auth.interface';
import { initialAuthUserValues } from 'src/shared/utils/static-data';

const initialState: IAuthUser = initialAuthUserValues as IAuthUser;

const authSlice: Slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuthUser: (state: IAuthUser, action: IReduxAddAuthUser) => {
      const { authInfo } = action.payload;
      state = { ...authInfo } as unknown as IAuthUser;
      return state;
    },
    clearAuthUser: () => {
      return initialAuthUserValues as IAuthUser;
    }
  }
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
