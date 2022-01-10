import { Chart, ChartConfiguration, registerables } from 'chart.js';
import React, { useEffect } from 'react';

export default function GraphChart(props : { chart: ChartConfiguration, title: string}) {
  Chart.register(...registerables);
  const { title } = props;

  const { chart } = props;
  useEffect(() => {
    const ctx = 'myChart';

    const myChart = new Chart(ctx, chart);
    return () => {
      myChart.destroy();
    };
  }, []); // use effect runs on Mount only

  return (
    <div>
      <div className="flex items-center justify-center py-8">
        <div className="w-3/4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="lg:flex w-full justify-between">
                <h3 className="text-gray-600 dark:text-gray-400 leading-5 text-base md:text-xl font-bold">
                  {' '}
                  {title}
                </h3>
                <div className="flex items-center justify-between lg:justify-start mt-2 md:mt-4 lg:mt-0">
                  <div className="lg:ml-14" />
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
