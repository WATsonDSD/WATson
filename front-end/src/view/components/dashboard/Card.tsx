import { AiOutlineRise, AiOutlineTeam, AiOutlineRedo } from 'react-icons/ai';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import { User, useUserContext } from '../../../data';

const Card = (props: any) => {
  const { project, actions } = props;
  const user = useUserContext();
  const navigate = useNavigate();

  const cardClickHandler = () => {
    switch ((user as User)?.role) {
      case 'projectManager':
        navigate(`/editProject/${project.id}`);
        break;
      case 'annotator':
        navigate(`/annotationView/${project.id}`);
        break;
      case 'verifier':
      case 'finance':
        break;
      default:
        break;
    }
  };

  const dropDownActions = actions.map((action: any) => (
    <Link
      id={`${action.text}-btn`}
      onClick={(event) => event.stopPropagation()}
      className="ml-4"
      type="button"
      to={`${action.href}${project.id}`}
    >
      {action.text}

    </Link>
  ));

  return (

    <div className="flex-initial flex overflow-hidden cursor-pointer" role="link" tabIndex={0} onClick={cardClickHandler} onKeyDown={() => { console.log('open project'); }}>
      <div className="w-full bg-black sahdow-lg flex flex-wrap flex-col rounded-2xl">

        <div className="flex flex-grow justify-between py-2">
          <p className="text-2x1 text-gray-200 px-3">{project.name}</p>
          <div className="h-4 fill-current text-grey-dark cursor-pointer">
            <Dropdown elements={dropDownActions} />
          </div>
        </div>
        <div className="flex justify-between py-0">
          <h2 className="text-2x1 text-white px-3">
            {project.client}
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
