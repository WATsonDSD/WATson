import { AiOutlineRise, AiOutlineTeam, AiOutlineRedo } from 'react-icons/ai';
import React from 'react';
import DropDown from './Dropdown';
// import { Project } from '../../../data';

const Card = (props: any) => {
  const { project } = props;

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="w-full bg-black sahdow-lg flex flex-col rounded-2xl">

        <div className="flex justify-between py-2">
          <p className="text-2x1 text-gray-200 px-3">{project.client}</p>
          <div className="h-4 fill-current text-grey-dark cursor-pointer">
            <DropDown />
          </div>
        </div>
        <div className="flex justify-between py-0">
          <h2 className="text-2x1 text-white px-3">
            {project.startDate.toDateString()}
            {' '}
            To
            {' '}
            {project.endDate.toDateString()}
          </h2>
        </div>

        <div className="px-2 py-8 -mb-8">
          <div className="text-xs text-gray-400 font-normal py-1">
            {project.status}
          </div>
          <p className="border-b-2" />
          <div className="flex text-xs font-semibold text-gray-700 flex bg-transparant w-full py-3">
            <span className="flex text-gray-400 w-full text-left">
              <AiOutlineRedo />
              {' '}
              60%
              {' '}
            </span>
            <span className="flex text-gray-400 w-full">
              <AiOutlineRise />
              €
            </span>
            <span className="flex text-gray-400">
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
