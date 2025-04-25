import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import Task from "@shared/Task";
import {User} from "@shared/User"; 

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface UserTaskBarChartProps {
  tasks: Task[];
  users: User[];
}

const UserTaskBarChart = ({ tasks, users }: UserTaskBarChartProps) => {
  const labels = users.map((user) => user.name);

  const getStatusCount = (userId: number, status: Task["status"]) =>
    tasks.filter((task) => task.taskUser === userId && task.status === status).length;

  const data = {
    labels,
    datasets: [
      {
        label: "Fechado",
        data: users.map((user) => getStatusCount(user.id, "Fechado")),
        backgroundColor: "#FF6384",
      },
      {
        label: "Em Andamento",
        data: users.map((user) => getStatusCount(user.id, "Em_andamento")),
        backgroundColor: "#FFCE56",
      },
      {
        label: "Concluído",
        data: users.map((user) => getStatusCount(user.id, "Concluido")),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default UserTaskBarChart;