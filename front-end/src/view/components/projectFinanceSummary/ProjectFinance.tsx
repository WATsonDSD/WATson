import React from 'react';
import { useParams } from 'react-router-dom';
import { BiTimeFive, BiPencil } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';
import { ChartConfiguration } from 'chart.js';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import GraphChart from './GraphChart';
import {
  calculateTotalCost, dataChartWorker, totalAnnotationMade, totalHoursOfWork, totalWorkers,
} from '../../../data/financier';

export default function ProjectFinance() {
  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));
  const totalCost = useData(async () => calculateTotalCost(idProject!));
  const totalHours = useData(async () => totalHoursOfWork(idProject!));
  const totalWork = useData(async () => totalWorkers(idProject!));
  const totalAnnotation = useData(async () => totalAnnotationMade(idProject!));
  const data = useData(async () => dataChartWorker(idProject!));

  if (!idProject || !data) return null;

  if (!project || !totalCost || !totalHours) return null;

  const exampleChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Label of the chart',
          borderColor: '#4A5568',
          data,
          fill: false,
          pointBackgroundColor: '#4A5568',
          borderWidth: 3,
          pointBorderWidth: 4,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 8,
          pointHoverBorderColor: 'rgb(74,85,104,0.2)',
        },
      ],
    },
  };

  return (
    <div className="h-full w-full">
      <Header title={`Project finance : ${project?.name ?? ''}`} />
      <div className="grid gap-6 mx-10 mt-8 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div
          className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-blue-50"
        >
          <div className="p-4 flex gap-4 flex-col">
            <div className="p-3 rounded-full mr-auto text-white bg-gray-300 mr-4">
              <GiMoneyStack />
            </div>
            <div className="text-left">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total cost of the project
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalCost[0]}

              </p>
            </div>
          </div>
        </div>
        <div
          className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-blue-50"
        >
          <div className="p-4 flex gap-4 flex-col">
            <div
              className="p-3 rounded-full text-white mr-auto bg-gray-300 mr-4"
            >
              <BiTimeFive />
            </div>
            <div className="text-left">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total hours of work
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                { totalHours[0] }
              </p>
            </div>
          </div>
        </div>
        <div
          className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-blue-50"
        >
          <div className="p-4 flex gap-4 flex-col">
            <div
              className="p-3 rounded-full mr-auto text-white bg-gray-300 mr-4"
            >
              <BiPencil />
            </div>
            <div className="text-left">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total annotations made
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                { totalAnnotation }
              </p>
            </div>
          </div>
        </div>
        <div
          className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-blue-50"
        >
          <div className="p-4 flex gap-4 flex-col">
            <div
              className="p-3 rounded-full mr-auto text-white bg-gray-300 mr-4"
            >
              <FiUsers />
            </div>
            <div className="text-left">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total workers involved
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                { totalWork }
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-10">
        <GraphChart chart={exampleChart} title="Spendings" />
      </div>
    </div>
  );
}
