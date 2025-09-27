// src/utils/helpers.js
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price);
};
