import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { logOut } from '../../../../data';
import openModal from './OpenModal';

export default function ModalSignOut() {
  return (
    <div id="signout" className="pacity-0 transform hidden -translate-y-full scale-150  relative bg-white rounded shadow-lg transition-opacity transition-transform duration-300">
      <button
        type="button"
        onClick={() => openModal(false, '#signout')}
        className="absolute -top-3 -right-3 bg-gray-500 hover:bg-gray-800 text-2xl w-10 h-10 rounded-full focus:outline-none text-white"
      >
        <h2 className="text-center ml-2 font-semibold text-gray-100">
          <AiOutlineClose />
        </h2>
      </button>
      <div className="px-4 py-3 border-b border-gray-200">
        <br />
        <h2 className="text-xl font-semibold text-gray-600">Do you really want to log out?</h2>
      </div>
      <div className="bottom-0 left-0 px-4 py-3 w-full flex justify-end items-center gap-3">
        <button className="bg-green-500 hover:bg-green-800 px-4 py-2 rounded text-white focus:outline-none" type="button" onClick={() => { logOut(); openModal(false, '#signout'); }}>
          Yes
        </button>
        <button
          type="button"
          onClick={() => openModal(false, '#signout')}
          className="bg-gray-500 hover:bg-gray-800 px-4 py-2 rounded text-white focus:outline-none"
        >
          No
        </button>
      </div>
    </div>
  );
}
