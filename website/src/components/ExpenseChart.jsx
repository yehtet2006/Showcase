import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";

function ExpensePieChart({ expenseData, categories }) {

  // Merge category colors into expense data
  const chartData = expenseData.map((expense) => {
    const matchingCategory = categories.find(
      (cat) => cat.name === expense.category
    );

    return {
      ...expense,
      color: matchingCategory?.color || "#8884d8",
    };
  });

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          label={(entry) => `${entry.category}: ${entry.amount}`}

        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ExpensePieChart;