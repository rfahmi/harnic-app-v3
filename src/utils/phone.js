export const sanitizePhone = (number) => {
  let numerize = number.replace(/[^0-9]/g, '');
  console.log(numerize);
  let first_number = numerize.substring(0, 2);

  if (first_number === '62') {
    return '0' + numerize.substring(2);
  }

  return numerize;
};
