import Task from "@shared/Task";
import { User } from "@shared/User";
import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface UserTaskBarChartProps {
    tasks: Task[];
    users: User[];
}

const UserTaskBarChart = ({ tasks, users }: UserTaskBarChartProps) => {
    console.log("Tasks:", tasks);
    console.log("Users:", users);

    const labels = users.map((user) => user.name);

    const getStatusCount = (userId: number, status: Task["status"]) => tasks.filter((task) => task.taskUser === userId && task.status === status).length;

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

    console.log("Labels:", labels);
    console.log("Datasets:", data.datasets);

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
