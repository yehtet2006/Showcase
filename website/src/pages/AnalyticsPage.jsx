import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";
import { data, Link, useNavigate } from "react-router";
import MonthlyBarChart from "../components/MonthlyBarChart";
import ExpensePieChart from "../components/ExpenseChart";
import '../styles/dashboardPage.css'
import { useDashboardData } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";

function AnalyticsPage() {
  const {userId} = useAuth();

  const today = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric',});
  const [amountOfMonths, setAmountOfMonths] = useState(6);
  const [showCurrentMonth, setShowCurrentMonth] = useState(true);
  const [mobileChartIndex, setMobileChartIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(today);
  
  const currentMonth = new Date().toLocaleString('nl', {
    month: 'short',
    year: 'numeric',
  });

  

  const { data: dashboardData, isLoading: isDashboardDataLoading, isError: isDashboardDataError } = useDashboardData();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();
  
  const currentMonthExpenses = dashboardData?.expenseCategoriesPerMonth?.map((category) => {
    const monthData = category.monthlyData?.find((data) => data.month === selectedMonth)
    return {
      category: category.category,
      amount: monthData ? monthData.amount : 0,
    }
  }) || [];

  if(isDashboardDataLoading ) return <div><h1>Analytics: Laden...</h1></div>;
  if(isDashboardDataError) return <div>Error met laden van analytics gegevens</div>;

  if(isCategoriesLoading) return <div><h1>Analytics: Laden...</h1></div>;
  if(isCategoriesError) return <div>Error met laden van categorieën</div>;

  const nextChart = () => {setMobileChartIndex((prev) => (prev === 1 ? 0 : prev + 1));};
  const prevChart = () => {setMobileChartIndex((prev) => (prev === 0 ? 1 : prev - 1));};


  return (
    <>
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
            {showCurrentMonth ? ( <h2 className="title">Uitgaven {currentMonth}</h2>) : (<h2 className="title">Uitgaven per categorie</h2>)}
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
              {showCurrentMonth ? (<h2>Uitgaven {currentMonth}</h2>) : (<h2>Uitgaven per categorie</h2>)}

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
    </>
    
  )
}

export default AnalyticsPage