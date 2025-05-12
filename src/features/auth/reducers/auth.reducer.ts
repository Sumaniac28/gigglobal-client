import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialAuthUserValues } from 'src/shared/utils/static-data';

import { IAuthUser, IReduxAuthPayload } from 'src/features/auth/interfaces/auth.interface';

const initialValue: IAuthUser = initialAuthUserValues as IAuthUser;

const authSlice = createSlice({
  name: 'auth',
  initialState: initialValue,
  reducers: {
    addAuthUser: (state: IAuthUser, action: PayloadAction<IReduxAuthPayload>): IAuthUser => {
      const { authInfo } = action.payload;
      state = { ...authInfo } as unknown as IAuthUser;
      return state;
    },
    clearAuthUser: (): IAuthUser => {
      return initialAuthUserValues;
    }
  }
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;