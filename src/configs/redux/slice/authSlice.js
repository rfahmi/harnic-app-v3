// slices/authSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  priceType: 'sellprice',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      console.log('SET AUTH', action.payload);
      state.isLogin = action.payload;
    },
    setPriceType: (state, action) => {
      state.priceType = action.payload;
    },
  },
});

export const {setAuth, setPriceType} = authSlice.actions;
export default authSlice.reducer;
