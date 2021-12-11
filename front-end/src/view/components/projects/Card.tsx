import React from 'react';

import {
  AiOutlineRise, AiOutlineTeam, AiOutlineRedo,
} from 'react-icons/ai';

import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../../../data';

import { Paths } from '../shared/routes';

import OptionsIcon from '../../../assets/icons/options.svg';

import Dropdown from './Dropdown';

const Card = (props: any) => {
  const { project, actions } = props;
  const [user] = useUserData();
  const navigate = useNavigate();

  const cardClickHandler = () => {
    switch (user!.role) {
      case 'projectManager':
        navigate(`${Paths.ProjectAssign}/${project.id}`);
        break;
      case 'annotator':
        navigate(`${Paths.Annotation}/${project.id}`);
        break;
      case 'verifier':
        navigate(`${Paths.Verification}/${project.id}`);
        break;
      case 'finance':
        navigate(`${Paths.ProjectFinance}/${project.id}`);
        break;
      default:
        break;
    }
  };

  const dropDownActions = actions.map((action: any) => (
    <Link
      id={`${action.text}-btn`}
      onClick={(event) => {
        event.stopPropagation();
      }}
      type="button"
      to={`${action.href}/${project.id}`}
      className="pl-6 pr-12 py-2"
    >
      {action.text}
    </Link>
  ));

  return (
    <div className="flex flex-col bg-gray-800 hover:bg-black cursor-pointer aspect-w-4 aspect-h-3 rounded-md" role="link" tabIndex={0} onClick={cardClickHandler} onKeyDown={() => { console.log('open project'); }}>
      <div className="w-full flex flex-col justify-between px-8 py-6">
        <div className="flex">
          <div className="flex-grow">
            <span className="uppercase text-sm text-gray-400 font-medium">{project.client}</span>
            <h2 className="capitalize text-xl text-white font-normal">{project.name}</h2>
          </div>
          <Dropdown elements={dropDownActions} icon={<img src={OptionsIcon} alt="Options" />} />
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <span className="block w-2 h-2 bg-green-500 rounded-full" />
            <span className="capitalize text-sm text-white font-normal">{project.status}</span>
          </div>
          <div className="border-b border-gray-600" />
          <div className="flex justify-between text-lg w-full mt-2">
            <span className="flex items-center gap-x-1 text-white text-left">
              <AiOutlineRedo />
              60%
            </span>
            <span className="flex items-center gap-x-1 text-white">
              <AiOutlineRise />
              €
            </span>
            <span className="flex items-center gap-x-1 text-white">
              <AiOutlineTeam />
              {project.users.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
