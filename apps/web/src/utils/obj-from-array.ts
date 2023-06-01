export const objFromArray = (arr: any[], key = 'id'): Record<any, any> =>
  arr.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
