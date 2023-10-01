// suggestionSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  suggestion: [],
};

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState,
  reducers: {
    setSuggestion: (state, action) => {
      state.suggestion = action.payload;
    },
  },
});

export const {setSuggestion} = suggestionSlice.actions;
export default suggestionSlice.reducer;
