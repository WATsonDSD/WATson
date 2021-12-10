import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  findProjectById, getUsersOfProject, Image, User,
} from '../../../data';
import useData from '../../../data/hooks';
import { getImages } from '../../../data/images';
// import { findImageById } from '../../../data/images';
import Header from '../shared/layout/Header';
import ImageDnD from './ImageDnD';
import UserCardDnD from './UserCardDnD';

export default function ProjectAssign() {
  const [toAnnotate, setToAnnotate] = useState([] as {user:string, image:string, url: string}[]);
  const [toVerify, setToVerify] = useState([] as {user:string, image:string, url: string}[]);
  const [imagesToAnnotate, setImagesToAnnotate] = useState([] as Image[]);
  const [imagesToVerify, setImagesToVerify] = useState([] as Image[]);

  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));
  let projectUsers: User[] = [];

  useEffect(() => {
    getImages(idProject || '', 'toAnnotate').then((result) => { setImagesToAnnotate(result); });
    getImages(idProject || '', 'toVerify').then((result) => { setImagesToVerify(result); });
    getUsersOfProject(idProject || '').then((result) => { projectUsers = result; });
  }, []);

  console.log(imagesToAnnotate);
  console.log(imagesToVerify);

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
      const imageUrl = URL.createObjectURL(newPictureList.find((e) => e.id === id)?.data);
      const imageIndex = newPictureList.findIndex((e) => e.id === id);
      newPictureList.splice(imageIndex, 1);
      setImagesToAnnotate(newPictureList);
      // updateToAnnotate 
      updateToAnnotate({ user: userId, image: id, url: imageUrl });
    } else {
      // Remove pic from to annotate pictures
      const newPictureList = Array.from(imagesToVerify);
      const imageUrl = URL.createObjectURL(newPictureList.find((e) => e.id === id)?.data);
      const imageIndex = newPictureList.findIndex((e) => e.id === id);
      newPictureList.splice(imageIndex, 1);
      setImagesToVerify(newPictureList);
      // update to verify
      updateToVerify({ user: userId, image: id, url: imageUrl }); // remove picture from to verify list
    }
  };

  const handleSubmit = () => {
    console.log('submit');
    console.log(toVerify);
    console.log(toAnnotate);
  };

  return (
    <div className="min-h-full w-full">
      <Header title={`Assigning images : ${project?.name ?? ''}`} />
      <h1 className="ml-2 pl-2 mt-3 text-gray-800 text-2xl font-bold ">Drag and drop images to assign them :</h1>

      <div className="flex flex-row">
        <div className="rounded-lg shadow-xl bg-gray-50 ">
          <header className="font-semibold text-sm py-3 px-4">
            Images to annotate
          </header>
          <div className="Pictures flex flex-row gap-2">
            {imagesToAnnotate.map((image) => <ImageDnD key={image.id} url={URL.createObjectURL(image.data)} id={image.id} />)}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          { projectUsers.filter((user) => user.role === 'annotator').map((user, index) => (
            <UserCardDnD key={user} userId={user} accept="image" images={toAnnotate.filter((e) => e.user === user.id)} onDrop={(item: any) => handleDrop(index, item, user.id, 'annotate')} />
          ))}
        </div>
      </div>
      <h1 className="ml-2 pl-2 mt-3 text-gray-800 text-2xl font-bold ">Drag and drop images to assign them :</h1>

      <div className="flex flex-row">
        <div className="rounded-lg shadow-xl bg-gray-50">
          <header className="font-semibold text-sm py-3 px-4">
            Images to verify
          </header>
          <div className="Pictures flex flex-row gap-2">
            {imagesToVerify.map((image) => <ImageDnD key={image.id} url={URL.createObjectURL(image.data)} id={image.id} />)}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          { projectUsers.filter((user) => user.role === 'verifier').map((user, index) => (
            <UserCardDnD key={user} userId={user} accept="image" images={toVerify.filter((e) => e.user === user.id)} onDrop={(item: any) => { console.log(item); handleDrop(index, item, user.id, 'verify'); }} />
          ))}
        </div>
      </div>
      <button
        className="bg-black mr-2 hover:bg-gray-800 text-gray-200 font-bold rounded-full py-1 px-2"
        type="button"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
