import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiTimeFive, BiPencil } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';
import { ChartConfiguration } from 'chart.js';
import {
  calculatePercentageWorkerProgressForProject,
  findProjectById, getUsersOfProject, User,
} from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/header';
import GraphChart from './GraphChart';
import {
  calculateTotalCost, dataChartProjects, earningsInTotalPerProjectPerUser, hoursWorkPerProjectPerUser, totalAnnotationMade, totalHoursOfWork, totalWorkers,
} from '../../../data/financier';

export default function ProjectFinance() {
  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));
  const totalCost = useData(async () => calculateTotalCost(idProject!));
  const totalHours = useData(async () => totalHoursOfWork(idProject!));
  const totalWork = useData(async () => totalWorkers(idProject!));
  const totalAnnotation = useData(async () => totalAnnotationMade(idProject!));
  const data = useData(async () => dataChartProjects(idProject!));
  const [users, setProjectUsers] = useState([] as User[]);
  const [usersData, setUsersData] = useState([] as { id: string, hours: number, earnings: number, progress: number}[]);

  useEffect(() => {
    getUsersOfProject(idProject || '').then((result) => {
      setProjectUsers(result);
      result.filter((user) => user.role !== 'projectManager' && user.role !== 'finance').forEach((user) => {
        let hoursWork: number;
        let earnings: number;
        let progress: number;
        hoursWorkPerProjectPerUser(user.id, idProject ?? '').then(((result) => {
          hoursWork = result;
          earningsInTotalPerProjectPerUser(user.id, idProject ?? '').then((result) => {
            earnings = result;
            calculatePercentageWorkerProgressForProject(user.id, idProject ?? '').then((result) => {
              progress = result;
              setUsersData((state) => [...state, {
                id: user.id, hours: hoursWork, earnings, progress,
              }]);
            });
          });
        }));
      });
    });
  }, []);

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
                { totalHours[0].toFixed(2) }
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
      <div className="mx-10">
        <GraphChart chart={exampleChart} title="Spendings" />
      </div>
      <br />
      <br />
      <div className="mx-10">
        <section className="bg-white rounded-lg">
          <div className="grid grid-cols-9 gap-x-4 pb-3 text-sm text-gray-500 font-medium">
            <span className="col-span-2">Name</span>
            <span>Role</span>
            <span>Annotated images</span>
            <span>Verified images</span>
            <span>Hours of work</span>
            <span>Progress</span>
            <span>Earnings</span>
          </div>

          {users && users.length > 0
            ? users.filter((user) => user.role !== 'projectManager' && user.role !== 'finance').map((user) => {
              const hoursWork = usersData?.find((u) => u.id === user.id)?.hours.toFixed(2);
              const earnings = usersData?.find((u) => u.id === user.id)?.earnings.toFixed(2);
              const progress = usersData?.find((u) => u.id === user.id)?.progress.toFixed(2);
              return (
                <div key={user.id} className="grid grid-cols-9 items-center gap-x-4 py-4 text-gray-800 border-t">
                  <div className="flex items-center gap-x-4 col-span-2">
                    <span className="block w-10 h-10 bg-gray-100 rounded-full" />
                    <span>{user.name}</span>
                  </div>
                  <div>
                    <span className={`uppercase tracking-wide ${user.role === 'annotator' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'} px-4 py-2 -ml-4 text-xs font-bold rounded-full`}>{user.role}</span>
                  </div>
                  {/* todo change to real values  */}
                  <span>{user.projects[idProject].annotated.length}</span>
                  <span>{user.projects[idProject].verified.length}</span>
                  <span>{hoursWork}</span>
                  <span>
                    {progress}
                    {' '}
                    %
                  </span>
                  <span>{earnings}</span>
                </div>
              );
            })
            : (
              <div className="flex items-center justify-center py-4 text-gray-400">There are no workers registered to the application.</div>
            )}
        </section>
      </div>
    </div>
  );
}
