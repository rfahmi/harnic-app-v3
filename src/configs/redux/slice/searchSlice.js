// slices/searchSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  keyword: null,
  minimum_price: 0,
  maximum_price: 1000000,
  category: null,
  brand: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    changeKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    changeMinimum: (state, action) => {
      state.minimum_price = action.payload;
    },
    changeMaximum: (state, action) => {
      state.maximum_price = action.payload;
    },
    changeCategory: (state, action) => {
      state.category = action.payload;
    },
    brandChange: (state, action) => {
      state.brand = action.payload;
    },
    resetSearch: state => {
      return initialState;
    },
  },
});

export const {
  changeKeyword,
  changeMinimum,
  changeMaximum,
  changeCategory,
  brandChange,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
