import Task from "@shared/Task";
import { User } from "@shared/User";
import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface UserTaskBarChartProps {
    tasks: Task[];
    users: User[];
    projectCreator: User;
}

// Function to get colors based on task status
const getColorByStatus = (status: string) => {
    switch (status) {
        case "Fechado":
            return "#EF4444"; // bg-red-500
        case "Em_andamento":
            return "#3B82F6"; // bg-blue-500
        case "Concluido":
            return "#10B981"; // bg-green-500
        default:
            return "#D1D5DB"; // bg-gray-300 (fallback color)
    }
};

const UserTaskBarChart = ({ tasks, users, projectCreator }: UserTaskBarChartProps) => {
    // Combine users and projectCreator into a single array
    const allUsers = [...users, projectCreator];

    const labels = allUsers.map((user) => user.name);

    const getStatusCount = (userId: number, status: Task["status"]) => tasks.filter((task) => task.taskUser === userId && task.status === status).length;

    const data = {
        labels,
        datasets: [
            {
                label: "Fechado",
                data: allUsers.map((user) => getStatusCount(user.id, "Fechado")),
                backgroundColor: getColorByStatus("Fechado"),
            },
            {
                label: "Em Andamento",
                data: allUsers.map((user) => getStatusCount(user.id, "Em_andamento")),
                backgroundColor: getColorByStatus("Em_andamento"),
            },
            {
                label: "Concluído",
                data: allUsers.map((user) => getStatusCount(user.id, "Concluido")),
                backgroundColor: getColorByStatus("Concluido"),
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        indexAxis: "y", // Torna as barras horizontais
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                stacked: true,
                ticks: {
                    stepSize: 1, // Define as marcas de 1 em 1 no eixo x
                },
            },
            y: {
                stacked: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default UserTaskBarChart;
