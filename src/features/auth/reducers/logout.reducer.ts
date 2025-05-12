import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialValue = true;

const logoutSlice = createSlice({
  name: 'logout',
  initialState: initialValue,
  reducers: {
    updateLogout: (state: boolean, action: PayloadAction<boolean>): boolean => {
      state = action.payload;
      return state;
    },
    logout: (state: boolean): boolean => {
      return state;
    }
  }
});

export const { updateLogout, logout } = logoutSlice.actions;
export default logoutSlice.reducer;