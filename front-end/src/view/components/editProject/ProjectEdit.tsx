import React, { useState } from 'react';
import Header from '../shared/layout/Header';

export default function ProjectEdit() {
  const [FILES, setFILES] = useState({} as {
    [id: string]: {},
  });
  let empty = document.getElementById('empty');

  console.log(FILES);
  function addFile(target: any, file: any) {
    const objectURL = window.URL.createObjectURL(new File(Array.from(file), file.name));
    empty = document.getElementById('empty');
    empty?.classList.add('hidden');

    const TempFiles = {} as {
      [id: string]: {},
    };
    TempFiles[objectURL] = file;
    setFILES(TempFiles);
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

  function getEventTarget(e: any) {
    const ev = e || window.event;
    return ev.target || ev.srcElement;
  }

  if (gallery != null) {
    gallery.onclick = function (event) {
      const target = getEventTarget(event);
      if (target?.classList.contains('delete')) {
        const ou = target.dataset.target;
        document.getElementById(ou)?.remove();
        if (gallery?.children.length === 1) empty?.classList.remove('hidden');
        delete FILES[ou];
      }
    };
  }

  // clear entire selection
  function onCancelClick() {
    while (gallery !== undefined
      && (gallery?.children !== undefined
      && (gallery?.children.length > 0))) {
      gallery?.lastChild?.remove();
    }
    setFILES({});
    empty?.classList.remove('hidden');
    gallery?.append(empty ?? '');
  }

  const keys = Object.keys(FILES);
  const tabFilesPreview: any = [];

  keys.forEach((key) => {
    tabFilesPreview.push(FILES[key]);
  });

  return (
    <div className="h-full w-full">
      <Header title="This is page kk" />
      {/* <!-- file upload modal -->  */}
      <article aria-label="File Upload Modal" className="relative h-full flex flex-col bg-white shadow-xl rounded-md">
        {/* <!-- overlay --> */}
        <div id="overlay" className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md">
          <i>
            <svg className="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
            </svg>
          </i>
          <p className="text-lg text-blue-700">Drop files to upload</p>
        </div>

        {/* <!-- scroll area -->  */}
        <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
          <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
            <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
              <span>Drag and drop your</span>
              <span>files anywhere or</span>
            </p>
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
            {tabFilesPreview.map((file: any) => {
              const objectURL = window.URL.createObjectURL(new File(Array.from(file), file.name));
              return (
                <li id={objectURL} key={objectURL} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                  <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
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
                        {/* onClick={() => deleteFile(objectURL)} */}
                        <button type="button" className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
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

        {/* <!-- sticky footer -->  */}
        <footer className="flex justify-end px-8 pb-8 pt-4">
          <button
            type="button"
            id="submit"
            onClick={() => {
              alert(`Submitted Files:\n${JSON.stringify(FILES)}`);
              console.log(FILES);
            }}
            className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
          >
            Upload now
          </button>
          <button type="button" id="cancel" onClick={onCancelClick} className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
            Cancel
          </button>
        </footer>
      </article>
    </div>
  );
}
