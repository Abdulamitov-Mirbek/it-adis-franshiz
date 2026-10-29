/**
 * Модель окупаемости из файла «Для сайта калькулятора окупаемости_IT Adis.xlsx».
 * Себестоимость — 55% выручки, постоянные расходы и инвестиции зависят
 * от количества кабинетов. Срок окупаемости = инвестиции / чистая прибыль
 * в месяц (в месяцах).
 */

export type Rooms = 1 | 2;

export const PAYBACK_PLANS: Record<
  Rooms,
  {
    investment: number;
    area: number;
    fee: number;
    fixedCosts: number;
    revenue: { min: number; max: number };
  }
> = {
  1: {
    investment: 354402,
    area: 25,
    fee: 200000,
    fixedCosts: 2114300 / 12,
    revenue: { min: 550000, max: 1930000 },
  },
  2: {
    investment: 862100,
    area: 75,
    fee: 500000,
    fixedCosts: 387440,
    revenue: { min: 1320000, max: 4640000 },
  },
};

const COST_SHARE = 0.55;

export function calculatePayback(rooms: Rooms, revenue: number) {
  const plan = PAYBACK_PLANS[rooms];
  const grossProfit = revenue - revenue * COST_SHARE;
  const netProfit = grossProfit - plan.fixedCosts;
  return {
    ...plan,
    netProfit,
    paybackMonths: netProfit > 0 ? plan.investment / netProfit : null,
  };
}
