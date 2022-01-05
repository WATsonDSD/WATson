import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import { v4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

import {
  UserID,
  ImageID,
  ProjectID,
  Image,
  ImagesDB,
  Project,
  updateUser,
  getAllUsers,
  createProject,
} from '../../../data';

import useData from '../../../data/hooks';

import LandmarksView from './landmarks-view';

import PlusIcon from './plus';
import BackIcon from '../../../assets/icons/back.svg';
import UploadIcon from '../../../assets/icons/upload.svg';

import { Paths } from '../shared/routes';

export default function CreateProject() {
  const [project, setProject] = useState<Project & { _id: ProjectID }>(
    {
      _id: '',
      name: '',
      client: '',
      startDate: new Date(0),
      endDate: new Date(0),
      status: 'active',

      landmarks: [],

      pricePerImageAnnotation: 0,
      pricePerImageVerification: 0,
      hourlyRateAnnotation: 0,
      hourlyRateVerification: 0,

      workers: [],
      linkedWorkers: [],

      timedWork: {},

      images: {
        blocks: {},
        pendingAssignments: [],
        done: [],
      },
    },
  );

  const [projectIsValid, updateProjectValidity] = useState<boolean>(false);
  // const [projectIsPending, setProjectIsPending] = useState<boolean>(false);

  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles((previousFiles) => [...previousFiles, ...acceptedFiles]);
    },
  });

  const selectedAnnotators = useRef<UserID[]>([]);
  const selectedVerifiers = useRef<UserID[]>([]);
  const selectedLandmarks = useRef<number[]>([]);

  const workers = useData(() => getAllUsers()) ?? [];

  const annotators = workers ? workers.filter((user) => user.role === 'annotator') : [];
  const verifiers = workers ? workers.filter((user) => user.role === 'verifier') : [];

  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleValidation = () => {
    const validGeneralInformation = project.name.length > 0 && project.client.length > 0 && project.endDate > project.startDate;
    const validLandmarks = project.landmarks.length > 0;
    const validAssets = files && files.length > 0;
    const validWorkers = selectedAnnotators.current.length > 0 && selectedVerifiers.current.length > 0;
    const validPricing = project.hourlyRateAnnotation > 0 && project.hourlyRateVerification > 0 && project.pricePerImageAnnotation > 0 && project.pricePerImageVerification > 0;

    const validateStep = (step: string) => document.getElementById(step)?.classList.add('text-white', 'border-green-500', 'bg-green-500');
    const invalidateStep = (step: string) => document.getElementById(step)?.classList.remove('text-white', 'border-green-500', 'bg-green-500');

    if (validGeneralInformation) validateStep('step-1');
    else invalidateStep('step-1');

    if (validLandmarks) validateStep('step-2');
    else invalidateStep('step-2');

    if (validAssets) validateStep('step-3');
    else invalidateStep('step-3');

    if (validWorkers) validateStep('step-4');
    else invalidateStep('step-4');

    if (validPricing) validateStep('step-5');
    else invalidateStep('step-5');

    updateProjectValidity(validGeneralInformation && validLandmarks && validAssets && validWorkers && validPricing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const images: (Image & { _id: ImageID})[] = files.map((file) => (
      {
        _id: v4(),
        _attachments: {
          image: {
            content_type: file.type,
            data: new Blob([file]),
          },
        },
      }
    ));

    project.workers = [...project.workers, 'org.couchdb.user:pm@watson.com', 'org.couchdb.user:finance@watson.com'];
    project.images.pendingAssignments = images.map((image) => image._id);
    project._id = v4();

    await createProject(project)
      .then(() => {
        ImagesDB.bulkDocs(images)
          .catch((error) => { throw error; });
      })
      .catch((error) => {
        console.log(error);
      });

    await Promise.all(workers.filter((worker) => project.workers.includes(worker._id)).map(async (selectedWorker) => {
      updateUser(
        {
          ...selectedWorker,
          projects: {
            ...selectedWorker.projects,
            [project._id]: {
              assignedAnnotations: [],
              rejectedAnnotations: [],
              assignedVerifications: [],
              pendingVerifications: [],

              annotated: [],
              verified: [],
            },
          },
        },
      );
    }));

    navigate(Paths.Projects);
  };

  useEffect(() => {
    handleValidation();
  }, [project, files]);

  const range = (startAt: number, endAt: number): number[] => Array.from({ length: endAt - startAt }, (_x, i) => i + startAt);

  function handleLandmarksButton(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: number) {
    if (selectedLandmarks.current.includes(value)) {
      selectedLandmarks.current = selectedLandmarks.current.filter((ln) => ln !== value);
    } else {
      selectedLandmarks.current = [...selectedLandmarks.current, value];
    }
    setProject({ ...project, landmarks: selectedLandmarks.current });
  }

  const landmarkButton = (i: number) => (
    <button
      key={i}
      type="button"
      onClick={(e) => handleLandmarksButton(e, i)}
      className={`border w-10 h-10 transition-all ${
        selectedLandmarks.current.includes(i)
          ? 'bg-green-200 hover:bg-green-300 border-green-300 text-green-600 hover:text-green-800'
          : 'bg-white hover:bg-gray-100 text-gray-800'
      }`}
    >
      {i}
    </button>
  );

  function handleLandmarksCheckbox(event: any, values: number[]) {
    if (!event.target.checked) {
      selectedLandmarks.current = selectedLandmarks.current.filter((value) => !values.includes(value));
    } else {
      selectedLandmarks.current = [...selectedLandmarks.current, ...values];
    }
    setProject({ ...project, landmarks: selectedLandmarks.current });
  }

  const landmarkCheckbox = (landmarks: number[]) => (
    <input
      type="checkbox"
      className="mr-2"
      checked={landmarks.every((i) => selectedLandmarks.current.includes(i))}
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
          <div>
            <button
              id="submit"
              type="button"
              className={`justify-self-end col-start-2 py-2 px-6 border transition-all rounded-full ${
                projectIsValid
                  ? 'border-black text-white bg-gray-700 hover:bg-black'
                  : 'border-gray-400 text-gray-500'
              }`}
              onClick={() => projectIsValid && inputRef?.current?.click()}
            >
              Create the project
            </button>
          </div>
        </div>
      </header>

      <form id="create-project" onSubmit={handleSubmit}>
        <span id="step-1" className="flex items-center justify-center w-10 h-10 text-lg border transition-all rounded-full">1</span>
        <div>
          <h3 className="uppercase text-md font-medium">General information</h3>
          <p className="text-gray-400">Provide some general information regarding the scope of this project.</p>
        </div>

        <div className="grid grid-cols-6 col-start-2 gap-x-8 mb-10">
          <label htmlFor="name" className="flex flex-col items-start col-span-2 text-gray-500">
            Project Name
            <input id="name" name="name" type="text" placeholder="Jane..." value={project.name} onChange={handleInputChange} onBlur={handleValidation} required className="w-full py-1 text-black text-lg border-b placeholder-gray-300 focus:outline-none focus:border-black" />
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

        <span id="step-2" className="flex items-center justify-center w-10 h-10 text-lg border transition-all rounded-full">2</span>
        <div>
          <h3 className="uppercase text-md font-medium">Landmarks</h3>
          <p className="text-gray-400">Select the specific face features that the workers will have to annotate in the project</p>
        </div>

        <div className="grid grid-cols-6 items-center col-start-2 gap-x-20 2xl:gap-0 mt-4 mb-8">
          <div className="col-span-3">
            <div className="w-full 2xl:w-4/5 p-16 border rounded-xl"><LandmarksView selectedLandmarks={selectedLandmarks.current} /></div>
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

        <span id="step-3" className="flex items-center justify-center w-10 h-10 text-lg border transition-all rounded-full">3</span>
        <div>
          <h3 className="uppercase text-md font-medium">Upload assets</h3>
          <p className="text-gray-400">Select the images/videos that will be uploaded as part of this project</p>
        </div>

        <div className="flex flex-col gap-y-8 col-start-2 mb-8">
          { /* eslint-disable react/jsx-props-no-spreading */ }
          <div {...getRootProps({ className: 'dropzone cursor-pointer flex flex-col items-center justify-center gap-y-2 py-8 w-full border border-blue-200 hover:border-blue-300 bg-blue-50 text-blue-300 hover:text-blue-400 transition-all rounded-md' })}>
            <input {...getInputProps()} />
            <img src={UploadIcon} alt="Upload media" />
            Drag and drop, or click to upload.
          </div>

          <div className="w-full rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mx-6 py-6 border-b">
              <h3 className="text-lg font-medium py-1">Uploaded assets</h3>
              {files && files.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="px-6 py-1 border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 text-red-400 transition-all rounded-full"
                >
                  Remove all
                </button>
              ) : ''}
            </div>

            <div className="flex flex-col gap-y-4 mb-4">
              <div className="flex gap-x-4 mx-6 py-2 text-sm text-gray-500 border-b">
                <span className="w-full">File name</span>
                <span className="w-1/6">Type</span>
                <span className="w-1/6">Extension</span>
                <span className="w-1/12 text-center">Size</span>
              </div>

              {files && files.length > 0 ? files.slice(0, 5).map((file) => (
                <div key={file.name} className="flex gap-x-4 px-6 text-gray-800">
                  <span className="w-full">{file.name}</span>
                  <span className="capitalize w-1/6">{file.type.split('/')[0]}</span>
                  <span className="uppercase w-1/6">{file.type.split('/')[1]}</span>
                  <span className="w-1/12 text-center">{file.size}</span>
                </div>
              )) : (
                <div className="flex justify-center text-gray-400">
                  You didn&apos;t upload any assets yet.
                </div>
              )}

              {files && files.length > 5 && (
              <div className="flex bg-gray-50">
                <span>
                  {files.length - 5}
                  {' '}
                  other files
                </span>
              </div>
              )}
            </div>
          </div>
        </div>

        <span id="step-4" className="flex items-center justify-center w-10 h-10 text-lg border transition-all rounded-full">4</span>
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
                      selectedAnnotators.current = annotators.map((u) => u._id);
                    }
                    setProject({ ...project, workers: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                  }}
                  className={`px-6 py-1 border transition-all rounded-full ${
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
                const included: boolean = selectedAnnotators.current.includes(user._id);
                const isEven: boolean = index % 2 === 0;

                function handleClick() {
                  if (included) {
                    selectedAnnotators.current = selectedAnnotators.current.filter((u) => u !== user._id);
                  } else {
                    selectedAnnotators.current.push(user._id);
                  }
                  setProject({ ...project, workers: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                }

                return (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <div
                    key={user._id}
                    role="listitem"
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    className={`grid grid-cols-8 items-center px-6 py-3 cursor-pointer ${isEven ? 'bg-gray-50' : ''} transition-all ${included ? 'text-black' : 'text-gray-400 hover:text-gray-500'}`}
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
                      selectedVerifiers.current = verifiers.map((u) => u._id);
                    }
                    setProject({ ...project, workers: [...selectedAnnotators.current, ...selectedVerifiers.current] });
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
                const included: boolean = selectedVerifiers.current.includes(user._id);
                const isEven: boolean = index % 2 === 0;

                function handleClick() {
                  if (included) {
                    selectedVerifiers.current = selectedVerifiers.current.filter((u) => u !== user._id);
                  } else {
                    selectedVerifiers.current = [...selectedVerifiers.current, user._id];
                  }
                  setProject({ ...project, workers: [...selectedAnnotators.current, ...selectedVerifiers.current] });
                }

                return (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <div
                    key={user._id}
                    role="listitem"
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    className={`grid grid-cols-8 items-center px-6 py-3 cursor-pointer ${isEven ? 'bg-gray-50' : ''} transition-all ${included ? 'text-black' : 'text-gray-400 hover:text-gray-500'}`}
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

        <span id="step-5" className="flex items-center justify-center w-10 h-10 text-lg border transition-all rounded-full">5</span>
        <div>
          <h3 className="uppercase text-md font-medium">Pricing model</h3>
          <p className="text-gray-400">Determine the price of the work done by the annotators and the verifiers in the project</p>
        </div>

        <div className="grid grid-cols-4 col-start-2 gap-x-10 mb-10">
          <label htmlFor="hourlyRateAnnotation" className="flex flex-col items-start text-gray-500">
            Annotator&apos;s hourly rate
            <span className="flex items-center w-full pr-4 border-b">
              <input id="hourlyRateAnnotation" name="hourlyRateAnnotation" type="number" min={0} placeholder="0" value={project.hourlyRateAnnotation || ''} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK/h
            </span>
          </label>
          <label htmlFor="hourlyRateVerification" className="flex flex-col items-start text-gray-500">
            Verifier&apos;s hourly rate
            <span className="flex items-center w-full pr-4 border-b">
              <input id="hourlyRateVerification" name="hourlyRateVerification" type="number" min={0} placeholder="0" value={project.hourlyRateVerification || ''} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK/h
            </span>
          </label>
          <label htmlFor="pricePerImageAnnotation" className="flex flex-col items-start text-gray-500">
            Annotation price
            <span className="flex items-center w-full pr-4 border-b">
              <input id="pricePerImageAnnotation" name="pricePerImageAnnotation" type="number" min={0} placeholder="0" value={project.pricePerImageAnnotation || ''} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK
            </span>
          </label>
          <label htmlFor="pricePerImageVerification" className="flex flex-col items-start text-gray-500">
            Verification price
            <span className="flex items-center w-full pr-4 border-b">
              <input id="pricePerImageVerification" name="pricePerImageVerification" type="number" min={0} placeholder="0" value={project.pricePerImageVerification || ''} onChange={handleInputChange} required className="w-full py-1 text-black text-lg focus:outline-none" />
              HRK
            </span>
          </label>
        </div>
        <input ref={inputRef} className="hidden" type="submit" />
      </form>
    </>
  );
}
