const initialState = {
  suggestion: [],
};

const suggestionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SUGGESTION':
      console.log('before', state.suggestion);
      console.log('action', action);
      return action.value;

    default:
      return state;
  }
};

export default suggestionReducer;
