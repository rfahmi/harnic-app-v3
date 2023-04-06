import {useCallback} from 'react';
import debounce from 'lodash/debounce';

const debouncedNavigate = (navigateFn) => {
  const debouncedNavigateFn = useCallback(
    debounce(
      (...args) => {
        navigateFn(...args);
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [navigateFn],
  );

  return debouncedNavigateFn;
};

export default debouncedNavigate;
