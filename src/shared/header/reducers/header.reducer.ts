import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialValue = 'index';

const headerSlice = createSlice({
  name: 'header',
  initialState: initialValue,
  reducers: {
    updateHeader: (_state, action: PayloadAction<string>) => {
      return action.payload;
    }
  }
});

export const { updateHeader } = headerSlice.actions;
export default headerSlice.reducer;
