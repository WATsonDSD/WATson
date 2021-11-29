import React, { useState } from 'react';
import Header from '../shared/layout/Header';
import { Project, UserID, LandmarkSpecification } from '../../../data/types';
import LandMarksImage from './LandMarksImage';
import {
  addUserToProject, createProject, getAllUsers, getLoggedInUser,
} from '../../../data';
import useData from '../../../data/hooks';

export default function CreateProject() {
  const user = useData(() => getLoggedInUser());
  const allUsers = useData(() => getAllUsers());
  const [workers, setWorkers] = useState([{ id: 0, worker: '' }]);
  const [currentLandMarks, setLandMarks] = useState([] as number[]);
  const [project, setProject] = useState<Project | null>(null);

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
    console.log(project);

    event.preventDefault();
  };

  function handleLandmarksButton(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: number,
  ) {
    const selected = (event.target as Element).classList.contains('bg-green-300');

    if (!document.querySelector('#step2')?.classList.contains('bg-black')) {
      document.querySelector('#step2')?.classList.add('bg-black', 'text-white');
      document.querySelector('#step2')?.classList.remove('text-gray-600');
    }
    if (selected) {
      (event.target as Element).classList.remove('bg-green-300');
      const newState: number[] = Array.from(currentLandMarks);
      newState.splice(newState.indexOf(value), 1);
      setLandMarks(newState);
    } else {
      (event.target as Element).classList.add('bg-green-300');
      const newState: number[] = Array.from(currentLandMarks);
      newState.push(value);
      setLandMarks(newState);
    }
    console.log(value);
    // TODO highlight landmark point corresponding 
  }

  console.log(currentLandMarks);
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
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                  Project Name
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder="Jane" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="client">
                  Client
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="gclient" name="client" type="text" placeholder="Doe" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="startDate">
                  Start Date
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="startDate" name="startDate" type="date" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3">
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
              {' '}
              <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Face Contour
              </span>
              <br />
              <div className="flex flex-wrap">
                <button type="button" id="b1" value={1} onClick={(e) => handleLandmarksButton(e, 1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  1
                </button>
                <button type="button" id="b2" onClick={(e) => handleLandmarksButton(e, 2)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  2
                </button>
                <button type="button" id="b3" onClick={(e) => handleLandmarksButton(e, 3)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  3
                </button>
                <button type="button" id="b4" onClick={(e) => handleLandmarksButton(e, 4)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  4
                </button>
                <button type="button" id="b4" onClick={(e) => handleLandmarksButton(e, 5)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  5
                </button>
                <button type="button" id="b6" onClick={(e) => handleLandmarksButton(e, 6)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  6
                </button>
                <button type="button" id="b7" onClick={(e) => handleLandmarksButton(e, 7)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  7
                </button>
                <button type="button" id="b8" onClick={(e) => handleLandmarksButton(e, 8)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  8
                </button>
                <button type="button" id="b9" onClick={(e) => handleLandmarksButton(e, 9)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  9
                </button>
                <button type="button" id="b10" onClick={(e) => handleLandmarksButton(e, 10)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  10
                </button>
                <button type="button" id="b11" onClick={(e) => handleLandmarksButton(e, 11)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  11
                </button>
                <button type="button" id="b12" onClick={(e) => handleLandmarksButton(e, 12)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  12
                </button>
                <button type="button" id="b13" onClick={(e) => handleLandmarksButton(e, 13)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  13
                </button>
                <button type="button" id="b14" onClick={(e) => handleLandmarksButton(e, 14)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  14
                </button>
                <button type="button" id="b15" onClick={(e) => handleLandmarksButton(e, 15)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  15
                </button>
                <button type="button" id="b16" onClick={(e) => handleLandmarksButton(e, 16)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  16
                </button>
                <button type="button" id="b17" onClick={(e) => handleLandmarksButton(e, 17)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  17
                </button>
              </div>
              <br />
              <div className="inline-flex space-x-4">

                <div className="left-brow">
                  <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Left Brow
                  </span>
                  <br />
                  <div className="inline-flex">
                    <button type="button" id="b18" onClick={(e) => handleLandmarksButton(e, 18)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      18
                    </button>
                    <button type="button" id="b19" onClick={(e) => handleLandmarksButton(e, 19)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      19
                    </button>
                    <button type="button" id="b20" onClick={(e) => handleLandmarksButton(e, 20)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      20
                    </button>
                    <button type="button" id="b21" onClick={(e) => handleLandmarksButton(e, 21)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      21
                    </button>
                    <button type="button" id="b22" onClick={(e) => handleLandmarksButton(e, 22)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      22
                    </button>
                  </div>
                </div>
                <div>
                  <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Right Brow
                  </span>
                  <br />
                  <div className="inline-flex">
                    <button type="button" id="b23" onClick={(e) => handleLandmarksButton(e, 23)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      23
                    </button>
                    <button type="button" id="b24" onClick={(e) => handleLandmarksButton(e, 24)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      24
                    </button>
                    <button type="button" id="b25" onClick={(e) => handleLandmarksButton(e, 25)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      25
                    </button>
                    <button type="button" id="b26" onClick={(e) => handleLandmarksButton(e, 26)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      26
                    </button>
                    <button type="button" id="b27" onClick={(e) => handleLandmarksButton(e, 27)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      27
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <br />
              {' '}
              <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Nose
              </span>
              <br />
              <div className="flex flex-wrap">
                <button type="button" id="b28" onClick={(e) => handleLandmarksButton(e, 28)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                  28
                </button>
                <button type="button" id="b29" onClick={(e) => handleLandmarksButton(e, 29)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  29
                </button>
                <button type="button" id="b30" onClick={(e) => handleLandmarksButton(e, 30)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  30
                </button>
                <button type="button" id="b31" onClick={(e) => handleLandmarksButton(e, 31)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  31
                </button>
                <button type="button" id="b32" onClick={(e) => handleLandmarksButton(e, 32)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  32
                </button>
                <button type="button" id="b33" onClick={(e) => handleLandmarksButton(e, 33)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  33
                </button>
                <button type="button" id="b34" onClick={(e) => handleLandmarksButton(e, 34)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  34
                </button>
                <button type="button" id="b35" onClick={(e) => handleLandmarksButton(e, 35)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  35
                </button>
                <button type="button" id="b36" onClick={(e) => handleLandmarksButton(e, 36)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  36
                </button>
              </div>
              <br />
              <div className="inline-flex space-x-4">

                <div className="left-eye">
                  <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Left Eye
                  </span>
                  <br />
                  <div className="inline-flex">
                    <button type="button" id="b37" onClick={(e) => handleLandmarksButton(e, 37)} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      37
                    </button>
                    <button type="button" id="b38" onClick={(e) => handleLandmarksButton(e, 38)} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      38
                    </button>
                    <button type="button" id="b39" onClick={(e) => handleLandmarksButton(e, 39)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      39
                    </button>
                    <button type="button" id="b40" onClick={(e) => handleLandmarksButton(e, 40)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      40
                    </button>
                    <button type="button" id="b41" onClick={(e) => handleLandmarksButton(e, 41)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      41
                    </button>
                    <button type="button" id="b42" onClick={(e) => handleLandmarksButton(e, 42)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      42
                    </button>
                  </div>
                </div>
                <div>
                  <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Right Eye
                  </span>
                  <br />
                  <div className="inline-flex">
                    <button type="button" id="b43" onClick={(e) => handleLandmarksButton(e, 43)} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      43
                    </button>
                    <button type="button" id="b44" onClick={(e) => handleLandmarksButton(e, 44)} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      44
                    </button>
                    <button type="button" id="b45" onClick={(e) => handleLandmarksButton(e, 45)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      45
                    </button>
                    <button type="button" id="b46" onClick={(e) => handleLandmarksButton(e, 46)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      46
                    </button>
                    <button type="button" id="b47" onClick={(e) => handleLandmarksButton(e, 47)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      47
                    </button>
                    <button type="button" id="b48" onClick={(e) => handleLandmarksButton(e, 48)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      48
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <br />

              <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Mouth
              </span>
              <br />
              <div className="flex flex-wrap">
                <button type="button" id="b49" onClick={(e) => handleLandmarksButton(e, 49)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                  49
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 50)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  50
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 51)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  51
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 52)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  52
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 53)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  53
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 54)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  54
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 55)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  55
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 56)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  56
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 57)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  57
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 58)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  58
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 59)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  59
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 60)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  60
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 61)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  61
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 62)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  62
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 63)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  63
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 64)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  64
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 65)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  65
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 66)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  66
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 67)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  67
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e, 68)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  68
                </button>
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
                        {allUsers?.filter((u) => workers
                          .find((w) => w.worker === u.id) === undefined)
                          .map((u) => (<option value={u.id}>{`${u.name} - ${u.role}`}</option>))}
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
              onClick={
                () => {
                  if (project && user) {
                    // the projectManager creating the project is assigned to it
                    createProject(project.name, project.client, project.landmarks)
                      .then((id) => { addUserToProject(user.id, id); });
                  }
                }
            }
            >
              Submit
            </button>
          </form>
        </div>
        {/* right column */}
        <div>
          {/* todo: add annotation points */}
          <div className=" h-full mt-40">
            <LandMarksImage LandMarks={currentLandMarks} />
          </div>
        </div>
      </div>
    </div>
  );
}
