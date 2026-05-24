import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";
import { data, Link, useNavigate } from "react-router";
import AmountCard from "../components/AmountCard";
import MonthlyBarChart from "../components/MonthlyBarChart";
import ExpensePieChart from "../components/ExpenseChart";
import AllTransactionPage from './AllTransactionsPage';
import '../styles/dashboardPage.css'
import { useDashboardData } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";

function DashboardPage() {
  const {userId} = useAuth();
  const today = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric',});

  const [showCurrentMonth, setShowCurrentMonth] = useState(true);
  const [amountOfMonths, setAmountOfMonths] = useState(6);
  const [mobileChartIndex, setMobileChartIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(today);
  const [selectedMndNL, setSelectedMndNL] = useState(new Date().toLocaleString('nl', { month: 'short', year: 'numeric',}));
  const currentMonth = new Date().toLocaleString('nl', {
    month: 'short',
    year: 'numeric',
  });
  const navigate = useNavigate();

  const { data: currentUser, isLoading, isError } = useUser(userId);
  const { data: dashboardData, isLoading: isDashboardDataLoading, isError: isDashboardDataError } = useDashboardData();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();

  const selectedMonthData = dashboardData?.monthlyChart?.find(
    (item) => item.month === selectedMonth 
  ) || { income: 0, expense: 0, savings: 0, };

  const currentMonthExpenses = dashboardData?.expenseCategoriesPerMonth?.map((category) => {
    const monthData = category.monthlyData?.find((data) => data.month === selectedMonth)
    return {
      category: category.category,
      amount: monthData ? monthData.amount : 0,
    }
  }) || [];

  if(isLoading || isDashboardDataLoading || isCategoriesLoading) return <div><h1>Welkom: Laden...</h1></div>;
  if(isError || isDashboardDataError || isCategoriesError) return <div>Error met laden van gebruikersgegevens</div>;

  
  const nextChart = () => {setMobileChartIndex((prev) => (prev === 1 ? 0 : prev + 1));};
  const prevChart = () => {setMobileChartIndex((prev) => (prev === 0 ? 1 : prev - 1));};

  function loadLastThreeMonths() {
  const months = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      label: date.toLocaleString('nl', { month: 'short' }),
      value: date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
    });
  }
  return months;
  }

  function setMonth(monthValue) {
    setSelectedMonth(monthValue);
    setSelectedMndNL(new Date(monthValue).toLocaleString('nl', { month: 'short', year: 'numeric' }));
  }

  return (
    <>
    <div className="top-container">
      <div className="text-container">
        <h1 data-testid="Welcome-title">Welkom, {currentUser.name}!</h1>
        <p data-testid="Dashboard-description">Dit is uw persoonlijke financiële dashboard voor <span>{selectedMndNL}</span></p>
      </div>
      <div className="last-three-months-container">
        {loadLastThreeMonths().map((month, index) => (
        <button data-testid="month-button" key={index} value={month.value} className={selectedMonth === month.value ? "month-button active": "month-button"} onClick={() => setMonth(month.value)}>
          {month.label}
        </button>
      ))}
      </div>
      <div className="add-transaction">
        <Link to="/transactions/add">
          <button data-testid="add-transaction-button" className="add-transaction-button">+ Transactie toevoegen</button>
        </Link>
      </div>
    </div>
    <div className="dashboard-container">
      <div className="amount-card-container">
        <AmountCard data-testid="amount-card-total" type="totaal" value={ selectedMonthData.income - selectedMonthData.expense - selectedMonthData.savings } />
        <AmountCard data-testid="amount-card-income" type="inkomen" value={selectedMonthData.income} />
        <AmountCard data-testid="amount-card-expenses" type="uitgaven" value={selectedMonthData.expense} />
        <AmountCard data-testid="amount-card-savings" type="sparen" value={dashboardData?.summary.totalSavings} />
      </div>
      {/* DESKTOP CHARTS */}
      <div className="charts-container">
        <div className="graph-chart" data-testid="income-expense-chart">
          <div className="graph-top">
            <h2 className="title">Inkomsten vs Uitgaven</h2>
            <div className="btn-container">
              <button data-testid="month-btn-6" className={amountOfMonths === 6 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(6)}> 6 M </button>
              <button data-testid="month-btn-12" className={amountOfMonths === 12 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(12)}> 12 M </button>
            </div>
          </div>
          {amountOfMonths === 6 ? (<MonthlyBarChart data={dashboardData?.monthlyChart.slice(6) || []} />) : (<MonthlyBarChart data={dashboardData?.monthlyChart || []} />)}
        </div>
        <div className="pie-chart" data-testid="expense-pie-chart">
          <div className="graph-top">
            {showCurrentMonth ? ( <h2 className="title">Uitgaven {selectedMndNL}</h2>) : (<h2 className="title">Uitgaven per categorie</h2>)}
            <button data-testid="show-all-expenses-btn" className="month-btn active" onClick={() => setShowCurrentMonth(!showCurrentMonth)}>
              {showCurrentMonth ? "Toon alle uitgaven" : "Toon huidige maand"}
            </button>
          </div>
          <ExpensePieChart
            expenseData={ showCurrentMonth ? currentMonthExpenses : dashboardData?.expenseCategories || [] }
            categories={categories || []}
          />
        </div>
      </div>

      {/* MOBILE CHART SLIDER */}
      <div className="mobile-chart-wrapper">
        <div className="mobile-chart-top">
          <button className="chart-arrow" onClick={prevChart}>{"<"}</button>
          <button className="chart-arrow" onClick={nextChart}>{">"}</button>
        </div>
        {mobileChartIndex === 0 ? (
          <div className="graph-chart">
            <div className="graph-top">
              <h2>Inkomsten vs Uitgaven</h2>
              <div className="btn-container">
                <button className={amountOfMonths === 6 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(6)}> 6 M </button>
                <button className={amountOfMonths === 12 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(12)}> 12 M </button>
              </div>
            </div>
            {amountOfMonths === 6 ? (<MonthlyBarChart data={dashboardData?.monthlyChart.slice(6) || []} />) : (<MonthlyBarChart data={dashboardData?.monthlyChart || []} />)}
          </div>
        ) : (
          <div className="pie-chart">
            <div className="graph-top">
              {showCurrentMonth ? (<h2>Uitgaven {selectedMndNL}</h2>) : (<h2>Uitgaven per categorie</h2>)}

              <button data-testid="show-all-expenses-btn" className="month-btn active" onClick={() => setShowCurrentMonth(!showCurrentMonth)}>
                {showCurrentMonth ? "Toon alle uitgaven" : "Toon huidige maand"}
              </button>
            </div>
            <ExpensePieChart
              expenseData={ showCurrentMonth ? currentMonthExpenses : dashboardData?.expenseCategories || [] }
              categories={categories || []}
            />
          </div>
        )}
      </div>
    </div>
    <div className="recent-transactions-container">
      <h2>Recente Transacties</h2>
      <AllTransactionPage data-testid="all-transaction-div" recentOnly={true} />
    </div>
    </>
  )
}

export default DashboardPage