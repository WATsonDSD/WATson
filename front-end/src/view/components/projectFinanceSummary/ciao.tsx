/* eslint-disable @typescript-eslint/no-unused-vars */
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
  earningsPerUser,
} from '../../../data/financier';

export default function WorkerFinance() {
  const { idUser } = useParams();
  const payment = useData(async () => earningsPerUser(idUser!));

  const exampleChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Label of the chart',
          borderColor: '#4A5568',
          data: [600, 400, 620, 300, 200, 600, 230, 300, 200, 200, 100, 1200], // funzione che ritorna 12 valori 
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
      <Header title="USER NAME" />
      <div className="grid grid-rows-3 grid-flow-col gap-4">
        <div className="row-span-3 ...">
          <div className="w-full mx-10">
            <GraphChart chart={exampleChart} title="Earnings" />
          </div>
        </div>
        <div className="col-span-2 ...">
          <div className="grid gap-6 mx-10 mt-8 mb-8">
            <div
              className="min-w-8 rounded-lg shadow-xs overflow-hidden bg-blue-300"
            >
              <div className="p-4 flex gap-4 flex-col">
                <div className="p-3 rounded-full mr-auto text-white bg-gray-300 mr-4">
                  <GiMoneyStack />
                </div>
                <div className="text-left">
                  <p className="mb-2 text-sm font-medium text-gray-50 dark:text-transparent">
                    Total earnings
                  </p>
                  <p className="text-lg font-semibold text-gray-50 dark:text-gray-50">
                    {payment}

                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-3 col-span-1 ..." />
      </div>
    </div>
  );
}
