import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';

import {
  Worker,
  // Image,
  findProjectById,
  getUsersOfProject,
  createAnnotatorVerifierLink,
  assignImagesToAnnotator,
  // getImagesOfProjectWithoutAnnotator,
} from '../../../data';

import useData from '../../../data/hooks';

// import ImageDnD from './ImageDnD';
// import UserCardDnD from './UserCardDnD';
import BackIcon from '../../../assets/icons/back.svg';

import { Paths } from '../shared/routes/paths';

export default function ProjectAssign() {
  const { idProject } = useParams();
  const navigate = useNavigate();

  if (!idProject) { throw Error('No project id!'); }

  const project = useData(async () => findProjectById(idProject));

  const inputRef = useRef<HTMLInputElement>(null);

  // const [toAnnotate, setToAnnotate] = useState([] as {user:string, image:string, data: Blob}[]);
  // const [toVerify, setToVerify] = useState([] as {user:string, image:string, data: Blob}[]);
  // const [imagesToAnnotate, setImagesToAnnotate] = useState([] as Image[]);
  // const [imagesToVerify, setImagesToVerify] = useState([] as Image[]);

  const [projectUsers, setProjectUsers] = useState<Worker[]>([]);

  const [assignedAssets] = useState<number>(0);

  const annotators = projectUsers ? projectUsers.filter((user) => user.role === 'annotator') : [];
  const verifiers = projectUsers ? projectUsers.filter((user) => user.role === 'verifier') : [];

  const links: { [annotatorID: string]: {verifierID: string, numberOfAssets: number}} = {};

  useEffect(() => {
    // getImagesOfProjectWithoutAnnotator(idProject).then((result) => {
    //   setImagesToAnnotate(result);
    // });

    getUsersOfProject(idProject).then((result) => {
      setProjectUsers(result);
    });
  }, []);

  // const handleAssign = async (event: any) => {
  //   event.preventDefault();

  //   const annotator = event.target.annotator.value;
  //   const verifier = event.target.verifier.value;
  //   const nbImages = event.target.numberImages.value;

  //   await assignImagesToAnnotator(nbImages, annotator, idProject);
  //   if (verifier !== '0') {
  //     await createAnnotatorVerifierLink(idProject, annotator, verifier);
  //   }
  // };

  // const updateToAnnotate = (newElement: any) => {
  //   setToAnnotate((prevState) => [...prevState, newElement]);
  // };

  // const updateToVerify = (newElement: any) => {
  //   setToVerify((prevState) => [...prevState, newElement]);
  // };

  // const handleDrop = (index: number, item: { id: string}, userId: string, action: 'annotate' | 'verify') => {
  //   const { id } = item;
  //   if (action === 'annotate') {
  //     // Remove pic from to annotate pictures
  //     const newPictureList = Array.from(imagesToAnnotate);
  //     const selected = newPictureList.find((e) => e.id === id);
  //     const data = selected ? selected.data : toAnnotate.find((e) => e.image === id)?.data;
  //     const imageIndex = newPictureList.findIndex((e) => e.id === id);
  //     if (selected) {
  //       newPictureList.splice(imageIndex, 1);
  //     } else {
  //       toAnnotate.splice(toAnnotate.findIndex((e) => e.image === id), 1);
  //     }
  //     setImagesToAnnotate(newPictureList);
  //     // updateToAnnotate 
  //     updateToAnnotate({ user: userId, image: id, data });
  //   } else {
  //     // Remove pic from to annotate pictures
  //     const newPictureList = Array.from(imagesToVerify);
  //     const selected = newPictureList.find((e) => e.id === id);
  //     const data = selected ? selected.data : toVerify.find((e) => e.image === id)?.data;
  //     const imageIndex = newPictureList.findIndex((e) => e.id === id);
  //     if (selected) {
  //       newPictureList.splice(imageIndex, 1);
  //     } else {
  //       toVerify.splice(toVerify.findIndex((e) => e.image === id), 1);
  //     }
  //     setImagesToVerify(newPictureList);
  //     // update to verify
  //     updateToVerify({ user: userId, image: id, data }); // remove picture from to verify list
  //   }
  // };

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

    Object.entries(links).map(async ([annotator, value]) => {
      await assignImagesToAnnotator(value.numberOfAssets, annotator, idProject);

      if (value.verifierID) {
        await createAnnotatorVerifierLink(idProject, annotator, value.verifierID);
      }
    });

    navigate(Paths.Projects);
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

      {/* <form className="w-full" onSubmit={handleAssign}>
        <div className="w-full flex flex-row space-x-4 md:w-2/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Number Of Images
            {' '}
            <div className="relative">
              <input required className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 leading-tight" id="numberImages" name="numberImages" type="number" min="0" max={project?.images.imagesWithoutAnnotator.length} />
              LEFT:
              {' '}
              {project?.images.imagesWithoutAnnotator.length}
            </div>
          </label>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Annotators
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="annotator"
                name="annotator"
              >
                <option value={0}>Select a user</option>
                {projectUsers?.filter((u) => u.role === 'annotator').map((u) => (<option key={u.name} value={u._id}>{`${u.name}`}</option>))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </label>

          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Verifiers
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-50 border border-gray-50 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="verifier"
                name="verifier"
              >
                <option value={0}>Select a user</option>
                {projectUsers?.filter((u) => u.role === 'verifier').map((u) => (<option key={u.name} value={u._id}>{`${u.name}`}</option>))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </label>

          <button type="submit" id="btn-assign" onClick={() => {}} className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l">
            Assign
          </button>
        </div>
      </form>
      <h1 className="ml-2 pl-2 mt-3 text-gray-800 text-3xl font-bold ">Drag and drop to assign :</h1>
      <div id="annotation" className="h-1/2 my-5">
        <h2 className="ml-2 pl-2 mt-3 text-gray-800 text-2xl font-bold ">Annotation :</h2>

        <div className="flex flex-row flex-wrap gap-4 h-full">
          <div className="flex flex-col rounded-lg shadow-xl bg-gray-50 ">
            <header className="font-semibold text-sm py-3 px-4">
              Images to annotate
            </header>
            <div className="Pictures grow shrink flex flex-col gap-2">
              {imagesToAnnotate.map((image) => <ImageDnD key={image.id} type="annotate" data={image.data} id={image.id} />)}
            </div>
          </div>
          <div className="flex flex-row grow shrink gap-4">
            { projectUsers.filter((user) => user.role === 'annotator' || user.role === 'verifier').map((user, index) => (
              <UserCardDnD key={`${user._id}-annotator`} userId={user._id} accept="annotate" images={toAnnotate.filter((e) => e.user === user._id)} onDrop={(item: any) => handleDrop(index, item, user._id, 'annotate')} />
            ))}
          </div>
        </div>
      </div>
      <br />
      <div id="verification" className="h-1/2 my-5">
        <h2 className="ml-2 pl-2 mt-3 text-gray-800 text-2xl font-bold ">Verification :</h2>
        <div className="flex flex-row flex-wrap gap-4 h-full">
          <div className="flex flex-col rounded-lg shadow-xl bg-gray-50 ">
            <header className="font-semibold text-sm py-3 px-4">
              Images to verify
            </header>
            <div className="Pictures grow shrink flex flex-col gap-2">
              {imagesToVerify.map((image) => <ImageDnD key={image.id} type="verify" data={image.data} id={image.id} />)}
            </div>
          </div>
          <div className="flex grow shrink flex-row gap-4">
            { projectUsers.filter((user) => user.role === 'verifier').map((user, index) => (
              <UserCardDnD key={`${user._id}-verifier`} userId={user._id} accept="verify" images={toVerify.filter((e) => e.user === user._id)} onDrop={(item: any) => { handleDrop(index, item, user._id, 'verify'); }} />
            ))}
          </div>
        </div>
      </div>
      <br />
      <footer className="flex justify-end pb-8 pt-4">

        <button
          className="bg-black right-2 ml-auto hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2"
          type="button"
          onClick={handleSubmit}
        >
          Assign images
        </button>
        <button type="button" id="cancel" onClick={onCancelClick} className="bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2">
          Cancel
        </button>
      </footer> */}
    </div>
  );
}
