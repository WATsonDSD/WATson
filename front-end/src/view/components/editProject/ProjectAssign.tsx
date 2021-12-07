import React, { useCallback, useState } from 'react';
// import { useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import ImageDnD from './ImageDnD';
import UserCardDnD from './UserCardDnD';

const PictureList = [
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
];
export default function ProjectAssign() {
  const [board, setBoard] = useState([] as {}[]);

  const { idProject } = useParams();
  const project = useData(async () => findProjectById(idProject ?? ''));

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'image',
  //   drop: (item: any) => addImageToBoard(item.id),
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }));

  const handleDrop = useCallback(
    (index: number, item: { id: string }) => {
      const { id } = item;
      console.log(id);
      // TODO handle drop
      addImageToBoard(id);
    },
    [],
  );

  const addImageToBoard = (id: any) => {
    const pictureList = PictureList.filter((picture) => id === picture.id);
    setBoard(() => [...board, pictureList[0]]);
  };

  return (
    <div className="min-h-full w-full">
      <Header title={`Assigning images : ${project?.name ?? ''}`} />
      <div className="rounded-lg shadow-xl bg-gray-50 ">
        <header className="font-semibold text-sm py-3 px-4">
          Images to annotate
        </header>
        <div className="Pictures flex flex-row gap-2">
          {PictureList.map((picture) => <ImageDnD url={picture.url} id={picture.id} />)}
        </div>
      </div>
      <div className="flex flex-row gap-4">
        { project?.users.map((user, index) => (
          <UserCardDnD userId={user} accept="image" images={board} onDrop={(item: any) => handleDrop(index, item)} />
        ))}
      </div>

      <div className="rounded-lg shadow-xl bg-gray-50">
        <header className="font-semibold text-sm py-3 px-4">
          Images to verify
        </header>
        <div className="Pictures flex flex-row gap-2">
          {PictureList.map((picture) => <ImageDnD url={picture.url} id={picture.id} />)}
        </div>
      </div>
    </div>
  );
}
