import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CSVDownload, CSVLink } from 'react-csv';
// eslint-disable-next-line import/no-unresolved
import { BiDotsVertical } from 'react-icons/bi';
import { useRefetchableData } from '../../../data/hooks';
import { deleteReport, findReportById, getAllReports } from '../../../data/report';
import { Role } from '../../../data/types';
import Dropdown from '../projects/Dropdown';
import Header from '../shared/header';

export const refetchReport = () => {
  refetcher?.();
};

let refetcher = null as Function | null;
export default function ReportFinance() {
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Project', key: 'projectName' },
    { label: 'Hours Of Work', key: 'hours' },
    { label: 'Earnings', key: 'payment' },
    { label: 'Client', key: 'client' },
  ];
  const [reports, refetch] = useRefetchableData(async () => getAllReports());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rows, setRows] = useState< {user: string;
  name: string;
  email: string;
  role: Role;
  projectName: string;
  hours: number;
  payment: number;
  client: string;}[]>([]);

  useEffect(() => { refetcher = refetch; return () => { refetcher = null; }; });

  return (
    <div className="h-full w-full">
      <Header title="Reports" />
      <div className="inline-block w-full ml-8">
        <table className="w-11/12 leading-normal m-3">
          <thead>
            <tr>
              <th
                className="px-2 py-3 w-1/6 text-left text-xs font-semibold text-gray-500 "
              >
                Name
              </th>
              <th
                className="px-2 py-3 w-1/6 text-left text-xs font-semibold text-gray-500 "
              >
                Date
              </th>
              <th
                className="px-2 py-3 w-5/12 text-left text-xs font-semibold text-gray-500 "
              >
                Download
              </th>
              <th
                className="px-5 py-3 w-1/6  text-xs font-semibold text-gray-500 "
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows).length > 0 ? <CSVDownload data={rows} headers={headers} filename="report.csv" target="_blank" /> : null }
            {reports?.sort((a, b) => ((a.date < b.date) ? 1 : -1)).map((report) => (
              <tr className="border-b" key={report.reportID}>
                <td className="px-2 py-3 text-left text-xs font-semibold">
                  <p>{report?.reportID}</p>
                </td>
                <td className="px-2 py-3 text-left text-xs font-semibold">
                  <p>{new Date(report?.date).toLocaleDateString()}</p>
                </td>
                <td className="px-0 py-3 text-left text-xs font-semibold uppercase">
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={async () => {
                        const data = await findReportById(report.reportID);
                        setRows(data.reportRow);
                      }}
                    >
                      Download Report
                    </button>
                  </div>
                </td>
                <td className="">
                  <div className="flex pr-8 right-0">
                    <Dropdown
                      elements={[(
                        <button
                          type="button"
                          className="text-red-500 tag px-8"
                          onClick={async () => {
                            await deleteReport(report.reportID);
                            refetch();
                          }}
                        >
                          Delete
                        </button>)]}
                      icon={<BiDotsVertical className="ml-8 mt-1" />}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

// <CSVDownload data={data} target="_blank" />;
