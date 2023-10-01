const initialState = {
  selectedProduct: null,
};

const billingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCT':
      return {
        ...state,
        selectedProduct: action.value,
      };
    default:
      return state;
  }
};

export default billingReducer;
