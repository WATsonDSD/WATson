import React from 'react';

import {
  AiOutlineRise, AiOutlineTeam, AiOutlineRedo,
} from 'react-icons/ai';
import {
  MdOutlineSwitchAccount,

} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { closeProject, Project, useUserNotNull } from '../../../data';

import { Paths } from '../shared/routes/paths';

import OptionsIcon from '../../../assets/icons/options-black.svg';

import Dropdown from './Dropdown';
import useData from '../../../data/hooks';
import { calculateTotalCost, percentageOfImagesDone, totalWorkers } from '../../../data/financier';
import { load } from '../../LoadingOverlay';

const Card = (props: any) => {
  const { project, options, verifierAction }: { project: Project, options: any, verifierAction: string | undefined} = props;
  const [user] = useUserNotNull();
  const navigate = useNavigate();
  const totalSpending = useData(async () => calculateTotalCost(project._id));
  const percentage = useData(async () => percentageOfImagesDone(project._id));
  const numberOfWorkers = useData(async () => totalWorkers(project._id));
  if (!totalSpending || percentage === null) return null;

  const cardClickHandler = () => {
    if (project.status !== 'active') { if (user.role === 'projectManager') load(() => closeProject(project._id)); return; }
    switch (user!.role) {
      case 'projectManager':
        navigate(`${Paths.ProjectFinance}/${project._id}`);
        break;
      case 'annotator':
        navigate(`${Paths.Annotation}/${project._id}`);
        break;
      case 'verifier':
        if (verifierAction === 'annotate') {
          navigate(`${Paths.Annotation}/${project._id}`);
        } else if (verifierAction === 'verify') {
          navigate(`${Paths.Verification}/${project._id}`);
        }
        break;
      case 'finance':
        navigate(`${Paths.ProjectFinance}/${project._id}`);
        break;
      default:
        break;
    }
  };

  let cardStats;

  if (user.role === 'projectManager') {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2 font-medium">
        <span className="flex items-center gap-x-1 text-left">
          <AiOutlineRedo />
          {Math.floor(percentage * 100)}
          %
        </span>
        <span className="flex items-center gap-x-1">
          <AiOutlineRise />
          { totalSpending[0] }
        </span>
        <span className="flex items-center gap-x-1">
          <AiOutlineTeam />
          {numberOfWorkers}
        </span>
      </div>
    );
  } else if (user.role === 'annotator') {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2 font-medium">
        <span className="flex items-center gap-x-1 text-left">
          <MdOutlineSwitchAccount />
          {user.projects[project._id].toAnnotate.length}
        </span>
      </div>
    );
  } else if (user.role === 'verifier') {
    if (verifierAction === 'annotate') {
      cardStats = (
        <div className="flex justify-between text-lg w-full mt-2 font-medium">
          <span className="flex items-center gap-x-1 text-left">
            <MdOutlineSwitchAccount />
            {user.projects[project._id].toAnnotate.length}
          </span>
        </div>
      );
    } else {
      cardStats = (
        <div className="flex justify-between text-lg w-full mt-2 font-medium">
          <span className="flex items-center gap-x-1 text-left">
            <MdOutlineSwitchAccount />
            {user.projects[project._id].toVerify.length}
          </span>
        </div>
      );
    }
  } else {
    cardStats = (
      <div className="flex justify-between text-lg w-full mt-2 font-medium">
        <span className="flex items-center gap-x-1 text-left">
          <AiOutlineRedo />
          {Math.floor(percentage * 100)}
          %
        </span>
        <span className="flex items-center gap-x-1">
          <AiOutlineRise />
          { totalSpending[0] }
        </span>
        <span className="flex items-center gap-x-1">
          <AiOutlineTeam />
          {numberOfWorkers}
        </span>
      </div>
    );
  }

  const dropDownOptions = options.map((option: {name: string, to?: string, action?: Function}) => (option.to
    ? (
      <Link
        id={`${option.name}-btn`}
        className="block pl-6 pr-12 py-2 whitespace-nowrap"
        type="button"
        to={`${option.to}/${project._id}`}
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
          load(() => option.action!(project._id));
        }}
      >
        {option.name}
      </button>
    )
  ));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div key={project._id} className={`flex flex-col cursor-pointer aspect-w-4 aspect-h-3 ring-1 ring-black ring-opacity-5 transition-all rounded-md ${project.status === 'active' ? 'active-project' : 'closed-project'}`} role="link" tabIndex={0} onClick={cardClickHandler}>
      <div className="w-full flex flex-col justify-between px-8 pt-6 pb-5 text-gray-700">
        <div className="flex">
          <div className="flex-grow">
            <span className="uppercase text-sm font-bold">{project.client}</span>
            <h2 className="capitalize text-xl">{project.name}</h2>
          </div>
          {project.status === 'active' && <Dropdown elements={dropDownOptions} icon={<img src={OptionsIcon} alt="Options" />} />}
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <span className={`block w-2 h-2 ${project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} rounded-full`} />
            <span className="uppercase text-xs font-normal">{project.status}</span>
          </div>
          <div className="border-b-2 border-black opacity-5" />
          {cardStats}
        </div>
      </div>
    </div>
  );
};

export default Card;
