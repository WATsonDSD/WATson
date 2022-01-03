import React from 'react';

import {
  AiOutlineRise, AiOutlineTeam, AiOutlineRedo,
} from 'react-icons/ai';
import {
  MdOutlineSwitchAccount,

} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { Project, useUserNotNull } from '../../../data';

import { Paths } from '../shared/routes';

import OptionsIcon from '../../../assets/icons/options.svg';

import Dropdown from './Dropdown';
import useData from '../../../data/hooks';
import { calculateTotalCost, percentageOfImagesDone, totalWorkers } from '../../../data/financier';

const Card = (props: any) => {
  const { project, options, verifierAction }: { project: Project, options: any, verifierAction: string | undefined} = props;
  const [user] = useUserNotNull();
  const navigate = useNavigate();
  const totalSpending = useData(async () => calculateTotalCost(project.id));
  const percentage = useData(async () => percentageOfImagesDone(project.id));
  const numberOfWorkers = useData(async () => totalWorkers(project.id));
  if (!totalSpending || percentage === null) return null;

  const cardClickHandler = () => {
    switch (user!.role) {
      case 'projectManager':
        navigate(`${Paths.ProjectFinance}/${project.id}`);
        break;
      case 'annotator':
        navigate(`${Paths.Annotation}/${project.id}`);
        break;
      case 'verifier':
        if (verifierAction === 'annotate') {
          navigate(`${Paths.Annotation}/${project.id}`);
        } else if (verifierAction === 'verify') {
          navigate(`${Paths.Verification}/${project.id}`);
        }
        break;
      case 'finance':
        navigate(`${Paths.ProjectFinance}/${project.id}`);
        break;
      default:
        break;
    }
  };

  let cardStats;

  if (user.role === 'projectManager') {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2">
        <span className="flex items-center gap-x-1 text-white text-left">
          <AiOutlineRedo />
          {Math.floor(percentage * 100)}
          %
        </span>
        <span className="flex items-center gap-x-1 text-white">
          <AiOutlineRise />
          { totalSpending[0] }
        </span>
        <span className="flex items-center gap-x-1 text-white">
          <AiOutlineTeam />
          {numberOfWorkers}
        </span>
      </div>
    );
  } else if (user.role === 'annotator') {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2">
        <span className="flex items-center gap-x-1 text-white text-left">
          <MdOutlineSwitchAccount />
          {user.projects[project.id].assignedAnnotations.length}
        </span>
      </div>
    );
  } else if (user.role === 'verifier') {
    if (verifierAction === 'annotate') {
      cardStats = (
        <div className="flex justify-between text-lg w-full mt-2">
          <span className="flex items-center gap-x-1 text-white text-left">
            <MdOutlineSwitchAccount />
            {user.projects[project.id].assignedAnnotations.length}
          </span>
        </div>
      );
    } else {
      cardStats = (
        <div className="flex justify-between text-lg w-full mt-2">
          <span className="flex items-center gap-x-1 text-white text-left">
            <MdOutlineSwitchAccount />
            {user.projects[project.id].assignedVerifications.length}
          </span>
        </div>
      );
    }
  } else {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2">
        <span className="flex items-center gap-x-1 text-white text-left">
          <AiOutlineRedo />
          {Math.floor(percentage * 100)}
          %
        </span>
        <span className="flex items-center gap-x-1 text-white">
          <AiOutlineRise />
          { totalSpending[0] }
        </span>
        <span className="flex items-center gap-x-1 text-white">
          <AiOutlineTeam />
          {numberOfWorkers}
        </span>
      </div>
    );
  }

  const dropDownOptions = options.map((option: {name: string, to?: string, action?: Function}) => (
    option.to
      ? (
        <Link
          id={`${option.name}-btn`}
          className="block pl-6 pr-12 py-2 whitespace-nowrap"
          type="button"
          to={`${option.to}/${project.id}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {option.name}
        </Link>
      )
      : (
        <button
          id={`${option.name}-btn`}
          className="pl-6 pr-12 py-2 whitespace-nowrap"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            option.action!(project.id);
          }}
        >
          {option.name}
        </button>
      )
  ));

  return (
    <div className="flex flex-col bg-gray-800 hover:bg-black cursor-pointer aspect-w-4 aspect-h-3 rounded-md" role="link" tabIndex={0} onClick={cardClickHandler} onKeyDown={() => { console.log('open project'); }}>
      <div className="w-full flex flex-col justify-between px-8 py-6">
        <div className="flex">
          <div className="flex-grow">
            <span className="uppercase text-sm text-gray-400 font-medium">{project.client}</span>
            <h2 className="capitalize text-xl text-white font-normal">{project.name}</h2>
          </div>
          <Dropdown elements={dropDownOptions} icon={<img src={OptionsIcon} alt="Options" />} />
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <span className="block w-2 h-2 bg-green-500 rounded-full" />
            <span className="capitalize text-sm text-white font-normal">{project.status}</span>
          </div>
          <div className="border-b border-gray-600" />
          {cardStats }
        </div>
      </div>
    </div>
  );
};

export default Card;
