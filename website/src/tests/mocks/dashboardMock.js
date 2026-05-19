export const dashboardMock = {
  summary: {
    totalAmount: 686,
    totalIncome: 1650,
    totalExpenses: 364,
    totalSavings: 400,
    totalBalanceThisMonth: 886
  },
  monthlyChart: [
    { month: "Jun 2025", income: 0, expense: 0, savings: 0 },
    { month: "Jul 2025", income: 0, expense: 0, savings: 0 },
    { month: "Aug 2025", income: 0, expense: 0, savings: 0 },
    { month: "Sep 2025", income: 0, expense: 0, savings: 0 },
    { month: "Oct 2025", income: 0, expense: 0, savings: 0 },
    { month: "Nov 2025", income: 0, expense: 0, savings: 0 },
    { month: "Dec 2025", income: 0, expense: 0, savings: 0 },
    { month: "Jan 2026", income: 0, expense: 0, savings: 0 },
    { month: "Feb 2026", income: 0, expense: 0, savings: 0 },
    { month: "Mar 2026", income: 0, expense: 0, savings: 0 },
    { month: "Apr 2026", income: 0, expense: 200, savings: 0 },
    { month: "May 2026", income: 1650, expense: 364, savings: 400 }
  ],
  expenseCategories: [
    { category: "Auto", amount: 344 },
    { category: "Gezondheid", amount: 200 },
    { category: "Eten", amount: 20 }
  ],
  expenseCategoriesPerMonth: [
    {
      category: "Auto",
      monthlyData: [
        { month: "May 2026", amount: 344 }
      ]
    },
    {
      category: "Gezondheid",
      monthlyData: [
        { month: "Apr 2026", amount: 200 }
      ]
    },
    {
      category: "Eten",
      monthlyData: [
        { month: "May 2026", amount: 20 }
      ]
    }
  ]
};