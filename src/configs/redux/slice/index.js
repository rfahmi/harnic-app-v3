import {combineReducers} from 'redux';
import cartSlice from './cartSlice';
import suggestionSlice from './suggestionSlice';
import searchSlice from './searchSlice';
import authSlice from './authSlice';
import billingSlice from './billingSlice';
import cashierSlice from './cashierSlice';

const reducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  suggestion: suggestionSlice,
  search: searchSlice,
  billing: billingSlice,
  cashier: cashierSlice,
});

export default reducer;
