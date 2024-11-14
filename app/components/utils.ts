export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const percentageChange = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;
  return ((thisMonth - lastMonth) / Math.abs(lastMonth)) * 100;
};
