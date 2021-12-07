import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/layout/Header';
import {
  Project, UserID, LandmarkSpecification,
} from '../../../data/types';
import {
  addUserToProject, createProject, getAllUsers, useUserData, Image,
} from '../../../data';
import useData from '../../../data/hooks';
import AnnotatedImage from '../annotation/AnnotatedImage';
import TemplateAnnotation from '../annotation/TemplateAnnotation';

const templateImage: Image = {
  id: 'template',
  annotation: TemplateAnnotation,
};

export default function CreateProject() {
  const [user] = useUserData();
  const allUsers = useData(() => getAllUsers());
  const [workers, setWorkers] = useState([{ id: 0, worker: '' }]);
  const [currentLandMarks, setLandMarks] = useState([] as number[]);
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  console.log(workers);
  const handleSubmit = (event: any) => {
    const name = event.target.name.value;
    const client = event.target.client.value;
    const startDate = event.target.startDate.value;
    const endDate = event.target.endDate.value;
    const users: UserID[] = [];
    workers?.forEach((worker) => {
      users.push(worker.worker);
    });

    const landmarks: LandmarkSpecification = currentLandMarks;
    const images = {
      toAnnotate: [{ imageId: '0', annotator: null }],
      toVerify: [{ imageId: '0', annotator: null, verifier: null }],
      done: [{ imageId: '0', annotator: null, verifier: null }],
    };
    setProject({
      id: 'createProjectId', name, client, startDate, endDate, users, status: 'inProgress', landmarks, images,
    });

    event.preventDefault();
  };

  function handleLandmarksButton(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: number,
  ) {
    const selected = currentLandMarks.includes(value);

    if (!document.querySelector('#step2')?.classList.contains('bg-black')) {
      document.querySelector('#step2')?.classList.add('bg-black', 'text-white');
      document.querySelector('#step2')?.classList.remove('text-gray-600');
    }
    if (selected) {
      const newState: number[] = Array.from(currentLandMarks);
      newState.splice(newState.indexOf(value), 1);
      setLandMarks(newState);
    } else {
      const newState: number[] = Array.from(currentLandMarks);
      newState.push(value);
      setLandMarks(newState);
    }
  }

  useEffect(() => {
    if (project && user) {
      // the projectManager creating the project is assigned to it
      createProject(project.name, project.client, project.landmarks)
        .then((id) => { addUserToProject(user.id, id); navigate('/dashboard'); });
    }
  }, [project]); // dependency added

  function handleLandmarksCheckbox(
    event: any,
    values: number[],
  ) {
    if (!document.querySelector('#step2')?.classList.contains('bg-black')) {
      document.querySelector('#step2')?.classList.add('bg-black', 'text-white');
      document.querySelector('#step2')?.classList.remove('text-gray-600');
    }
    console.log(event.target.checked);
    if (!event.target.checked) {
      setLandMarks(currentLandMarks.filter((value) => !values.includes(value)));
    } else {
      const newState: number[] = Array.from(currentLandMarks);
      newState.push(...values);
      setLandMarks(newState);
    }
  }

  const landmarkColor = (id: number) => {
    if (currentLandMarks.includes(id)) {
      return { fill: '#525252' };
    }
    return { stroke: '#000000' };
  };

  const range = (n1: number, n2?: number): number[] => {
    if (n2 === undefined) {
      return Array.from({ length: n1 }, (x, i) => i);
    }
    if (n2 <= n1) { return []; }
    return Array.from({ length: n2 - n1 }, (x, i) => i + n1);
  };

  const landmarkButton = (i: number) => (
    <button
      type="button"
      id={`b${i}`}
      onClick={(e) => handleLandmarksButton(e, i)}
      className={`hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l ${
        currentLandMarks.includes(i) ? 'bg-green-300' : 'bg-gray-300'
      }`}
    >
      {i}
    </button>
  );

  const landmarkCheckbox = (landmarks: number[]) => {
    console.log({ landmarks, currentLandMarks, every: landmarks.every((i) => currentLandMarks.includes(i)) });
    return (
      <input
        type="checkbox"
        className="mr-2"
        checked={landmarks.every((i) => currentLandMarks.includes(i))}
        onChange={(event) => handleLandmarksCheckbox(event, landmarks)}
      />
    );
  };

  return (
    <div className="h-full w-full">
      <Header title="Creating new project" />
      <div className="h-full grid grid-flow-col auto-cols-max gap-4">
        <div>
          <div className="h-full py-6">
            <div className="h-full flex flex-col">
              <div className="" style={{ height: '10%' }}>
                <div className="relative mb-2 flex flex-row">
                  <div id="step1" className="w-8 h-8 ml-10 mr-2 bg-black rounded-full text-lg text-white flex items-center">
                    <span className="text-center text-white w-full">
                      1
                    </span>
                  </div>
                  <div className="text-xs text-center mt-auto mb-auto">GENERAL INFORMATION</div>
                </div>
                <div className="h-2/4 ml-auto mr-auto w-1 bg-gray-300">
                  <div
                    className={`h-full w-1 ${'bg-black'}`}
                  />
                </div>
              </div>

              <div className="" style={{ height: '50%' }}>
                <div className="relative mb-2 flex flex-row">
                  <div id="step2" className="w-8 h-8 ml-10 mr-2 text-gray-600 rounded-full text-lg text-white flex items-center">
                    <span className="text-center w-full">
                      2
                    </span>
                  </div>
                  <div className="text-xs text-center mt-auto mb-auto">LANDMARKS</div>
                </div>
                <div className="h-3/4 ml-auto mr-auto w-1 bg-gray-300">
                  <div
                    className={`h-full w-1 ${'bg-black'}`}
                  />
                </div>
              </div>

              <div className="" style={{ height: '20%' }}>
                <div className="relative mb-2 flex flex-row">

                  <div id="step3" className="w-8 h-8 ml-10 mr-2 bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                    <span className="text-center text-gray-600 w-full">
                      3
                    </span>
                  </div>
                  <div className="text-xs text-center mt-auto mb-auto">WORKERS</div>
                </div>
                <div className="h-2/4 ml-auto mr-auto w-1 bg-gray-300">
                  <div
                    className={`h-full w-1 ${'bg-black'}`}
                  />
                </div>
              </div>

              <div className="" style={{ height: '10%' }}>
                <div className="relative mb-2 flex flex-row">

                  <div id="step4" className="w-8 h-8 ml-10 mr-2 bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                    <span className="text-center text-gray-600 w-full">
                      4
                    </span>
                  </div>
                  <div className="text-xs text-center mt-auto mb-auto">PRICING MODEL</div>
                </div>
                <div className="h-2/4 ml-auto mr-auto w-1 bg-gray-300">
                  <div
                    className={`h-full w-1 ${'bg-black'}`}
                  />
                </div>
              </div>

              <div className="">
                <div className="relative mb-2 flex flex-row">

                  <div id="step5" className="w-8 h-8 ml-10 mr-2 bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                    <span className="text-center text-gray-600 w-full">
                      5
                    </span>
                  </div>
                  <div className="text-xs text-center mt-auto mb-auto">MEDIA STORAGE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* middle column */}
        <div>
          <form className="text-left w-full mx-auto max-w-lg" onSubmit={handleSubmit}>
            <div className="flex  -mx-3 mb-6">
              <div className="w-full md:w-2/4 px-1 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                  Project Name
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder="Jane" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-1">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="client">
                  Client
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="gclient" name="client" type="text" placeholder="Doe" />
                </label>
              </div>
              <div className="w-full md:w-2/4 px-1 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="startDate">
                  Start Date
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="startDate" name="startDate" type="date" />
                </label>
              </div>
              <div className="w-full md:w-2/4 px-1">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endDate">
                  End Date
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="endDate" name="endDate" type="date" />
                </label>
              </div>
            </div>
            <div className="-mx-3 mb-6">
              <div className="w-full">
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Select the features that will need to be annotated
                </span>
              </div>
              <div className="flex">
                {landmarkCheckbox(range(1, 69))}
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  All
                </span>
              </div>
              <div className="flex">
                {landmarkCheckbox(range(1, 18))}
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Face Contour
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(1, 18).map(landmarkButton)}
              </div>
              <br />
              <div className="inline-flex space-x-4">
                <div className="left-brow">
                  <div className="flex">
                    {landmarkCheckbox(range(18, 23))}
                    <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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
                    <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Right Brow
                    </span>
                  </div>
                  <div className="inline-flex">
                    {range(23, 28).map(landmarkButton)}
                  </div>
                </div>
              </div>
              <br />
              <br />
              {' '}
              <div className="flex">
                {landmarkCheckbox(range(28, 37))}
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Nose
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(28, 37).map(landmarkButton)}
              </div>
              <br />
              <div className="inline-flex space-x-4">
                <div className="left-eye">
                  <div className="flex">
                    {landmarkCheckbox(range(37, 43))}
                    <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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
                    <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Right Eye
                    </span>
                  </div>
                  <div className="inline-flex">
                    {range(43, 49).map(landmarkButton)}
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div className="flex">
                {landmarkCheckbox(range(49, 69))}
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Mouth
                </span>
              </div>
              <div className="flex flex-wrap">
                {range(49, 69).map(landmarkButton)}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full">
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Select workers for the project
                </span>
              </div>
              <div className="w-full flex flex-col space-x-4 md:w-2/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                  Workers
                  {workers.map((worker, index) => (
                    <div className="relative" key={`workers.user${worker.id}`}>
                      <select
                        className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`worker-${index}`}
                        name={`users[${index}].id`}
                        onChange={(e) => {
                          const newState = Array.from(workers);
                          newState[index].worker = e.currentTarget.value;
                          setWorkers(newState);
                        }}
                      >
                        <option value={0}>Select a user</option>
                        {/* {allUsers?.filter((u) => workers
                          .find((w) => w.worker === u.id) === undefined)
                          .map((u) => 
                          (<option value={u.id}>{`${u.name} - ${u.role}`}</option>))} */}
                        {allUsers?.map((u) => (<option key={u.name} value={u.id}>{`${u.name} - ${u.role}`}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ))}
                </label>

                <button type="button" id="btn-add-worker" onClick={() => { setWorkers(workers.concat({ id: workers.length, worker: '' })); }} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l">
                  Add Worker
                </button>
              </div>
              {/* <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide 
                text-gray-700 text-xs font-bold mb-2" 
                htmlFor="grid-Worker-role">
                  Role
                  {workers.map((worker, index) => (
                    <div className="relative" key={`workers.role${worker.id}`}>
                      <select
                        className="block appearance-none w-full bg-gray-50 border
                                  border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight 
                                  focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`workerRole-${index}`}
                        name={`users[${index}].role`}
                        onChange={(e) => {
                          const newState = Array.from(workers);
                          newState[index].role = e.currentTarget.value;
                          setWorkers(newState);
                        }}
                      >
                        <option value="finance">Financier</option>
                        <option value="annotator">Annotator</option>
                        <option value="verifier">Verifier</option>
                      </select>
                      <div className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ))}
                </label> 
              </div> */}
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full">
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Payment params
                </span>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Role
                </span>
                <div className="w-full relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Financial
                </div>
                <div className="w-full relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Annotator
                </div>
                <div className="w-full relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Verifier
                </div>
              </div>
              <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Param
                </span>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerH" name="paymentPerH" type="number" placeholder="Payment per hour" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerAnnotation" name="paymentPerAnnotation" type="number" placeholder="Payment per annotation" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerVerification" name="paymentPerVerification" type="number" placeholder="Payment per Verification" />

              </div>
            </div>
            <div className="flex flex-wrap space-x-1">
              <button className="bg-black hover:bg-gray-700 text-gray-200 font-bold rounded-full py-1 px-2" type="button">
                Connect Remote Storage
              </button>
              <button className="bg-black hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2" type="button">
                Create Storage and Upload Media
              </button>
            </div>

            <button
              className="bg-black hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        {/* right column */}
        <div>
          <div className=" h-full mt-40">
            <AnnotatedImage image={templateImage} landmarkColor={landmarkColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
