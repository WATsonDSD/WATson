import React from 'react';
import { useParams } from 'react-router-dom';
import { BiDotsVerticalRounded, BiTimeFive, BiPencil } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';
import { ChartConfiguration } from 'chart.js';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import Dropdown from '../dashboard/Dropdown';
import Header from '../shared/layout/Header';
import GraphChart from './GraphChart';

export default function ProjectFinance() {
  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));
  const dropDownActions = [(
    <button type="button"> Generate a Report </button>
  )];

  const exampleChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Label of the chart',
          borderColor: '#4A5568',
          data: [600, 400, 620, 300, 200, 600, 230, 300, 200, 200, 100, 1200],
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

  const generateReportButton = (
    <Dropdown
      elements={dropDownActions}
      icon={<BiDotsVerticalRounded className="w-7 h-7" />}
    />
  );

  return (
    <div className="h-full w-full">
      <Header title={`Project finance : ${project?.name ?? ''}`} button={generateReportButton} />
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
                $ 6,760

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
                234h
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
                456
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
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">15</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-10">
        <GraphChart chart={exampleChart} />
      </div>
    </div>
  );
}
