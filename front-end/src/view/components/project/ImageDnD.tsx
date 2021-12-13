import React from 'react';
import { useDrag } from 'react-dnd';

function ImageDnD({ id, data, type }: any) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const url = URL.createObjectURL(data);
  return (
    <img
      ref={drag}
      src={url}
      width="80px"
      className="flex img-preview cursor-pointer sticky object-cover rounded-md bg-fixed"
      alt="imageAlT"
      style={{ border: isDragging ? '5px solid pink' : '0px' }}
    />
  );
}

export default ImageDnD;
