export function debounce<F extends (...args: any[]) => void>(timer: NodeJS.Timer, func: F, delay: number): (...args: Parameters<F>) => void {
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
