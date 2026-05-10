import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";
import { Link, useNavigate } from "react-router";
import AmountCard from "../components/AmountCard";
import MonthlyBarChart from "../components/MonthlyBarChart";
import ExpensePieChart from "../components/ExpenseChart";
import '../styles/dashboardPage.css'
import { useDashboardData } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";

function DashboardPage() {
  const {userId} = useAuth();
  const maand = new Date().toLocaleString('nl', { month: 'long' });
  const jaar = new Date().getFullYear();
  const navigate = useNavigate();
  const { data: currentUser, isLoading, isError } = useUser(userId);
  const { data: dashboardData, isLoading: isDashboardDataLoading, isError: isDashboardDataError } = useDashboardData();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();
  if(isLoading) return <div><h1>Welkom: Loading...</h1></div>;
  if(isError) return <div>Error loading user data</div>;
  if(isDashboardDataError) return <div>Error loading dashboard data</div>;
  if (isDashboardDataLoading) {return <div>Loading dashboard...</div>;}
  if (isCategoriesLoading) {return <div>Loading categories...</div>;}
  if (isCategoriesError) {return <div>Error loading categories...</div>;}
  return (
    <>
    <div className="top-container">
      <div className="text-container">
        <h1>Welkom, {currentUser.name}!</h1>
        <p>Dit is uw persoonlijke financiële dashboard voor <span>{maand.charAt(0).toUpperCase() + maand.slice(1)} {jaar}</span></p>
      </div>
      <div className="last-three-months-container">
        <button className="month-button">feb</button>
        <button className="month-button">mar</button>
        <button className="month-button">april</button>
      </div>
      <div className="add-transaction">
        <Link to="/transactions/add">
          <button className="add-transaction-button">+ Transactie toevoegen</button>
        </Link>
      </div>
    </div>
    <div className="dashboard-container">
      <div className="amount-card-container">
        <AmountCard type="total" value={dashboardData?.summary.totalBalanceThisMonth} />
        <AmountCard type="income" value={dashboardData?.summary.totalIncome} />
        <AmountCard type="expense" value={dashboardData?.summary.totalExpenses} />
        <AmountCard type="savings" value={dashboardData?.summary.totalSavings} />
      </div>
      <div className="charts-container">
        <div className="graph-chart">
          <h2>Inkomsten vs Uitgaven</h2>

          <MonthlyBarChart
            data={dashboardData?.monthlyChart || []}
          />
        </div>

        <div className="pie-chart">
          <h2>Uitgaven per categorie</h2>

          <ExpensePieChart
            expenseData={dashboardData?.expenseCategories || []}
            categories={categories || []}
          />
        </div>
      </div>
    </div>
    <div className="recent-transactions-container">
      <h2>Recente Transacties</h2>
    </div>
    </>
  )
}

export default DashboardPage