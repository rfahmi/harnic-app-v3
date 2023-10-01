import {combineReducers} from 'redux';
import cartReducer from './cartReducer';
import suggestionReducer from './suggestionReducer';
import searchReducer from './searchReducer';
import authReducer from './authReducer';
import billingReducer from './billingReducer';

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  suggestion: suggestionReducer,
  search: searchReducer,
  billing: billingReducer,
});

export default reducer;
