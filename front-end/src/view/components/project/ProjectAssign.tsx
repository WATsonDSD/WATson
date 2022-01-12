import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';

import {
  findProjectById,
  getUsersOfProject,
  assignImagesToAnnotator,
  createAnnotatorVerifierLink,
} from '../../../data';

import { Paths } from '../shared/routes/paths';
import { useSnackBar, SnackBarType } from '../../../utils/modals';

import useData from '../../../data/hooks';
import BackIcon from '../../../assets/icons/back.svg';

export default function ProjectAssign() {
  const { projectID } = useParams();

  const navigate = useNavigate();
  const snackBar = useSnackBar();

  if (!projectID) return <Navigate to={Paths.NotFound} />;

  const submitRef = useRef<HTMLInputElement>(null);

  const project = useData(() => findProjectById(projectID ?? ''));
  const workers = useData(() => getUsersOfProject(projectID ?? ''));

  const totalAssets = project?.images.imagesWithoutAnnotator.length ?? 0;

  const [assetsLeft, setAssetsLeft] = useState<number>(0);

  useEffect(() => {
    setAssetsLeft(project?.images.imagesWithoutAnnotator.length ?? 0);
  }, [project]);

  const annotators = workers ? workers.filter((user) => user.role === 'annotator') : [];
  const verifiers = workers ? workers.filter((user) => user.role === 'verifier') : [];

  const [links, setLinks] = useState<{ [workerID: string]: { verifierID: string, numberOfAssets: number }}>({});

  const handleSelectChange = (option: any, meta: any) => {
    links[meta.name] = {
      ...links[meta.name],
      verifierID: option?.value ?? '',
    };
    setLinks(links);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const assetsAssigned = (Object.values(
      document.getElementsByClassName('assigned-assets'),
    ) as HTMLInputElement[])
      .map((input) => Number(input.value))
      .reduce((acc, curr) => acc + curr);

    setAssetsLeft(totalAssets - assetsAssigned);

    if (totalAssets - assetsAssigned < 0) {
      document.getElementById('assets-left')?.classList.remove('text-green-500');
      document.getElementById('assets-left')?.classList.add('text-red-500');
    } else {
      document.getElementById('assets-left')?.classList.remove('text-red-500');
      document.getElementById('assets-left')?.classList.add('text-green-500');
    }

    links[event.currentTarget.name] = {
      ...links[event.currentTarget.name],
      numberOfAssets: Number((document.getElementsByClassName(event.currentTarget.name)[0] as HTMLInputElement).value),
    };
    setLinks(links);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(links);

    if (assetsLeft < 0) {
      return snackBar({ title: 'Too many assets assigned', message: 'The assigned assets exceed the available ones.' }, SnackBarType.Error);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const worker of Object.entries(links)) {
      // eslint-disable-next-line no-await-in-loop
      await assignImagesToAnnotator(worker[1].numberOfAssets, worker[0], projectID);

      if (worker[1].verifierID) {
        // eslint-disable-next-line no-await-in-loop
        await createAnnotatorVerifierLink(projectID, worker[0], worker[1].verifierID);
      }
    }

    return navigate(Paths.Projects);
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
              onClick={() => submitRef?.current?.click()}
            >
              Assign assets
            </button>
          </div>
        </div>
      </header>

      <form className="px-14 py-8" onSubmit={handleSubmit}>
        <div className="w-full rounded-lg border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h4 id="assets-left" className="text-md font-medium text-green-500">
              Assets left:
              {' '}
              {assetsLeft}
            </h4>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 px-6 py-2 text-sm text-gray-500 border-b">
              <span>Annotator</span>
              <span>Assigned verifier</span>
              <span className="justify-self-end">N° of assigned assets</span>
            </div>
          </div>

          {workers && workers.length > 0 ? [...annotators, ...verifiers].map((user, index) => {
            const isEven: boolean = index % 2 === 0;

            return (
              <div
                key={user._id}
                className={`grid grid-cols-3 items-center px-6 py-4 ${isEven ? 'bg-gray-50' : ''} transition-all`}
              >
                <span>{user.name}</span>
                {
                  user.role === 'annotator'
                    ? (
                      <Select
                        name={user._id}
                        isClearable
                        styles={SelectStyles}
                        options={verifiers.map((verifier) => ({ value: verifier._id, label: verifier.name }))}
                        onChange={handleSelectChange}
                        className="w-full text-base"
                      />
                    ) : (
                      <Select
                        name={user._id}
                        isClearable
                        styles={SelectStyles}
                        options={verifiers.filter((verifier) => verifier._id !== user._id).map((verifier) => ({ value: verifier._id, label: verifier.name }))}
                        onChange={handleSelectChange}
                        className="w-full text-base"
                      />
                    )
                }
                <input
                  name={user._id}
                  type="number"
                  placeholder="0"
                  min={0}
                  required
                  onChange={handleInputChange}
                  className={`${user._id} assigned-assets justify-self-end w-1/2 pb-1 text-right text-gray-800 text-base border-b bg-transparent focus:outline-none focus:border-black`}
                />
              </div>
            );
          }) : (
            <div className="flex justify-center py-4 text-gray-400">
              There are no annotators in the project.
            </div>
          )}
        </div>
        <input ref={submitRef} className="hidden" type="submit" />
      </form>
    </div>
  );
}
