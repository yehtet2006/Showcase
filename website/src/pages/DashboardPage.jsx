import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";
import { data, Link, useNavigate } from "react-router";
import AmountCard from "../components/AmountCard";
import MonthlyBarChart from "../components/MonthlyBarChart";
import ExpensePieChart from "../components/ExpenseChart";
import '../styles/dashboardPage.css'
import { useDashboardData } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";

function DashboardPage() {
  const {userId} = useAuth();
  // Get current month and year for display
  const maand = new Date().toLocaleString('en-us', { month: 'short' });
  const jaar = new Date().getFullYear();
  
  const [showCurrentMonth, setShowCurrentMonth] = useState(true);
  const [amountOfMonths, setAmountOfMonths] = useState(6);
  const [mobileChartIndex, setMobileChartIndex] = useState(0);

  const currentMonth = new Date().toLocaleString('en-us', {
    month: 'short',
    year: 'numeric',
  });
  const navigate = useNavigate();

  const { data: currentUser, isLoading, isError } = useUser(userId);
  const { data: dashboardData, isLoading: isDashboardDataLoading, isError: isDashboardDataError } = useDashboardData();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();

  const currentMonthExpenses = dashboardData?.expenseCategoriesPerMonth?.map((category) => {
  const monthData = category.monthlyData?.find((data) => data.month === currentMonth)
    return {
      category: category.category,
      amount: monthData ? monthData.amount : 0,
    }
  }) || [];

  if(isLoading || isDashboardDataLoading || isCategoriesLoading) return <div><h1>Welkom: Laden...</h1></div>;
  if(isError || isDashboardDataError || isCategoriesError) return <div>Error met laden van gebruikersgegevens</div>;

  
  const nextChart = () => {setMobileChartIndex((prev) => (prev === 1 ? 0 : prev + 1));};
  const prevChart = () => {setMobileChartIndex((prev) => (prev === 0 ? 1 : prev - 1));};


  return (
    <>
    <div className="top-container">
      <div className="text-container">
        <h1>Welkom, {currentUser.name}!</h1>
        <p>Dit is uw persoonlijke financiële dashboard voor <span>{maand.charAt(0).toUpperCase() + maand.slice(1)} {jaar}</span></p>
      </div>
      <div className="last-three-months-container">
        <button value={"feb"} className="month-button">feb</button>
        <button value={"mar"} className="month-button">mar</button>
        <button value={"april"} className="month-button">april</button>
      </div>
      <div className="add-transaction">
        <Link to="/transactions/add">
          <button className="add-transaction-button">+ Transactie toevoegen</button>
        </Link>
      </div>
    </div>
    <div className="dashboard-container">
      <div className="amount-card-container">
        <AmountCard type="totaal" value={dashboardData?.summary.totalBalanceThisMonth} />
        <AmountCard type="inkomen" value={dashboardData?.summary.totalIncome} />
        <AmountCard type="uitgaven" value={dashboardData?.summary.totalExpenses} />
        <AmountCard type="sparen" value={dashboardData?.summary.totalSavings} />
      </div>
      {/* <div className="charts-container">
        <div className="graph-chart">
          <div className="graph-top">
            <h2 className="title">Inkomsten vs Uitgaven</h2>
            <div className="btn-container">
              <button className={amountOfMonths === 6 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(6)}>6 M</button>
              <button className={amountOfMonths === 12 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(12)}> 12 M </button>
            </div>
            
          </div>
          {amountOfMonths === 6 ? (<MonthlyBarChart data={dashboardData?.monthlyChart.slice(6) || []}/>) : (<MonthlyBarChart data={dashboardData?.monthlyChart || []} />)}
        </div>
        <div className="pie-chart">
          <div className="graph-top">
            {showCurrentMonth ? <h2 className="title">Uitgaven {currentMonth}</h2> : <h2 className="title">Uitgaven per categorie</h2>}
            <button className="month-btn active" onClick={() => setShowCurrentMonth(!showCurrentMonth)}>
              {showCurrentMonth ? "Toon alle uitgaven" : "Toon huidige maand"}
            </button>
          </div>
          <ExpensePieChart
              expenseData={ showCurrentMonth ? currentMonthExpenses : dashboardData?.expenseCategories || [] }
              categories={categories || []}
            />
        </div>
      </div> */}
      {/* DESKTOP CHARTS */}
      <div className="charts-container">
        <div className="graph-chart">
          <div className="graph-top">
            <h2 className="title">Inkomsten vs Uitgaven</h2>
            <div className="btn-container">
              <button className={amountOfMonths === 6 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(6)}> 6 M </button>
              <button className={amountOfMonths === 12 ? "month-btn active" : "month-btn"} onClick={() => setAmountOfMonths(12)}> 12 M </button>
            </div>
          </div>
          {amountOfMonths === 6 ? (<MonthlyBarChart data={dashboardData?.monthlyChart.slice(6) || []} />) : (<MonthlyBarChart data={dashboardData?.monthlyChart || []} />)}
        </div>
        <div className="pie-chart">
          <div className="graph-top">
            {showCurrentMonth ? ( <h2 className="title">Uitgaven {currentMonth}</h2>) : (<h2 className="title">Uitgaven per categorie</h2>)}
            <button className="month-btn active" onClick={() => setShowCurrentMonth(!showCurrentMonth)}>
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

              <button className="month-btn active" onClick={() => setShowCurrentMonth(!showCurrentMonth)}>
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
    </div>
    </>
  )
}

export default DashboardPage