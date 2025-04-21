// export function debounce<F extends (...args:any[])=>any>(fn:F, wait = 300) {
//     let t: NodeJS.Timeout;
//     return (...args: Parameters<F>) => {
//       clearTimeout(t);
//       t = setTimeout(()=> fn(...args), wait);
//     };
//   }

type AnyFn = (...args: any[]) => any;

export function debounce<
  F extends AnyFn
>(
  fn: F,
  wait = 300,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: any = null;
  let result: ReturnType<F>;

  const { leading = false, trailing = true } = options;

  const invoke = () => {
    if (lastArgs) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }
  };

  const debounced = function (this: any, ...args: Parameters<F>) {
    const shouldCallNow = leading && !timer;

    lastArgs = args;
    lastThis = this;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      if (trailing && lastArgs) {
        invoke();
      }
    }, wait);

    if (shouldCallNow) {
      invoke();
    }

    return result;
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = lastThis = null;
  };

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      invoke();
    }
  };

  return debounced as F & { cancel(): void; flush(): void };
}
