export const formatToPersianNumber = (number: number): string => {
  return new Intl.NumberFormat("fa-IR").format(number);
};
