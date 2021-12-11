import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { getAllUsers } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import openModal from '../shared/layout/OpenModal';
import Dropdown from './Dropdown';
import OptionsIcon from '../../../assets/icons/options-black.svg';
import { Paths } from '../shared/routes';

export default function Workers() {
  const users = useData(async () => getAllUsers());

  const button = (
    <button type="button" onClick={() => openModal(true, '#createUser')} className="bg-transparent hover:bg-gray-400 px-4 py-2 rounded text-black focus:outline-none">
      <AiOutlinePlus />
    </button>
  );

  const actions = [
    {
      text: 'Worker Info.',
      href: '/pageC/',
    },
    {
      text: 'Update Data',
      href: Paths.ProjectAssign,
    },
    {
      text: 'Assign Work',
      href: Paths.ProjectFinance,
    },
    {
      text: 'Generate Report',
      href: '/pageC/',
    },
    {
      text: 'Give Bonification',
      href: '/pageC/',
    },
    {
      text: 'Delete User',
      href: Paths.Annotation,
    },
  ];
  const dropDownActions = actions.map((action: any) => (
    <Link
      id={`${action.text}-btn`}
      onClick={(event) => event.stopPropagation()}
      type="button"
      to={`${action.href}`}
    >
      {action.text}

    </Link>
  ));

  const genHours = () => {
    const sel = (Math.floor(Math.random() * 6) + 1);
    if (sel === 1) return '1:24';
    if (sel === 2) return '1:52';
    if (sel === 3) return '0:32';
    if (sel === 4) return '3:54';
    if (sel === 5) return '6:11';
    return '2:37';
  };
  const genStyledLabel = (role: String) => {
    console.log(role);
    let style;
    if (role === 'annotator') {
      style = 'bg-lb-annotator text-lb-annotatortext hover:bg-lb-annotatortext hover:text-lb-annotator ';
    } else if (role === 'verifier') {
      style = 'bg-lb-verifier text-lb-verifiertext hover:bg-lb-verifiertext hover:text-lb-verifier';
    } else if (role === 'finance') {
      style = 'bg-lb-finance text-lb-financetext hover:bg-lb-financetext hover:text-lb-finance';
    } else {
      style = 'bg-lb-projectm text-lb-projectmtext hover:bg-lb-projectmtext hover:text-lb-projectm';
    }

    return (
      <span className="my-0.5 block w-auto font-bold rounded-full align-middle text-center py-1 px-2">
        <span className={`${style} w-auto px-2 py-1 rounded-full`}>{role}</span>
      </span>
    );
  };

  return (
    <>
      <Header title="Workers" button={button} />
      <div id="contentPage">
        <div className="flex flex-nowrap mb-2">
          <div className="w-full flex flex-col space-x-4 md:w-1/6 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="whitespace-nowrap block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Worker-role">
              Name
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <span className="my-0.5 block w-auto text-black font-bold py-1 px-2">
                    { worker.name }
                  </span>
                  {/* <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={`${worker.name}`} /> */}
                </div>
              ))}
            </label>
          </div>
          <div className="w-full flex flex-col space-x-4 md:w-1/6 mb-6 md:mb-0 mx-2 max-h-6">
            <label className=" whitespace-nowrap block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 align-middle text-center" htmlFor="grid-Worker-role">
              Hours Of Work
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <span className="my-0.5 block w-auto text-black font-bold py-1 px-2">
                    { genHours() }
                  </span>
                  {/* <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={worker} /> */}
                </div>
              ))}
            </label>
          </div>
          <div className="w-full flex flex-col space-x-4 md:w-1/6 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="whitespace-nowrap block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 align-middle text-center" htmlFor="grid-Worker-role">
              Type Of Worker
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  { genStyledLabel(worker.role) }
                  {/* <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={worker} /> */}
                </div>
              ))}
            </label>
          </div>
          <div className="w-full flex flex-col space-x-4 md:w-1/3 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="whitespace-nowrap block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 align-middle text-center" htmlFor="grid-Worker-role">
              Quick Actions
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <span className="my-0.5 block w-auto font-bold py-1 px-2">
                    <span className="normal-case bg-black text-gray-50 rounded-full py-1 px-2 hover:bg-gray-800 hover:text-gray-200">
                      WIP
                    </span>
                  </span>
                  {/* <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={worker} /> */}
                </div>
              ))}
            </label>
          </div>
          <div className="whitespace-nowrap w-full flex flex-col space-x-4 md:w-1/12 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Worker-role">
              Actions
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <Dropdown elements={dropDownActions} icon={<img src={OptionsIcon} alt="Options" />} />
                  {/* <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={worker} /> */}
                </div>
              ))}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
