import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';

import {
  Worker,
  findProjectById,
  getUsersOfProject,
  // createAnnotatorVerifierLink,
  // assignImagesToAnnotator,
} from '../../../data';

import useData from '../../../data/hooks';

import BackIcon from '../../../assets/icons/back.svg';

import { Paths } from '../shared/routes/paths';

export default function ProjectAssign() {
  const { idProject } = useParams();
  const navigate = useNavigate();

  if (!idProject) { throw Error('No project id!'); }

  const project = useData(async () => findProjectById(idProject));

  const inputRef = useRef<HTMLInputElement>(null);

  const [projectUsers, setProjectUsers] = useState<Worker[]>([]);

  const [assignedAssets] = useState<number>(0);

  const annotators = projectUsers ? projectUsers.filter((user) => user.role === 'annotator') : [];
  const verifiers = projectUsers ? projectUsers.filter((user) => user.role === 'verifier') : [];

  const links: { [annotatorID: string]: {verifierID: string, numberOfAssets: number}} = {};

  useEffect(() => {
    getUsersOfProject(idProject).then((result) => {
      setProjectUsers(result);
    });
  }, []);

  const handleSelectChange = (option: any, meta: any) => {
    links[meta.name] = {
      ...links[meta.name],
      numberOfAssets: Number(option?.value ?? ''),
    };
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    links[event.currentTarget.name] = {
      ...links[event.currentTarget.name],
      numberOfAssets: Number(event.currentTarget.value),
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // // eslint-disable-next-line no-restricted-syntax
    // for (const annotator of Object.entries(links)) {
    //   // eslint-disable-next-line no-await-in-loop
    //   await assignImagesToAnnotator(annotator[1].numberOfAssets, annotator[0], idProject);

    //   if (annotator[1].verifierID) {
    //     // eslint-disable-next-line no-await-in-loop
    //     await createAnnotatorVerifierLink(idProject, annotator[0], annotator[1].verifierID);
    //   }
    // }

    // navigate(Paths.Projects);
  };

  const SelectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: 0,
      backgroundColor: 'transparent',
      border: 0,
      borderRadius: 0,
      borderBottom: '1px solid rgb(229, 231, 235)',
      boxShadow: 'none',
      '&:focus': {
        borderBottom: '1px solid black',
      },
      '&:hover': {
        borderBottom: '1px solid black',
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? 'black' : 'rgba(0, 0, 0, 0.4)',
      backgroundColor: 'white',
      '&:hover': {
        color: 'black',
      },
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    input: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    indicatorSeparator: () => ({}),

  };

  return (
    <div className="min-h-full w-full">
      <header id="create-project-header" className="sticky top-0 bg-gray-50">
        <button type="button" onClick={() => navigate(Paths.Projects)} className="transition-opacity opacity-60 hover:opacity-100">
          <img src={BackIcon} alt="Go Back" />
        </button>
        <div className="flex justify-between">
          <h1 className="self-center text-2xl font-bold">Assign images to workers</h1>
          <div>
            <button
              id="submit"
              type="button"
              className="justify-self-end col-start-2 py-2 px-6 border border-black text-white bg-gray-700 hover:bg-black transition-all rounded-full"
              onClick={() => inputRef?.current?.click()}
            >
              Assign assets
            </button>
          </div>
        </div>
      </header>

      <form className="px-14 py-8" onSubmit={handleSubmit}>
        <div className="w-full rounded-lg border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h4 className="text-md font-medium">
              Assets left:
              {' '}
              {project?.images.imagesWithoutAnnotator.length ?? 0 - assignedAssets}
            </h4>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 px-6 py-2 text-sm text-gray-500 border-b">
              <span>Annotator</span>
              <span>Assigned verifier</span>
              <span className="justify-self-end">N° of assigned assets</span>
            </div>
          </div>

          {annotators && annotators.length > 0 ? annotators.map((user, index) => {
            const isEven: boolean = index % 2 === 0;

            return (
              <div
                key={user._id}
                className={`grid grid-cols-3 items-center px-6 py-4 ${isEven ? 'bg-gray-50' : ''} transition-all`}
              >
                <span>{user.name}</span>
                <Select
                  name={user._id}
                  isClearable
                  onChange={handleSelectChange}
                  styles={SelectStyles}
                  options={verifiers.map((verifier) => ({ value: verifier._id, label: verifier.name }))}
                  className="w-full text-base"
                />
                <input
                  name={user._id}
                  type="number"
                  min={0}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="assigned-assets justify-self-end w-1/2 pb-1 text-right text-gray-800 text-base border-b bg-transparent focus:outline-none focus:border-black"
                />
              </div>
            );
          }) : (
            <div className="flex justify-center py-4 text-gray-400">
              There are no annotators in the project.
            </div>
          )}
        </div>
        <input ref={inputRef} className="hidden" type="submit" />
      </form>
    </div>
  );
}
