export const currencyFormat = (number) => {
  return number && number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};
