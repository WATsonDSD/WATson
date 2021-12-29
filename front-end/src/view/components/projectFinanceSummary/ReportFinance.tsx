import React, { useState } from 'react';
import { CSVDownload } from 'react-csv';
// eslint-disable-next-line import/no-unresolved
import { BiDotsVertical } from 'react-icons/bi';
import generateReport from '../../../data/financier';
import Dropdown from '../projects/Dropdown';
import Header from '../shared/header';

const dropDownActions: any = [(
  <button type="button" className="text-white">
    Rename
  </button>),
  <div className="border-b" />,
  (
    <button type="button" className="text-red-500">
      Delete
    </button>),
];

export default function ReportFinance() {
  const headers = [
    { label: 'Name', key: 'username' },
    { label: 'Project', key: 'project' },
    { label: 'Client', key: 'client' },
    { label: 'Role', key: 'role' },
    { label: 'images', key: 'images' },
    { label: 'hoursOfWork', key: 'hours' },
  ];
  // let data: Report;
  const [rows, setRows] = useState<any[]>([]);
  // const getRows = () => rows;
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
                Month
              </th>
              <th
                className="px-2 py-3 w-1/6 text-left text-xs font-semibold text-gray-500 "
              >
                Year
              </th>
              <th
                className="px-2 py-3 w-5/12 text-left text-xs font-semibold text-gray-500 "
              >
                Source
              </th>
              <th
                className="px-5 py-3 w-1/6 right-0 text-right text-xs font-semibold text-gray-500 "
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-2 py-3 text-left text-xs font-semibold">
                <p>Test Name</p>
              </td>
              <td className="px-2 py-3 text-left text-xs font-semibold">
                <p>Test Month</p>
              </td>
              <td className="px-2 py-3 text-left text-xs font-semibold">
                <p>Test</p>
              </td>
              <td className="px-0 py-3 text-left text-xs font-semibold uppercase">
                {/* <span
                  className="relative inline-block px-3 py-1 text-purple-900"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-purple-400 opacity-50 rounded-full"
                  />
                  <p>Manually generated</p>
                </span> */}
                <span
                  className="relative inline-block px-3 py-1 text-green-800"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                  />
                  <p>Automatically generated</p>
                </span>
              </td>
              <td className="">
                <div className="flex pr-8">
                  <div className="py-1">
                    {/* <button
                      className="col-start-1 col-span-1 h-6v"
                      type="button"
                      onClick={() => generateReport()}
                    >
                      generate
                    </button> */}
                    {/* <CSVLink
                      data={getRows}
                      asyncOnClick
                      headers={headers}
                      onClick={(event, done) => {
                        generateReport().then((data: Report) => {
                          rows = data.reportRow;
                          console.log(data);
                          done(); // REQUIRED to invoke the logic of component
                        });
                      }}
                    >
                      WORK PLS
                    </CSVLink> */}

                    <button
                      type="button"
                      onClick={() => generateReport().then((data) => {
                        setRows(data.reportRow);
                        console.log(data.reportRow);
                      })}
                    >
                      Generate Report

                    </button>
                    {Object.entries(rows).length > 0 ? <CSVDownload data={rows} headers={headers} target="_blank" /> : null }
                    {/* <CSVLink
                      // asyncOnClick
                      onClick={async () => {
                        // events.preventDefault();
                        console.log('LaURA');
                        data = await generateReport();
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        rows = data.reportRow;
                        // done(true);
                        console.log(data.reportRow);
                        console.log('EFFLAM');
                        // events.initMouseEvent();
                      }}
                      data={rows}
                      filename="my-file.csv"
                      className="bg-gray-900 text-white rounded-full px-6 "
                      target="_blank"
                      headers={headers}
                    >
                      Download
                    </CSVLink> */}
                  </div>
                  <Dropdown elements={dropDownActions} icon={<BiDotsVertical className="ml-8 mt-1" />} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  );
}

// <CSVDownload data={data} target="_blank" />;
