// Metricas.jsx

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Función para generar un número aleatorio entre min y max (reemplaza faker)
const generateRandomNumber = () => Math.floor(Math.random() * 1000) + 1;

// --- Opciones del Gráfico ---
export const options = {
  responsive: true,
  plugins: {
    legend: {
      // 2. Eliminamos 'as const'
      position: 'top', 
    },
    title: {
      display: true,
      text: 'Gráfico de Barras de Métricas', // Título ajustado
    },
  },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio']; // Etiquetas en español

// --- Datos del Gráfico ---
export const data = {
  labels,
  datasets: [
    {
      label: 'Métrica 1', // Etiqueta ajustada
      // Usamos la función de JS nativa para generar datos
      data: labels.map(() => generateRandomNumber()), 
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Métrica 2', // Etiqueta ajustada
      // Usamos la función de JS nativa para generar datos
      data: labels.map(() => generateRandomNumber()), 
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

// --- Componente ---
export default function Metricas() {
  return <Bar options={options} data={data} />;
}

// Nota: Debes exportar el componente para usarlo en App.js
// export default Metricas;