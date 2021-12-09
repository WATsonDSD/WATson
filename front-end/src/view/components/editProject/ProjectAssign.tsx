import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import { getImages } from '../../../data/images';
// import { findImageById } from '../../../data/images';
import Header from '../shared/layout/Header';
import ImageDnD from './ImageDnD';
import UserCardDnD from './UserCardDnD';

// const PictureList = [
//   {
//     id: 1,
//     url:
//       'https://yt3.ggpht.com/ytc/AAUvwnjOQiXUsXYMs8lwrd4litEEqXry1-atqJavJJ09=s900-c-k-c0x00ffffff-no-rj',
//   },
//   {
//     id: 2,
//     url:
//       'https://yt3.ggpht.com/pe57RF1GZibOWeZ9GwRWbjnLDCK2EEAeQ3u4iMAFNeaz-PN9uSsg1p2p32TZUedNnrUhKfoOuMM=s900-c-k-c0x00ffffff-no-rj',
//   },
// ];
export default function ProjectAssign() {
  const [toAnnotate, setToAnnotate] = useState([] as {user:string, image:string, url: string}[]);
  const [toVerify, setToVerify] = useState([] as {user:string, image:string, url: string}[]);
  const [PictureList, setpictureList] = useState([] as {id: number, url: string}[]);

  useEffect(() => {
    setpictureList([
      {
        id: 1,
        url:
          'https://yt3.ggpht.com/ytc/AAUvwnjOQiXUsXYMs8lwrd4litEEqXry1-atqJavJJ09=s900-c-k-c0x00ffffff-no-rj',
      },
      {
        id: 2,
        url:
          'https://yt3.ggpht.com/pe57RF1GZibOWeZ9GwRWbjnLDCK2EEAeQ3u4iMAFNeaz-PN9uSsg1p2p32TZUedNnrUhKfoOuMM=s900-c-k-c0x00ffffff-no-rj',
      },
    ]);
  }, []);

  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));

  const imagesToAnnotate = useData(async () => {
    getImages(idProject || '', 'toAnnotate');
  });
  const imagesToVerify = useData(async () => {
    getImages(idProject || '', 'toVerify');
  });
  console.log(imagesToAnnotate);
  console.log(imagesToVerify);

  const updateToAnnotate = (newElement: any) => {
    setToAnnotate((prevState) => [...prevState, newElement]);
  };

  const updateToVerify = (newElement: any) => {
    setToVerify((prevState) => [...prevState, newElement]);
  };

  const handleDrop = (index: number, item: { id: string, url: string }, userId: string, action: 'annotate' | 'verify') => {
    const { id, url } = item;
    if (action === 'annotate') {
      // Remove pic from to annotate pictures
      const newPictureList = Array.from(PictureList);
      const pic = newPictureList.findIndex((e) => e.id === Number(id));
      newPictureList.splice(pic, 1);
      setpictureList(newPictureList);
      // updateToAnnotate 
      updateToAnnotate({ user: userId, image: id, url });
    } else {
      // Remove pic from to annotate pictures
      const newPictureList = Array.from(PictureList);
      const pic = newPictureList.findIndex((e) => e.id === Number(id));
      newPictureList.splice(pic, 1);
      setpictureList(newPictureList);
      // update to verify
      updateToVerify({ user: userId, image: id, url }); // remove picture from to verify list
    }
    // TODO handle drop    
  };

  const handleSubmit = () => {
    console.log('submit');
    console.log(PictureList);
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
            {PictureList.map((picture) => <ImageDnD key={picture.id} url={picture.url} id={picture.id} />)}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          { project?.users.map((user, index) => (
            <UserCardDnD key={user} userId={user} accept="image" images={toAnnotate.filter((e) => e.user === user)} onDrop={(item: any) => handleDrop(index, item, user, 'annotate')} />
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
            {PictureList.map((picture) => <ImageDnD key={picture.id} url={picture.url} id={picture.id} />)}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          { project?.users.map((user, index) => (
            <UserCardDnD key={user} userId={user} accept="image" images={toVerify.filter((e) => e.user === user)} onDrop={(item: any) => { console.log(item); handleDrop(index, item, user, 'verify'); }} />
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
