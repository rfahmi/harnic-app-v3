const initialState = [];

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CART':
      if (action.value === undefined) {
        return state;
      }
      return action.value;
    case 'SET_COUNT':
      return {
        ...state,
        item_count: action.value,
      };
    case 'RESET_CART':
      return initialState;
    default:
      return state;
  }
};

export default cartReducer;
