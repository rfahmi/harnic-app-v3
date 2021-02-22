export const setSuggestion = (value) => (dispatch) => {
  return dispatch({type: 'SET_SUGGESTION', value: value});
};
