import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useUserNotNull } from '../../../../data';
import openModal from './OpenModal';

export default function ModalEditProfile() {
  const [user] = useUserNotNull();
  return (
    <div id="edit" className="pacity-0 transform hidden -translate-y-full scale-150  relative bg-white rounded shadow-lg transition-opacity transition-transform duration-300">
      <button
        type="button"
        onClick={() => openModal(false, '#edit')}
        className="absolute -top-3 -right-3 bg-gray-500 hover:bg-gray-800 text-2xl w-10 h-10 rounded-full focus:outline-none text-white"
      >
        <h2 className="text-center ml-2 font-semibold text-gray-100">
          <AiOutlineClose />
        </h2>
      </button>
      {/* <!-- header --> */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-600">Edit Profile</h2>
      </div>
      <form className="w-full max-w-lg">
        {/* <!-- body --> */}
        <div className="w-full p-3 mt-5">

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-name">
                Name
                <input className="appearance-none block w-full mt-1 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder={user ? user.name : 'loading...'} />
              </label>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                Email
                <input type="email" className="appearance-none block w-full mt-1 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" name="email" value={user ? user.email : 'loading...'} readOnly />
              </label>
            </div>
          </div>
          <div className="relative">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-role">
              Role
              <input type="text" className="appearance-none block w-full mt-1 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="role" name="role" value={user ? user.role : 'loading...'} readOnly />
            </label>
          </div>
        </div>
        {/* <!-- footer --> */}
        <div className="bottom-0 left-0 px-4 py-3 border-t border-gray-200 w-full flex justify-end items-center gap-3">
          <input type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white focus:outline-none" value="Save" />
          <button
            type="button"
            onClick={() => openModal(false, '#edit')}
            className="bg-gray-500 hover:bg-gray-800 px-4 py-2 rounded text-white focus:outline-none"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
