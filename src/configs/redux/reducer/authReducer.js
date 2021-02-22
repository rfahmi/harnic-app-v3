const initialState = {
  isLogin: 0,
  priceType: 'sellprice',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isLogin: action.value,
      };
    case 'SET_PRICETYPE':
      return {
        ...state,
        priceType: action.value,
      };
    default:
      return state;
  }
};

export default authReducer;
