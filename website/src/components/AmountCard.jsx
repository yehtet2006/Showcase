import '../styles/dashboardPage.css'

function AmountCard({ type, value, ...props }) {
  return (
    <div className={`amount-card ${type}-card`} {...props}>
      <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <p>
        {value?.toFixed(2) || '0.00'}
      </p>
    </div>
  )
}

export default AmountCard