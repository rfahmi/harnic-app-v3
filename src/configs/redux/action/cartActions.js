export const setCart = (value) => (dispatch) => {
  return dispatch({type: 'SET_CART', value: value});
};
export const setCount = (value) => (dispatch) => {
  return dispatch({type: 'SET_COUNT', value: value});
};
export const resetCart = (value) => (dispatch) => {
  return dispatch({type: 'RESET_CART', value: value});
};
