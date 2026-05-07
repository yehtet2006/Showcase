import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";
import { Link, useNavigate } from "react-router";
import AmountCard from "../components/AmountCard";
import '../styles/dashboardPage.css'

function DashboardPage() {
  const {userId} = useAuth();
  const maand = new Date().toLocaleString('nl', { month: 'long' });
  const jaar = new Date().getFullYear();
  const navigate = useNavigate();
  const { data: currentUser, isLoading, isError } = useUser(userId);

  if(isLoading) return <div><h1>Welkom: Loading...</h1></div>;
  if(isError) return <div>Error loading user data</div>;

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
        <AmountCard type="total"/>
        <AmountCard type="income"/>
        <AmountCard type="expense"/>
        <AmountCard type="savings"/>
      </div>
      <div className="charts-container">
        <div className="graph-chart">Bars</div>
        <div className="pie-chart">Pie</div>
      </div>
    </div>
    <div className="recent-transactions-container">
      <h2>Recente Transacties</h2>
    </div>
    </>
  )
}

export default DashboardPage