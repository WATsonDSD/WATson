import { Chart, ChartConfiguration, registerables } from 'chart.js';
import React, { useEffect } from 'react';

export default function GraphChart(props : { chart: ChartConfiguration}) {
  Chart.register(...registerables);

  const { chart } = props;
  useEffect(() => {
    // const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = 'myChart';

    const myChart = new Chart(ctx, chart);
    return () => {
      myChart.destroy();
    };
  });

  return (
    <div>
      <div className="flex items-center justify-center py-8 px-4">
        <div className="w-3/4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="lg:flex w-full justify-between">
                <h3 className="text-gray-600 dark:text-gray-400 leading-5 text-base md:text-xl font-bold">Spendings</h3>
                <div className="flex items-center justify-between lg:justify-start mt-2 md:mt-4 lg:mt-0">
                  <div className="lg:ml-14">
                    <div className="bg-gray-100 dark:bg-gray-700 ease-in duration-150 hover:bg-gray-200 pb-2 pt-1 px-3 rounded-sm">
                      <select className="text-xs text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none">
                        <option className="leading-1">Year</option>
                        <option className="leading-1">{new Date().getFullYear()}</option>
                        <option className="leading-1">{new Date().getFullYear() - 1}</option>
                        <option className="leading-1">{new Date().getFullYear() - 2}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <canvas id="myChart" width={1025} height={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
