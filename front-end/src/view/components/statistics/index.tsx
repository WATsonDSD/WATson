import React from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import {
  AiOutlineTeam,
} from 'react-icons/ai';
import { ChartConfiguration } from 'chart.js';
import Header from '../shared/header';
import GraphChart from './GraphChart';

export default function Statistics() {
  const exampleChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Label of the chart',
          borderColor: '#4A5568',
          data: [],
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
      <Header title="Statistics :" />
      <div className="mx-10 flex flex-row">
        <div className="w-4/5">
          <GraphChart chart={exampleChart} title="Total Spendings" />
        </div>
        <div className="w-1/5 rounded-lg bg-blue-50">
          <div className="flex flex-col">
            <header className="mt-1 pt-1">
              Summary
            </header>
            <div className="flex flex-row">
              <div className="p-3 ml-5 rounded-full mr-auto text-white bg-gray-300 mr-4">
                <GiMoneyStack />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  72.583 €
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Total spendings
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-row">
              <div className="p-3 ml-5  rounded-full mr-auto text-white bg-gray-300 mr-4">
                <GiMoneyStack />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  5.891 €
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Avg cost p.p
                </p>
              </div>
            </div>
            {' '}
            <div className="mt-2 flex flex-row">
              <div className="p-3 ml-5 rounded-full mr-auto text-white bg-gray-300 mr-4">
                <BiTimeFive />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  1.583h
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Total hours of work
                </p>
              </div>
            </div>
            {' '}
            <div className="mt-2 flex flex-row">
              <div className="p-3 ml-5 rounded-full mr-auto text-white bg-gray-300 mr-4">
                <BiTimeFive />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  72h
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Avg work hours p.p
                </p>
              </div>
            </div>
            {' '}
            <div className="mt-2 flex flex-row">
              <div className="p-3 ml-5 rounded-full mr-auto text-white bg-gray-300 mr-4">
                <AiOutlineTeam />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  120
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Total workers
                </p>
              </div>
            </div>
            {' '}
            <div className="mt-2 mb-2 flex flex-row">
              <div className="p-3 ml-5 rounded-full mr-auto text-white bg-gray-300 mr-4">
                <AiOutlineTeam />
              </div>
              <div className="w-2/3">
                <p className="ml-2 text-base font-semibold text-gray-700">
                  20
                </p>
                <p className="ml-2 text-xs font-semibold text-gray-400">
                  Avg workers p.p
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                Total number of projects
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                0

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
                Active projects
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                0
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
            />
            <div className="text-left" />
          </div>
        </div>
        <div
          className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-blue-50"
        >
          <div className="p-4 flex gap-4 flex-col">
            <div
              className="p-3 rounded-full mr-auto text-white bg-gray-300 mr-4"
            />
            <div className="text-left" />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
