import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  UserID,
} from '../../../data/types';

import {
  Project,
  getAllUsers,
  // createProject,
  // useUserNotNull,
  // addUserToProject,
} from '../../../data';

import useData from '../../../data/hooks';

import LandmarksView from './landmarks-view';

import PlusIcon from './plus';

import BackIcon from '../../../assets/icons/back.svg';
import UploadIcon from '../../../assets/icons/upload.svg';

import { Paths } from '../shared/routes';

export default function CreateProject() {
  const [project, setProject] = useState<Omit<Project, 'id' | 'status' | 'images' | 'workDoneInTime'>>(
    {
      name: '',
      client: '',
      startDate: new Date(),
      endDate: new Date(),
      landmarks: [],
      users: [],
      hourlyRateAnnotation: 0,
      hourlyRateVerification: 0,
      pricePerImageAnnotation: 0,
      pricePerImageVerification: 0,
    },
  );

  const [selectedLandmarks, updateSelectedLandmarks] = useState<number[]>([]);
  const selectedAnnotators = useRef<UserID[]>([]);
  const selectedVerifiers = useRef<UserID[]>([]);

  const workers = useData(() => getAllUsers());
  const annotators = workers ? workers.filter((user) => user.role === 'annotator') : [];
  const verifiers = workers ? workers.filter((user) => user.role === 'verifier') : [];

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // const landmarks: LandmarkSpecification = selectedLandmarks;
  };

  useEffect(() => {
    // if (project && user) {
    //   // the projectManager creating the project is assigned to it
    //   createProject(project.name, project.client, project.landmarks, project.startDate, project.endDate, {
    //     pricePerImageAnnotation: project.pricePerImageAnnotation, pricePerImageVerification: project.pricePerImageVerification, hourlyRateAnnotation: project.hourlyRateAnnotation, hourlyRateVerification: project.hourlyRateVerification,
    //   })
    //     .then(async (id) => {
    //       await addUserToProject(user.id, id);
    //       await addUserToProject('org.couchdb.user:finance@watson.com', id);
    //       for (let i = 0; i < project.users.length; i += 1) {
    //         // eslint-disable-next-line no-await-in-loop
    //         await addUserToProject(project.users[i], id);
    //       }
    //       navigate(Paths.Projects);
    //     });
    // }
  }, []);

  const range = (startAt: number, endAt: number): number[] => Array.from({ length: endAt - startAt }, (_x, i) => i + startAt);

  function handleLandmarksButton(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: number) {
    const selected = selectedLandmarks.includes(value);

    if (selected) {
      const newState: number[] = Array.from(selectedLandmarks);
      newState.splice(newState.indexOf(value), 1);
      updateSelectedLandmarks(newState);
    } else {
      const newState: number[] = Array.from(selectedLandmarks);
      newState.push(value);
      updateSelectedLandmarks(newState);
    }
  }

  const landmarkButton = (i: number) => (
    <button
      key={i}
      type="button"
      onClick={(e) => handleLandmarksButton(e, i)}
      className={`border w-10 h-10 transition-all ${
        selectedLandmarks.includes(i)
          ? 'bg-green-200 hover:bg-green-300 border-green-300 text-green-600 hover:text-green-800'
          : 'bg-white hover:bg-gray-100 text-gray-800'
      }`}
    >
      {i}
    </button>
  );

  function handleLandmarksCheckbox(event: any, values: number[]) {
    if (!event.target.checked) {
      updateSelectedLandmarks(selectedLandmarks.filter((value) => !values.includes(value)));
    } else {
      const newState: number[] = Array.from(selectedLandmarks);
      newState.push(...values);
      updateSelectedLandmarks(newState);
    }
  }

  const landmarkCheckbox = (landmarks: number[]) => (
    <input
      type="checkbox"
      className="mr-2"
      checked={landmarks.every((i) => selectedLandmarks.includes(i))}
      onChange={(event) => handleLandmarksCheckbox(event, landmarks)}
    />
  );

  return (
    <>
      <header id="create-project-header" className="sticky top-0 bg-gray-50">
        <button type="button" onClick={() => navigate(Paths.Projects)} className="transition-opacity opacity-60 hover:opacity-100">
          <img src={BackIcon} alt="Go Back" />
        </button>
        <div className="flex justify-between">
          <h1 className="self-center text-2xl font-bold">Create a new project</h1>
          <button
            className="justify-self-end col-start-2 py-2 px-6 border border-gray-400 text-gray-500 text-white rounded-full"
            type="button"
            disabled
          >
            Create the project
          </button>
        </div>
      </header>

      <form id="create-project" onSubmit={handleSubmit}>
        <span id="step-1" className="flex items-center justify-center w-10 h-10 text-lg border rounded-full">1</span>
        <div>
          <h3 className="uppercase text-md font-medium">General information</h3>
          <p className="text-gray-400">Provide some general information regarding the scope of this project.</p>
        </div>

        <div className="grid grid-cols-6 col-start-2 gap-x-8 mb-10">
          <label htmlFor="name" className="flex flex-col items-start col-span-2 text-gray-500">
            Project Name
            <input id="name" name="name" type="text" placeholder="Jane..." value={project.name} onChange={handleInputChange} required className="w-full py-1 text-black text-lg border-b placeholder-gray-300 focus:outline-none focus:border-black" />
          </label>
          <label htmlFor="client" className="flex flex-col items-start col-span-2 text-gray-500">
            Client
            <input id="client" name="client" type="text" placeholder="Visage Technologies..." value={project.client} onChange={handleInputChange} required className="w-full py-1 text-black text-lg border-b placeholder-gray-300 focus:outline-none focus:border-black" />
          </label>
          <label htmlFor="startDate" className="flex flex-col items-start text-gray-500">
            Start date
            <input id="startDate" name="startDate" type="date" value={project.startDate.toString()} onChange={handleInputChange} required className="w-full py-1 text-black text-lg border-b placeholder-gray-300 focus:outline-none focus:border-black" />
          </label>
          <label htmlFor="endDate" className="flex flex-col items-start text-gray-500">
            Due date
            <input id="endDate" name="endDate" type="date" value={project.endDate.toString()} onChange={handleInputChange} required className="w-full py-1 text-black text-lg border-b placeholder-gray-300 focus:outline-none focus:border-black" />
          </label>
        </div>

        <span id="step-2" className="flex items-center justify-center w-10 h-10 text-lg border rounded-full">2</span>
        <div>
          <h3 className="uppercase text-md font-medium">Landmarks</h3>
          <p className="text-gray-400">Select the specific face features that the workers will have to annotate in the project</p>
        </div>

        <div className="grid grid-cols-6 items-center col-start-2 gap-x-20 2xl:gap-0 mt-4 mb-8">
          <div className="col-span-3">
            <div className="w-full 2xl:w-4/5 p-16 border rounded-xl"><LandmarksView selectedLandmarks={selectedLandmarks} /></div>
          </div>

          <div className="flex flex-col gap-y-6 col-span-2">
            <div className="flex">
              {landmarkCheckbox(range(1, 69))}
              <span className="text-gray-600">
                Select all landmarks
              </span>
            </div>
            <div>
              <div className="flex">
                {landmarkCheckbox(range(1, 18))}
                <span className="capitalize text-gray-600 py-1">
                  Face Contour
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(1, 18).map(landmarkButton)}
              </div>
            </div>
            <div className="inline-flex space-x-6">
              <div className="left-brow">
                <div className="flex">
                  {landmarkCheckbox(range(18, 23))}
                  <span className="capitalize text-gray-600 py-1">
                    Left Brow
                  </span>
                </div>
                <div className="inline-flex">
                  {range(18, 23).map(landmarkButton)}
                </div>
              </div>
              <div>
                <div className="flex">
                  {landmarkCheckbox(range(23, 28))}
                  <span className="capitalize text-gray-600 py-1">
                    Right Brow
                  </span>
                </div>
                <div className="inline-flex">
                  {range(23, 28).map(landmarkButton)}
                </div>
              </div>
            </div>
            <div>
              <div className="flex">
                {landmarkCheckbox(range(28, 37))}
                <span className="capitalize text-gray-600 py-1">
                  Nose
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(28, 37).map(landmarkButton)}
              </div>
            </div>
            <div className="inline-flex space-x-6">
              <div className="left-eye">
                <div className="flex">
                  {landmarkCheckbox(range(37, 43))}
                  <span className="capitalize text-gray-600 py-1">
                    Left Eye
                  </span>
                </div>
                <div className="inline-flex">
                  {range(37, 43).map(landmarkButton)}
                </div>
              </div>
              <div>
                <div className="flex">
                  {landmarkCheckbox(range(43, 49))}
                  <span className="capitalize text-gray-600 py-1">
                    Right Eye
                  </span>
                </div>
                <div className="inline-flex">
                  {range(43, 49).map(landmarkButton)}
                </div>
              </div>
            </div>
            <div>
              <div className="flex">
                {landmarkCheckbox(range(49, 69))}
                <span className="capitalize text-gray-600 py-1">
                  Mouth
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(49, 69).map(landmarkButton)}
              </div>
            </div>
          </div>
        </div>

        <span id="step-3" className="flex items-center justify-center w-10 h-10 text-lg border rounded-full">3</span>
        <div>
          <h3 className="uppercase text-md font-medium">Upload assets</h3>
          <p className="text-gray-400">Select the images/videos that will be uploaded as part of this project</p>
        </div>

        <div className="flex flex-col gap-y-8 col-start-2 mb-8">
          <button type="button" className="flex flex-col items-center justify-center gap-y-2 py-8 w-full border border-blue-200 hover:border-blue-300 bg-blue-50 text-blue-300 hover:text-blue-400 transition-all rounded-md">
            <img src={UploadIcon} alt="Upload media" />
            Drag and drop, or click to upload.
          </button>

          <div className="w-full rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mx-6 py-6 border-b">
              <h3 className="text-lg font-medium">Uploaded assets</h3>
              <button type="button" className="px-6 py-1 border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 text-red-400 transition-all rounded-full">Remove all</button>
            </div>

            <div className="flex flex-col">
              <div className="flex gap-x-4 mx-6 mb-2 py-2 text-sm text-gray-500 border-b">
                <span className="w-full">File name</span>
                <span className="w-1/6">Type</span>
                <span className="w-1/6">Extension</span>
                <span className="w-1/12 text-center">Size</span>
              </div>

              <div className="flex gap-x-4 px-6 py-3 text-gray-800">
                <span className="w-full">IMG_9336</span>
                <span className="w-1/6">Image</span>
                <span className="w-1/6">JPEG</span>
                <span className="w-1/12 text-center">701KB</span>
              </div>
              <div className="flex gap-x-4 px-6 py-3 text-gray-800">
                <span className="w-full">IMG_9336</span>
                <span className="w-1/6">Image</span>
                <span className="w-1/6">JPEG</span>
                <span className="w-1/12 text-center">701KB</span>
              </div>
              <div className="flex gap-x-4 px-6 py-3 text-gray-800">
                <span className="w-full">IMG_9336</span>
                <span className="w-1/6">Image</span>
                <span className="w-1/6">JPEG</span>
                <span className="w-1/12 text-center">701KB</span>
              </div>

              <div className="flex mt-2 px-6 py-3 bg-gray-50">
                <span>+997 other files</span>
              </div>
            </div>
          </div>
        </div>

        <span id="step-4" className="flex items-center justify-center w-10 h-10 text-lg border rounded-full">4</span>
        <div>
          <h3 className="uppercase text-md font-medium">Workers</h3>
          <p className="text-gray-400">Choose the users that you want to include as workers in this project</p>
        </div>

        <div className="flex flex-col gap-y-8 mb-8 col-start-2">
          <div className="w-full rounded-lg border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg">Annotators</h3>
              {annotators && annotators.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAnnotators.current.length === annotators.length) {
                      selectedAnnotators.current = [];
                    } else {
                      selectedAnnotators.current = annotators.map((u) => u.id);
                    }
                    setProject({ ...project, users: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                  }}
                  className={`px-6 py-1 border  transition-all rounded-full ${
                    selectedAnnotators.current.length === annotators.length
                      ? 'border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 text-red-400'
                      : 'border-green-200 hover:bg-green-50 hover:border-green-300 hover:text-green-500 text-green-400'
                  }`}
                >
                  {selectedAnnotators.current.length === annotators.length ? 'Deselect all' : 'Select all'}
                </button>
              )}
            </div>

            <div className="flex flex-col">
              <div className="grid grid-cols-8 px-6 py-2 text-gray-500 border-b">
                <span className="col-span-2">Full name</span>
                <span>Email</span>
              </div>

              {annotators && annotators.length > 0 ? annotators.map((user, index) => {
                const included: boolean = selectedAnnotators.current.includes(user.id);
                const isEven: boolean = index % 2 === 0;

                function handleClick() {
                  if (included) {
                    selectedAnnotators.current = selectedAnnotators.current.filter((u) => u !== user.id);
                  } else {
                    selectedAnnotators.current.push(user.id);
                  }
                  setProject({ ...project, users: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                }

                return (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <div
                    key={user.id}
                    role="listitem"
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    className={`grid grid-cols-8 items-center px-6 py-3 cursor-pointer ${isEven ? 'bg-gray-50' : ''} transition-all ${included ? 'text-black bg-blue-50' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <span className="col-span-2">{user.name}</span>
                    <span className="col-span-5">{user.email}</span>
                    <button
                      type="button"
                      className="justify-self-end opacity-70 hover:opacity-100 transition-all"
                    >
                      <PlusIcon
                        className={`w-8 h-8 p-2 rounded-full border transition-all ${
                          included
                            ? 'selected-worker border-red-200'
                            : 'border-gray-600'
                        }`}
                        stroke={included ? 'red' : 'black'}
                      />
                    </button>
                  </div>
                );
              }) : (
                <div className="flex justify-center py-4 text-gray-400">
                  There are no annotators registered in the system.
                </div>
              )}
            </div>
          </div>

          <div className="w-full rounded-lg border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg">Verifiers</h3>
              {verifiers && verifiers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedVerifiers.current.length === verifiers.length) {
                      selectedVerifiers.current = [];
                    } else {
                      selectedVerifiers.current = verifiers.map((u) => u.id);
                    }
                    setProject({ ...project, users: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                  }}
                  className={`px-6 py-1 border  transition-all rounded-full ${
                    selectedVerifiers.current.length === verifiers.length
                      ? 'border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 text-red-400'
                      : 'border-green-200 hover:bg-green-50 hover:border-green-300 hover:text-green-500 text-green-400'
                  }`}
                >
                  {selectedVerifiers.current.length === verifiers.length ? 'Deselect all' : 'Select all'}
                </button>
              )}
            </div>

            <div className="flex flex-col">
              <div className="grid grid-cols-8 px-6 py-2 text-gray-500 border-b">
                <span className="col-span-2">Full name</span>
                <span>Email</span>
              </div>

              {verifiers && verifiers.length > 0 ? verifiers.map((user, index) => {
                const included: boolean = selectedVerifiers.current.includes(user.id);
                const isEven: boolean = index % 2 === 0;

                function handleClick() {
                  if (included) {
                    selectedVerifiers.current = selectedVerifiers.current.filter((u) => u !== user.id);
                  } else {
                    selectedVerifiers.current = [...selectedVerifiers.current, user.id];
                  }
                  setProject({ ...project, users: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                }

                return (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <div
                    key={user.id}
                    role="listitem"
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    className={`grid grid-cols-8 items-center px-6 py-3 cursor-pointer ${isEven ? 'bg-gray-50' : ''} transition-all ${included ? 'text-black bg-blue-50' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <span className="col-span-2">{user.name}</span>
                    <span className="col-span-5">{user.email}</span>
                    <button
                      type="button"
                      className="justify-self-end opacity-70 hover:opacity-100 transition-all"
                    >
                      <PlusIcon
                        className={`w-8 h-8 p-2 rounded-full border transition-all ${
                          included
                            ? 'selected-worker border-red-200'
                            : 'border-gray-600'
                        }`}
                        stroke={included ? 'red' : 'black'}
                      />
                    </button>
                  </div>
                );
              }) : (
                <div className="flex justify-center py-4 text-gray-400">
                  There are no verifiers registered in the system.
                </div>
              )}
            </div>
          </div>
        </div>

        <span id="step-5" className="flex items-center justify-center w-10 h-10 text-lg border rounded-full">5</span>
        <div>
          <h3 className="uppercase text-md font-medium">Pricing model</h3>
          <p className="text-gray-400">Determine the price of the work done by the annotators and the verifiers in the project</p>
        </div>

        <div className="grid grid-cols-4 col-start-2 gap-x-10 mb-10">
          <label htmlFor="hourlyRateAnnotation" className="flex flex-col items-start text-gray-500">
            Annotator&apos;s hourly rate
            <span className="flex items-center w-full pr-4 border-b">
              <input id="hourlyRateAnnotation" name="hourlyRateAnnotation" type="number" placeholder="0" value={project.hourlyRateAnnotation} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK/h
            </span>
          </label>
          <label htmlFor="hourlyRateVerification" className="flex flex-col items-start text-gray-500">
            Verifier&apos;s hourly rate
            <span className="flex items-center w-full pr-4 border-b">
              <input id="hourlyRateVerification" name="hourlyRateVerification" type="number" placeholder="0" value={project.hourlyRateVerification} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK/h
            </span>
          </label>
          <label htmlFor="pricePerImageAnnotation" className="flex flex-col items-start text-gray-500">
            Annotation price
            <span className="flex items-center w-full pr-4 border-b">
              <input id="pricePerImageAnnotation" name="pricePerImageAnnotation" type="number" placeholder="0" value={project.pricePerImageAnnotation} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK
            </span>
          </label>
          <label htmlFor="pricePerImageVerification" className="flex flex-col items-start text-gray-500">
            Verification price
            <span className="flex items-center w-full pr-4 border-b">
              <input id="pricePerImageVerification" name="pricePerImageVerification" type="number" placeholder="0" value={project.pricePerImageVerification} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK
            </span>
          </label>
        </div>
      </form>
    </>
  );
}
