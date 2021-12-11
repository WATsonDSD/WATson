import React from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import Header from '../shared/layout/Header';
import { createUser } from '../../../data';

function handleSubmitForm(e: any) {
  const name = e.target.name.value;
  const email = e.target.email.value;
  const role = e.target.role.value;

  createUser(name, email, role);
  openModal(false);
  e.preventDefault();
}

function openModal(value: boolean) {
  const modalOverlay = document.querySelector('#modalOverlay');
  const modal = document.querySelector('#modal');
  const modalCl = modal?.classList;
  const overlayCl = modalOverlay;

  if (value) {
    console.log(0);
    overlayCl?.classList.remove('hidden');
    setTimeout(() => {
      modalCl?.remove('opacity-0');
      modalCl?.remove('-translate-y-full');
      modalCl?.remove('scale-150');
    }, 100);
  } else {
    console.log(1);
    modalCl?.add('-translate-y-full');
    setTimeout(() => {
      modalCl?.add('opacity-0');
      modalCl?.add('scale-150');
    }, 100);
    setTimeout(() => overlayCl?.classList.add('hidden'), 300);
  }
}

export default function PageA() {
  const button = (
    <button type="button" onClick={() => openModal(true)} className="bg-transparent hover:bg-gray-400 px-4 py-2 rounded text-black focus:outline-none">
      <AiOutlinePlus />
    </button>
  );
  return (

    <div className="h-full w-full">
      <Header title="Workers" buttonPM={button} />
      <div id="modalOverlay" className="hidden absolute inset-0 bg-black bg-opacity-30 h-screen w-full flex justify-center items-start md:items-center pt-10 md:pt-0">

        {/* <!-- modal --> */}
        <div id="modal" className="pacity-0 transform -translate-y-full scale-150  relative w-10/2 md:w-1/3 h-1/2 md:h-1/2 bg-white rounded shadow-lg transition-opacity transition-transform duration-300">

          {/* <!-- button close --> */}
          <button
            type="button"
            onClick={() => openModal(false)}
            className="absolute -top-3 -right-3 bg-gray-500 hover:bg-gray-800 text-2xl w-10 h-10 rounded-full focus:outline-none text-white"
          >
            <h2 className="text-center ml-2 font-semibold text-gray-100">
              <AiOutlineClose />
            </h2>
          </button>

          {/* <!-- header --> */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-600">Create User</h2>
          </div>
          <form className="w-full max-w-lg" onSubmit={handleSubmitForm}>
            {/* <!-- body --> */}
            <div className="w-full p-3 mt-5">

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-name">
                    Name
                    <input className="appearance-none block w-full mt-1 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder="Name" />

                  </label>

                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                    Email
                    <input type="email" className="appearance-none block w-full mt-1 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" name="email" placeholder="xx@yy.zz" />

                  </label>
                </div>
              </div>
              <div className="relative">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-role">
                  Role
                  <select className="block appearance-none w-full mt-1 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="role" name="role">
                    <option>projectManager</option>
                    <option>annotator</option>
                    <option>verifier</option>
                    <option>finance</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </label>
              </div>

            </div>

            {/* <!-- footer --> */}
            <div className="absolute bottom-0 left-0 px-4 py-3 border-t border-gray-200 w-full flex justify-end items-center gap-3">
              <input type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white focus:outline-none" value="Save" />
              <button
                type="button"
                onClick={() => openModal(false)}
                className="bg-gray-500 hover:bg-gray-800 px-4 py-2 rounded text-white focus:outline-none"
              >
                Close

              </button>
            </div>
          </form>
        </div>

      </div>

    </div>

  );
}
