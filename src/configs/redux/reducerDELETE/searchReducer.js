const initialState = {
  keyword: null,
  minimum_price: 0,
  maximum_price: 1000000,
  category: null,
  brand: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_KEYWORD':
      return {
        ...state,
        keyword: action.value,
      };
    case 'CHANGE_MINIMUM':
      return {
        ...state,
        minimum_price: action.value,
      };
    case 'CHANGE_MAXIMUM':
      return {
        ...state,
        maximum_price: action.value,
      };
    case 'CHANGE_CATEGORY':
      return {
        ...state,
        category: action.value,
      };
    case 'BRAND_CATEGORY':
      return {
        ...state,
        brand: action.value,
      };
    case 'RESET_SEARCH':
      return initialState;
    default:
      return state;
  }
};

export default searchReducer;
