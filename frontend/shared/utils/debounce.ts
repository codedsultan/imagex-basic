export default function debounce(func: (...args: any[]) => void, delay: number = 250) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// function debounce(fn, delay = 250) {
//   let timeout;

//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// }
