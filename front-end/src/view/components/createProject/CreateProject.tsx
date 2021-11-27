import React, { useState } from 'react';
import Header from '../shared/layout/Header';

function handleLandmarksButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  const selected = (event.target as Element).classList.contains('bg-green-300');

  if (!document.querySelector('#step2')?.classList.contains('bg-black')) {
    document.querySelector('#step2')?.classList.add('bg-black', 'text-white');
    document.querySelector('#step2')?.classList.remove('text-gray-600');
  }
  if (selected) {
    (event.target as Element).classList.remove('bg-green-300');
  } else {
    (event.target as Element).classList.add('bg-green-300');
  }
  // TODO highlight landmark point corresponding 
}

export default function CreateProject() {
  const [workers, setWorkers] = useState([{ id: 0, worker: '', role: 'annotator' }]);

  return (
    <div className="h-full w-full">
      <Header title="Creating new project" />
      <div className="h-full grid grid-flow-col auto-cols-max gap-4">
        <div className="">
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
        <div>
          <form className="text-left w-full mx-auto max-w-lg">
            <div className="flex  -mx-3 mb-6">
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Project Name
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  Client
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Start Date
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="date" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  End Date
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="date" />
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
                <button type="button" id="b1" value={1} onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  1
                </button>
                <button type="button" id="b2" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  2
                </button>
                <button type="button" id="b3" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  3
                </button>
                <button type="button" id="b4" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  4
                </button>
                <button type="button" id="b4" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  5
                </button>
                <button type="button" id="b6" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  6
                </button>
                <button type="button" id="b7" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  7
                </button>
                <button type="button" id="b8" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  8
                </button>
                <button type="button" id="b9" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  9
                </button>
                <button type="button" id="b10" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  10
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  11
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  12
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  13
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  14
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  15
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  16
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      18
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      19
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      20
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      21
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      23
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      24
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      25
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      26
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                <button type="button" id="btn-1" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                  28
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  29
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  30
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  31
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  32
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  33
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  34
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  35
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                    <button type="button" id="btn-1" className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      37
                    </button>
                    <button type="button" className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      38
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      39
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      40
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      41
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                    <button type="button" id="btn-1" className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                      43
                    </button>
                    <button type="button" className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      44
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      45
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      46
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                      47
                    </button>
                    <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
                <button type="button" id="btn-1" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l rounded-r">
                  49
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  50
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  51
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  52
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  53
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  54
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  55
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  56
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  57
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  58
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  59
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  60
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  61
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  62
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  63
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  64
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  65
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  66
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
                  67
                </button>
                <button type="button" onClick={(e) => handleLandmarksButton(e)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r rounded-l">
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
              <div className="w-full flex flex-col space-x-4 md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                  Workers
                  {workers.map((worker) => (
                    <div className="relative" key={`workers.user${worker.id}`}>
                      <select className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                        <option>User 1</option>
                        <option>User 2</option>
                        <option>User 3</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ))}
                </label>

              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Worker-role">
                  Role
                  {workers.map((worker) => (
                    <div className="relative" key={`workers.role${worker.id}`}>
                      <select className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-workers-role">
                        <option>Financier</option>
                        <option>Annotator</option>
                        <option>Verifier</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ))}
                </label>

                <button type="button" id="btn-add-worker" onClick={() => { setWorkers(workers.concat({ id: workers.length, worker: '', role: '' })); }} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l">
                  Add Worker
                </button>
              </div>
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
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="number" placeholder="Payment per hour" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="number" placeholder="Payment per annotation" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="number" placeholder="Payment per Verification" />

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
          </form>
        </div>
        <div id="grid-col-3" />
      </div>
    </div>
  );
}
