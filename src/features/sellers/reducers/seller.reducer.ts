import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptySellerData } from 'src/shared/utils/static-data';

import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';

const initialValue: ISellerDocument = emptySellerData;

const sellerSlice = createSlice({
  name: 'seller',
  initialState: initialValue,
  reducers: {
    addSeller: (state, action: PayloadAction<ISellerDocument>) => {
      return { ...action.payload };
    },
    emptySeller: () => emptySellerData
  }
});

export const { addSeller, emptySeller } = sellerSlice.actions;
export default sellerSlice.reducer;
