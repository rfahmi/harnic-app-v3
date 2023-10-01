// billingSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedProduct: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const {setProduct} = billingSlice.actions;
export default billingSlice.reducer;
