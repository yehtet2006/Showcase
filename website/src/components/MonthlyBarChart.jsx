import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MonthlyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}

        <XAxis dataKey="month" />
        <YAxis/>

        <Tooltip  />
        <Legend />

        <Bar dataKey="income" fill="#2196F3" name="Inkomen" />
        <Bar dataKey="expense" fill="#F44336" name="Uitgaven" />
        <Bar dataKey="savings" fill="#4CAF50" name="Sparen" />
      </BarChart>
    </ResponsiveContainer>
  );
}
export default MonthlyBarChart