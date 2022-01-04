import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createWorkersLink,
  findProjectById, findUserById, getUsersOfProject, Image, User,
} from '../../../data';
import useData from '../../../data/hooks';
import { assignBlockToAnnotator, getPendingImagesFromProject } from '../../../data/images';
// import { findImageById } from '../../../data/images';
import Header from '../shared/header';
import { Paths } from '../shared/routes';
import ImageDnD from './ImageDnD';
import UserCardDnD from './UserCardDnD';

export default function ProjectAssign() {
  const [toAnnotate, setToAnnotate] = useState([] as {user:string, image:string, data: Blob}[]);
  const [toVerify, setToVerify] = useState([] as {user:string, image:string, data: Blob}[]);
  const [imagesToAnnotate, setImagesToAnnotate] = useState([] as Image[]);
  const [imagesToVerify, setImagesToVerify] = useState([] as Image[]);
  const [projectUsers, setProjectUsers] = useState([] as User[]);

  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));
  const navigate = useNavigate();

  console.log(imagesToAnnotate);
  useEffect(() => {
    getPendingImagesFromProject(idProject || '').then((result) => {
      console.log(result);
      setImagesToAnnotate(result!);
    });
    getUsersOfProject(idProject || '').then((result) => { setProjectUsers(result!); });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showAssignedImages = (images: Image[], role: string) => {
    if (role === 'annotate') {
      images.forEach((image: Image) => {
        updateToAnnotate({ user: image.annotatorID, image: image.id, data: image.data });
      });
    } else {
      images.forEach((image: Image) => {
        updateToVerify({ user: image.verifierID, image: image.id, data: image.data });
      });
    }
  };

  const handleAssign = async (event: any) => {
    event.preventDefault();

    const annotator = event.target.annotator.value;
    const verifier = event.target.verifier.value;
    const nbImages = event.target.numberImages.value;
    const ann = await findUserById(annotator);
    console.log(annotator);
    console.log(verifier);
    console.log(nbImages);
    console.log('LENGHT OF IMAGES TO ANNOTATE', ann.projects[idProject!].assignedAnnotations.length);
    console.log('PROJECT BLOCKS', project!.images.blocks);
    console.log('numberFoImages', nbImages);
    console.log('lenght', (project!.linkedWorkers.filter((e) => e.annotatorID === annotator && e.verifierID === verifier).length));
    console.log(project?.linkedWorkers);
    console.log('project id:', idProject);

    if (!idProject) { throw Error('no project id!'); }

    await assignBlockToAnnotator(nbImages, annotator, idProject ?? '');
    if (verifier !== '0') {
      await createWorkersLink(idProject ?? '', annotator, verifier);
    }
  };

  const onCancelClick = () => {
    navigate(Paths.Projects);
  };

  const updateToAnnotate = (newElement: any) => {
    setToAnnotate((prevState) => [...prevState, newElement]);
  };

  const updateToVerify = (newElement: any) => {
    setToVerify((prevState) => [...prevState, newElement]);
  };

  const handleDrop = (index: number, item: { id: string}, userId: string, action: 'annotate' | 'verify') => {
    const { id } = item;
    if (action === 'annotate') {
      // Remove pic from to annotate pictures
      const newPictureList = Array.from(imagesToAnnotate);
      const selected = newPictureList.find((e) => e.id === id);
      const data = selected ? selected.data : toAnnotate.find((e) => e.image === id)?.data;
      const imageIndex = newPictureList.findIndex((e) => e.id === id);
      if (selected) {
        newPictureList.splice(imageIndex, 1);
      } else {
        toAnnotate.splice(toAnnotate.findIndex((e) => e.image === id), 1);
      }
      setImagesToAnnotate(newPictureList);
      // updateToAnnotate 
      updateToAnnotate({ user: userId, image: id, data });
    } else {
      // Remove pic from to annotate pictures
      const newPictureList = Array.from(imagesToVerify);
      const selected = newPictureList.find((e) => e.id === id);
      const data = selected ? selected.data : toVerify.find((e) => e.image === id)?.data;
      const imageIndex = newPictureList.findIndex((e) => e.id === id);
      if (selected) {
        newPictureList.splice(imageIndex, 1);
      } else {
        toVerify.splice(toVerify.findIndex((e) => e.image === id), 1);
      }
      setImagesToVerify(newPictureList);
      // update to verify
      updateToVerify({ user: userId, image: id, data }); // remove picture from to verify list
    }
  };

  const handleSubmit = async () => {
    for (let i = 0; i < toAnnotate.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      // await assignAnnotatorToImage(toAnnotate[i].image, toAnnotate[i].user, project?.id || '');
    }
    for (let i = 0; i < toVerify.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      // await assignVerifierToImage(toVerify[i].image, toVerify[i].user, project?.id || '');

    }

    navigate(Paths.Projects);
  };

  return (
    <div className="min-h-full w-full">
      <Header title={`Assigning images : ${project?.name ?? ''}`} />
      <form className="w-full" onSubmit={handleAssign}>
        <div className="w-full flex flex-row space-x-4 md:w-2/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Number Of Images
            {' '}
            <div className="relative">
              <input required className="uuidppearance-none block w-fuluuidbg-gray-50 text-gray-700 border border-gray-50 rounded py-1 px-2 uuidading-tight" id="numberImages" name="numberImages" type="uuidmber" min="0" max={project?.images.pendingAssignments.length} />
              LEFT:
              {' '}
              {project?.images.pendingAssignments.length}
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
      </footer>
    </div>
  );
}
