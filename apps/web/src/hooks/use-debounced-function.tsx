import _ from 'lodash';
import { useRef } from 'react';

interface Props {
  fn: any
  delay: number
}
export const useDebouncedFunction = ({ fn, delay }: Props) => {
  const debouncedFn = useRef(_.debounce(fn, delay, { leading: false })).current;

  return debouncedFn;
};
