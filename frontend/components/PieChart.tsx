// Executar o seguinte comando no frontend:
// npm install react-chartjs-2 chart.js

import Task from "@shared/Task";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    tasks: Task[];
}

const PieChart = ({ tasks }: PieChartProps) => {
    const taskCounts = {
        closed: tasks.filter((task) => task.status === "Fechado").length,
        inProgress: tasks.filter((task) => task.status === "Em_andamento").length,
        completed: tasks.filter((task) => task.status === "Concluido").length,
    };

    const data = {
        labels: ["Fechado", "Em Andamento", "Concluído"],
        datasets: [
            {
                data: [taskCounts.closed, taskCounts.inProgress, taskCounts.completed],
                backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
                hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;
