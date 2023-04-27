export const trimString = (str: string, length: number) => (str.length > length ? `${str.substring(0, length - 3)}...` : str);
