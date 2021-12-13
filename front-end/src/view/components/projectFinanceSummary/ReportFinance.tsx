import React from 'react';
import { BiDotsVertical } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { CSVLink } from 'react-csv';
import Dropdown from '../projects/Dropdown';
import Header from '../shared/layout/Header';
import generateReport from '../../../data/financier';
import useData from '../../../data/hooks';

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
  const data = useData(async () => generateReport());
  console.log(data);
  const headers = [
    { label: 'Name', key: 'username' },
    { label: 'Project', key: 'project' },
    { label: 'Client', key: 'client' },
    { label: 'Role', key: 'role' },
    { label: 'images', key: 'images' },
    { label: 'hoursOfWork', key: 'hours' },
  ];
  const button = (
    <button type="button" className="bg-transparent hover:bg-gray-400 px-4 py-2 rounded text-black focus:outline-none">
      <AiOutlinePlus />
    </button>
  );
  return (
    <div className="h-full w-full">
      <Header title="Reports" buttonF={button} />
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
                    <button type="button" className="bg-gray-900 text-white rounded-full px-6 ">
                      Download
                      <CSVLink
                        data={data}
                        headers={headers}
                      >
                        Generate report
                      </CSVLink>
                    </button>
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
