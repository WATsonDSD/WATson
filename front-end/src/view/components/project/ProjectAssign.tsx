import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  findProjectById, getUsersOfProject, Image, User,
} from '../../../data';
import useData from '../../../data/hooks';
import {
  assignAnnotatorToImage, assignVerifierToImage, getImagesOfProject,
} from '../../../data/images';
// import { findImageById } from '../../../data/images';
import Header from '../shared/layout/Header';
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

  useEffect(() => {
    getImagesOfProject(idProject || '', 'needsAnnotatorAssignment').then((result) => { setImagesToAnnotate(result); });
    getImagesOfProject(idProject || '', 'needsVerifierAssignment').then((result) => { setImagesToVerify(result); showAssignedImages(result, 'annotate'); });
    getImagesOfProject(idProject || '', 'pending').then((result) => { showAssignedImages(result, 'annotate'); showAssignedImages(result, 'verify'); });
    getUsersOfProject(idProject || '').then((result) => { setProjectUsers(result); });
  }, []);

  const showAssignedImages = (images: Image[], role: string) => {
    if (role === 'annotate') {
      images.forEach(async (image: Image) => {
        updateToAnnotate({ user: image.idAnnotator, image: image.id, data: image.data });
      });
    } else {
      images.forEach(async (image: Image) => {
        updateToVerify({ user: image.idVerifier, image: image.id, data: image.data });
      });
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
      await assignAnnotatorToImage(toAnnotate[i].image, toAnnotate[i].user, project?.id || '');
    }

    for (let i = 0; i < toVerify.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await assignVerifierToImage(toVerify[i].image, toVerify[i].user, project?.id || '');
    }

    navigate(Paths.Projects);
  };

  return (
    <div className="min-h-full w-full">
      <Header title={`Assigning images : ${project?.name ?? ''}`} />
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
              <UserCardDnD key={`${user.id}-annotator`} userId={user.id} accept="annotate" images={toAnnotate.filter((e) => e.user === user.id)} onDrop={(item: any) => handleDrop(index, item, user.id, 'annotate')} />
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
              <UserCardDnD key={`${user.id}-verifier`} userId={user.id} accept="verify" images={toVerify.filter((e) => e.user === user.id)} onDrop={(item: any) => { handleDrop(index, item, user.id, 'verify'); }} />
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
