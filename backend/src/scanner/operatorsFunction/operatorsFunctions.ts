export const operatorFunctions = {
  'eq': (auction, type, value) => auction[type] === value,
  'gt': (auction, type, value) => auction[type] > value,
};
