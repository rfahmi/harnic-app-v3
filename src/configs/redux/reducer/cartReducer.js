const initialState = [];

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CART':
      // console.log('before', state);
      // console.log('action', action);
      return action.value;
    case 'SET_COUNT':
      // console.log('before', state);
      // console.log('action', action);
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
