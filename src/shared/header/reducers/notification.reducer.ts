import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from 'src/shared/header/interfaces/header.interface';

const initialValue: INotification = {
  hasUnreadMessage: false,
  hasUnreadNotification: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialValue,
  reducers: {
    updateNotification: (_state, action: PayloadAction<INotification>) => {
      return action.payload;
    }
  }
});

export const { updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
