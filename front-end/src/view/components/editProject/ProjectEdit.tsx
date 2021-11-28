import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';

export default function ProjectEdit() {
  const [FILES, setFILES] = useState({} as {
    [id: string]: {},
  });
  const { idProject } = useParams();
  let empty = document.getElementById('empty');

  const project = useData(async () => findProjectById(idProject ?? ''));

  console.log(project);
  function addFile(target: any, file: any) {
    const objectURL = window.URL.createObjectURL(new Blob([file]));
    empty = document.getElementById('empty');
    empty?.classList.add('hidden');
    const TempFiles = {} as {
      [id: string]: {},
    };
    TempFiles[objectURL] = file;
    setFILES((prevState) => ({
      ...prevState,
      [objectURL]: file,
    }));
  }

  let gallery = document.getElementById('gallery');

  function hiddenOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    gallery = document.getElementById('gallery');
    if (e.target.files != null) {
      Array.from(e.target.files).forEach((file: any) => {
        addFile(gallery, file);
      });
    }
  }

  function deleteFile(objectURL: any) {
    const state = { ...FILES };
    delete state[objectURL];
    console.log(state);
    setFILES(state);
  }

  // clear entire selection
  function onCancelClick() {
    empty = document.getElementById('empty');
    empty?.classList.remove('hidden');
    gallery?.append(empty ?? '');
    setFILES({});
  }

  const keys = Object.keys(FILES);
  const tabFilesPreview: any = [];
  const objURLs: any = [];

  console.log(keys);
  keys.forEach((key) => {
    tabFilesPreview.push(FILES[key]);
    objURLs.push(key);
  });

  return (
    <div className="h-full w-full">
      <Header title={`Adding and Assigning images : ${project?.id ?? ''}`} />
      <form aria-label="File Upload Modal" onSubmit={(e) => console.log(e.target)} className="relative h-full flex flex-col bg-white shadow-xl rounded-md">
        <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left ml-2">
          Adding images
        </span>
        <br />
        <section className="p-8 w-full flex flex-col">
          <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
            <input
              id="hidden-input"
              type="file"
              multiple
              className="hidden"
              onChange={hiddenOnChange}
            />
            <button type="button" id="button" onClick={() => document.getElementById('hidden-input')?.click()} className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
              Upload a file
            </button>
          </header>

          <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
            To Upload
          </h1>
          <ul
            id="gallery"
            className="flex flex-1 flex-wrap -m-1"
          >
            {tabFilesPreview.map((file: any, index: number) => {
              const objectURL = objURLs[index];
              console.log(tabFilesPreview);
              return (
                <li key={objectURL} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                  <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-black shadow-sm">
                    <img src={objectURL} alt={file.name} className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />

                    <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                      <h1 className="flex-1">{file.name}</h1>
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
                                  file.size > 1048576
                                    ? `${Math.round(file.size / 1048576)}mb`
                                    : `${Math.round(file.size / 1024)}kb`
              }
                          {
                                  file.size < 1024 ? `${file.size}b` : ''
                              }
                        </p>
                        <button onClick={() => deleteFile(objectURL)} type="button" className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
                          <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                          </svg>
                        </button>
                      </div>
                    </section>
                  </article>
                </li>
              );
            })}
            <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center items-center">
              <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
              <span className="text-small text-gray-500">No files selected</span>
            </li>
          </ul>
        </section>
        <span className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left ml-2">
          Assigning images to workers
        </span>
        <br />
        <div className="flex flex-wrap mb-2">
          <div className="w-full flex flex-col space-x-4 md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Worker-role">
              Worker
              {project?.users.map((worker) => (
                <div className="relative" key={worker}>
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" readOnly value={worker} />
                </div>
              ))}
            </label>
          </div>
          <div className="w-full  md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
              Number Of images
              {project?.users.map((worker) => (
                <div className="relative" key={`${worker}`}>
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" max={Object.keys(FILES).length} id={`${worker}-nbImages`} name={`${worker}-nbImages`} type="number" placeholder="Number of Images" />

                </div>
              ))}
            </label>
          </div>
        </div>

        <footer className="flex justify-end px-8 pb-8 pt-4">
          <button
            type="button"
            id="submit"
            onClick={() => {
              alert(`Submitted Files:\n${JSON.stringify(FILES)}`);
              console.log(FILES);
            }}
            className="bg-black hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2"
          >
            Upload And assign now
          </button>
          <button type="button" id="cancel" onClick={onCancelClick} className="bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2">
            Cancel
          </button>
        </footer>
      </form>
    </div>
  );
}
