export function moneyFormat(money: number, currency: string) {
  let curr = 'USD';
  if (currency) {
    curr = currency;
  }
  if (Intl)
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(money);
  return '';
}
