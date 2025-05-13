import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { emptyBuyerData } from 'src/shared/utils/static-data';

import { IBuyerDocument, IReduxBuyer } from 'src/features/buyer/interfaces/buyer.interface';

const initialValue: IBuyerDocument = emptyBuyerData;

const buyerSlice = createSlice({
  name: 'buyer',
  initialState: initialValue,
  reducers: {
    addBuyer: (state, action: PayloadAction<IBuyerDocument>) => {
      return { ...action.payload };
    },
    emptyBuyer: () => emptyBuyerData,
  }
});

export const { addBuyer, emptyBuyer } = buyerSlice.actions;
export default buyerSlice.reducer;
