import React from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import openModal from '../shared/layout/OpenModal';
// import Dropdown from './Dropdown';
// import OptionsIcon from '../../../assets/icons/options-black.svg';

export default function Workers() {
  const users = useData(async () => getAllUsers());

  const actions = [
    {
      text: 'Update Data',
      onClick: () => openModal(true, '#edit'),
      href: '',
    },
    {
      text: 'Assign Work',
      // href: '/Assign/',
      href: '/Workers/',
    },
    {
      text: 'Give Bonification',
      // href: '/Bonification/',
      href: '/Workers/',
    },
    {
      text: 'Delete User',
      onClick: () => openModal(true, '#delete'),
      href: '',
    },
  ];

  const dropDownActions = actions.map((action: any) => {
    if (action.href === '') {
      return (
        <button
          id={`${action.text}-btn`}
          type="button"
          onClick={action.onClick}
        >
          {action.text}
        </button>
      );
    }
    return (
      <Link
        id={`${action.text}-btn`}
        type="button"
        onClick={(event) => event.stopPropagation()}
        to={`${action.href}`}
      >
        {action.text}
      </Link>
    );
  });
  console.log(dropDownActions);

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
      <Header title="Workers" />
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
                </div>
              ))}
            </label>
          </div>
          <div className="w-full flex flex-col space-x-4 md:w-1/3 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="whitespace-nowrap block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 align-middle text-center" htmlFor="grid-Worker-role">
              Actions
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <span className="my-0.5 block w-auto font-bold px-2">
                    {worker.role === 'projectManager'
                      ? (
                        <span className="normal-case block h-6 bg-transparent text-gray-50 rounded-full py-1 px-2"> </span>
                      )
                      : (
                        <Link
                          className="normal-case bg-black text-gray-50 rounded-full py-1 px-2 hover:bg-gray-800 hover:text-gray-200"
                          id="Bonification-btn"
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          to="/Bonification/"
                        >
                          Asign Bonification
                        </Link>
                      )}
                  </span>
                </div>
              ))}
            </label>
          </div>
          {/* 
          <div className="whitespace-nowrap w-full flex flex-col space-x-4 md:w-1/12 mb-6 md:mb-0 mx-2 max-h-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Worker-role">
              Actions
              {users?.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <Dropdown elements={dropDownActions} icon={<img src={OptionsIcon} alt="Options" />} />
                </div>
              ))}
            </label>
          </div> 
          */}
        </div>
      </div>
    </>
  );
}
