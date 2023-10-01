import {createSlice} from '@reduxjs/toolkit';

const initialState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      if (action.payload === undefined) {
        return state;
      }
      return action.payload;
    },
    setCount: (state, action) => {
      if (state.length > 0) {
        state[0].item_count = action.payload;
      }
    },
    resetCart: () => initialState,
  },
});

export const {setCart, setCount, resetCart} = cartSlice.actions;

export default cartSlice.reducer;
