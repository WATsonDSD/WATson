import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  UserID,
  getAllUsers,
  findProjectById,
  getUsersOfProject,
  getPendingImagesFromProject,
} from '../../../data';

import Header from '../shared/header';
import useData from '../../../data/hooks';

export default function EditProject() {
  const { idProject } = useParams();

  const allUsers = useData(() => getAllUsers());
  const projectdb = useData(async () => findProjectById(idProject!));

  const users = useData(async () => getUsersOfProject(projectdb!));
  const projectVer: { id: number, worker: string }[] = [];
  users?.filter((u) => u.role === 'verifier').forEach((user, index) => projectVer.push({ id: index, worker: user.uuid }));
  const projectAnn: { id: number, worker: string }[] = [];
  users?.filter((u) => u.role === 'annotator').forEach((user, index) => projectAnn.push({ id: index, worker: user.uuid }));
  const [verifiers, setVerifiers] = useState(projectVer || [{ id: 0, worker: '' }]);
  const [annotators, setAnnotators] = useState(projectAnn || [{ id: 0, worker: '' }]);
  // const [project, setProject] = useState< { name: string, client: string, users : UserID[], pricePerImageAnnotation: number,
  //     pricePerImageVerification: number,
  //     hourlyRateAnnotation: number,
  //     hourlyRateVerification: number} | null>({
  //       name: projectdb?.name || '',
  //       client: projectdb?.client || '',
  //       users: projectdb?.workers || [],
  //       pricePerImageAnnotation: projectdb?.pricePerImageAnnotation || 0,
  //       pricePerImageVerification: projectdb?.pricePerImageVerification || 0,
  //       hourlyRateAnnotation: projectdb?.hourlyRateAnnotation || 0,
  //       hourlyRateVerification: projectdb?.hourlyRateVerification || 0,
  //     });

  useEffect(() => {
    setAnnotators(projectAnn);
    setVerifiers(projectVer);
  }, []);

  const tabFilesPreview = useData(() => getPendingImagesFromProject(projectdb!));

  console.log(annotators);
  console.log(verifiers);
  const handleSubmit = (_event: any) => {
    // const name = event.target.name.value;
    // const client = event.target.client.value;
    // const startDate = event.target.startDate.value;
    // const endDate = event.target.endDate.value;
    // const pricePerImageAnnotation = event.target.paymentPerAnnotation.value;
    // const pricePerImageVerification = event.target.paymentPerVerification.value;
    // const hourlyRateAnnotation = event.target.paymentPerAnn.value;
    // const hourlyRateVerification = event.target.paymentPerVer.value;
    const users: UserID[] = [];
    annotators?.forEach((worker) => {
      users.push(worker.worker);
    });

    verifiers?.forEach((worker) => {
      users.push(worker.worker);
    });
  };

  function deleteFile(imageId: any) {
    console.log(`deleting ${imageId}`);
  }

  return (
    <div className="h-full w-full">
      <Header title="Editing project" />
      <div className="pl-20 h-full grid grid-flow-col auto-cols-max gap-4">
        <div>
          <form className="text-left w-full mx-auto max-w-lg" onSubmit={handleSubmit}>
            <div className="flex  -mx-3 mb-6">
              <div className="w-full md:w-2/4 px-1 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                  Project Name
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" defaultValue={projectdb?.name || ''} name="name" type="text" placeholder="Jane" />
                </label>
              </div>
              <div className="w-full md:w-1/4 px-1">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="client">
                  Client
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" defaultValue={projectdb?.client || ''} readOnly id="gclient" name="client" type="text" placeholder="Doe" />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 -mx-3 mb-2">
              <div className="w-full">
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Workers of the project
                </span>
              </div>
              <div className="w-full flex flex-col space-x-4 md:w-2/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                  Annotators
                  {annotators?.map((worker, index) => (worker.worker === '' ? (
                    <div className="relative" key={`workers.user${worker.id}`}>
                      <select
                        className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`worker-${index}`}
                        name={`users[${index}].id`}
                        onChange={(e) => {
                          const newState = Array.from(annotators);
                          newState[index].worker = e.currentTarget.value;
                          setAnnotators(newState);
                        }}
                      >
                        <option value={0}>Select a user</option>
                        {allUsers?.filter((u) => u.role === 'annotator' && !annotators.find((a) => a.worker === u.uuid)).map((u) => (<option key={u.name} value={u.uuid}>{`${u.name}`}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex" key={`workers.user${worker.id}`}>
                      <div className="w-5/6">
                        <input
                          className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight"
                          id={`worker-${index}`}
                          name={`users[${index}].id`}
                          type="text"
                          value={allUsers?.find((u) => u.uuid === worker.worker)?.name}
                          readOnly
                        />
                      </div>
                      <div className="w-1/6">
                        <button
                          type="button"
                          onClick={() => {
                            const newState = Array.from(annotators);
                            newState.splice(index, 1);
                            if (newState.length === 0) newState.push({ id: 0, worker: '' });
                            setAnnotators(newState);
                          }}
                          className=" bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )))}
                </label>

                <button type="button" id="btn-add-worker" onClick={() => { setAnnotators(annotators?.concat({ id: annotators.length, worker: '' })); }} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l">
                  Add Annotator
                </button>
              </div>
              <div className="w-full flex flex-col space-x-4 md:w-2/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                  Verifiers
                  {verifiers?.map((worker, index) => (worker.worker === '' ? (
                    <div className="relative" key={`workers.user${worker.id}`}>
                      <select
                        className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`worker-${index}`}
                        name={`users[${index}].id`}
                        onChange={(e) => {
                          const newState = Array.from(verifiers);
                          newState[index].worker = e.currentTarget.value;
                          setVerifiers(newState);
                        }}
                      >
                        <option value={0}>Select a user</option>
                        {allUsers?.filter((u) => u.role === 'verifier' && !verifiers.find((v) => v.worker === u.uuid)).map((u) => (<option key={u.name} value={u.uuid}>{`${u.name}`}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex" key={`workers.user${worker.id}`}>
                      <div className="w-5/6">
                        <input
                          className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight"
                          id={`worker-${index}`}
                          name={`users[${index}].id`}
                          type="text"
                          value={allUsers?.find((u) => u.uuid === worker.worker)?.name}
                          readOnly
                        />
                      </div>
                      <div className="w-1/6">
                        <button
                          type="button"
                          onClick={() => {
                            const newState = Array.from(verifiers);
                            delete newState[index];
                            if (newState.length === 0) newState.push({ id: 0, worker: '' });
                            setVerifiers(newState);
                          }}
                          className=" bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )))}
                </label>

                <button type="button" id="btn-add-worker" onClick={() => { setVerifiers(verifiers?.concat({ id: verifiers.length, worker: '' })); }} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l">
                  Add Verifier
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full">
                <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Payment params
                </span>
              </div>
              <div className="w-full md:w-2/5 px-2 mb-6 md:mb-0">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Payment
                </span>
                <div className="w-48 align-middle relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Annotator Hourly Rate
                </div>
                <div className="w-48 relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Verifier Hourly Rate
                </div>
                <div className="w-48 relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Price per Annotation
                </div>
                <div className="w-48 relative bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight">
                  Price per Verification
                </div>
              </div>
              <div className="w-full md:w-3/5 mb-6 md:mb-0">
                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  HRK
                </span>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerAnn" name="paymentPerAnn" defaultValue={projectdb?.hourlyRateAnnotation || ''} type="number" placeholder="Payment per hour per Annotator" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerVer" name="paymentPerVer" defaultValue={projectdb?.hourlyRateVerification || ''} type="number" placeholder="Payment per hour per Verifier" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerAnnotation" name="paymentPerAnnotation" defaultValue={projectdb?.pricePerImageAnnotation || ''} type="number" placeholder="Payment per Annotation" />
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="paymentPerVerification" name="paymentPerVerification" type="number" defaultValue={projectdb?.pricePerImageVerification || ''} placeholder="Payment per Verification" />

              </div>
            </div>
            <div className="flex flex-wrap space-x-1" />

            <button
              className="bg-black hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2"
              type="submit"
            >
              Modify
            </button>
          </form>
        </div>
        {/* right column */}
        <div>
          <h1 className="">
            Project Images :
          </h1>
          <div className="flex w-1/2 flex-wrap">
            {tabFilesPreview?.map((file: any) => {
              const objectURL = URL.createObjectURL(file.data);
              return (
                <div key={objectURL} className=" p-1 w-1/4 h-24">
                  <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-black shadow-sm">
                    <img src={objectURL} alt={file.id} className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />

                    <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                      <h1 className="flex-1">{file.id}</h1>
                      <div className="flex">
                        <span className="p-1">
                          <i>
                            <svg className="fill-current w-4 h-4 ml-auto pt-" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
                            </svg>
                          </i>
                        </span>

                        <p className="p-1 size text-xs">
                          {
                        file.data.size > 1048576
                          ? `${Math.round(file.data.size / 1048576)}mb`
                          : `${Math.round(file.data.size / 1024)}kb`
                        }
                          {
                        file.size < 1024 ? `${file.data.size}b` : ''
                        }
                        </p>
                        <button onClick={() => deleteFile(file.id)} type="button" className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
                          <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                          </svg>
                        </button>
                      </div>
                    </section>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}
