// Executar o seguinte comando no frontend:
// npm install react-chartjs-2 chart.js

import Task from "@shared/Task";
import {
  ArcElement,
Chart as ChartJS,
  Legend,
  Tooltip,
  ChartOptions,
  ChartData,
  Plugin
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  tasks: Task[];
}

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width } = chart;
    const { height } = chart;
    const ctx = chart.ctx;
    ctx.restore();
    const fontSize = (height / 150).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = 'middle';

    const text = chart.config.data.datasets[0].data.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0).toString();
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

const PieChart = ({ tasks }: PieChartProps) => {
  const taskCounts = {
    closed: tasks.filter((task) => task.status === "Fechado").length,
    inProgress: tasks.filter((task) => task.status === "Em_andamento").length,
    completed: tasks.filter((task) => task.status === "Concluido").length,
  };

  const data: ChartData<'doughnut'> = {
    labels: ["Fechado", "Em Andamento", "Concluído"],
    datasets: [
      {
        data: [taskCounts.closed, taskCounts.inProgress, taskCounts.completed],
        backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    cutout: '80%', 
    radius: '70%',
  };

  return <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />;
};

export default PieChart;
