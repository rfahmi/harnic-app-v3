import {combineReducers} from 'redux';
import cartReducer from './cartReducer';
import suggestionReducer from './suggestionReducer';
import searchReducer from './searchReducer';
import authReducer from './authReducer';

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  suggestion: suggestionReducer,
  search: searchReducer,
});

export default reducer;
