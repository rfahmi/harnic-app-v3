// slices/authSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLogin: 0,
  priceType: 'sellprice',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLogin = action.payload;
    },
    setPriceType: (state, action) => {
      state.priceType = action.payload;
    },
  },
});

export const {setAuth, setPriceType} = authSlice.actions;
export default authSlice.reducer;
