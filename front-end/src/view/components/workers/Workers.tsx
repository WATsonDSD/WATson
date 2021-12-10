import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Header from '../shared/layout/Header';
import openModal from '../shared/layout/OpenModal';

export default function Workers() {
  const button = (
    <button type="button" onClick={() => openModal(true, '#createUser')} className="bg-transparent hover:bg-gray-400 px-4 py-2 rounded text-black focus:outline-none">
      <AiOutlinePlus />
    </button>
  );
  return (
    <div className="h-full w-full">
      <Header title="Workers" button={button} />
    </div>
  );
}
