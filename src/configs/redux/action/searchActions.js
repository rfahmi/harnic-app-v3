export const keywordChange = (value) => {
  return {type: 'CHANGE_KEYWORD', value: value};
};

export const maximumChange = (value) => {
  return {type: 'CHANGE_MAXIMUM', value: value};
};

export const minimumChange = (value) => {
  return {type: 'CHANGE_MINIMUM', value: value};
};

export const categoryChange = (value) => {
  return {type: 'CHANGE_CATEGORY', value: value};
};

export const brandChange = (value) => {
  return {type: 'BRAND_CATEGORY', value: value};
};

export const resetSearch = () => {
  return {type: 'RESET_SEARCH'};
};
