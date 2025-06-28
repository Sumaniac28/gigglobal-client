import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialValue = true;

const categoryContainerSlice = createSlice({
  name: 'showCategoryContainer',
  initialState: initialValue,
  reducers: {
    updateCategoryContainer: (_state, action: PayloadAction<boolean>) => {
      return action.payload;
    }
  }
});

export const { updateCategoryContainer } = categoryContainerSlice.actions;
export default categoryContainerSlice.reducer;
