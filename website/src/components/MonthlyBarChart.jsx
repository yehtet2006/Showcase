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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />
        <YAxis />

        <Tooltip />
        <Legend />

        <Bar dataKey="income" fill="#4CAF50" name="Inkomen" />
        <Bar dataKey="expense" fill="#F44336" name="Uitgaven" />
      </BarChart>
    </ResponsiveContainer>
  );
}
export default MonthlyBarChart