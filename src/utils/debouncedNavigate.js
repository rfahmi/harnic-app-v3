import debounce from 'lodash/debounce';

const debouncedNavigate = navigateFn => {
  console.log(navigateFn);
  const debouncedNavigateFn = debounce(
    (...args) => {
      navigateFn(...args);
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  return debouncedNavigateFn;
};

export default debouncedNavigate;
