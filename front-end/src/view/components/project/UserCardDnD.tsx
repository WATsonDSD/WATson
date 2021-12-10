import React from 'react';
import { useDrop } from 'react-dnd';
import ImageDnD from './ImageDnD';
import { findUserById } from '../../../data';
import useData from '../../../data/hooks';

const UserCardDnD = ({
  accept,
  onDrop,
  images,
  userId,
}: any) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  console.log(images);
  const user = useData(() => findUserById(userId));

  const isActive = isOver && canDrop;

  let backgroundColor = 'bg-gray-50';
  if (isActive) {
    backgroundColor = 'bg-green-50';
  } else if (canDrop) {
    backgroundColor = 'bg-gray-100';
  }
  // console.log(images);
  return (
    <div className={`rounded-lg shadow-xl ${backgroundColor}`} ref={drop}>
      <div className="items-center justify-center">
        <header className="font-semibold text-sm py-3 px-4">
          {`${user?.name} (${user?.role})` }
        </header>
        {images.map((picture: any) => <ImageDnD key={picture.image} type={accept} data={picture.data} id={picture.image} />)}

      </div>
    </div>
  );
};
export default UserCardDnD;
