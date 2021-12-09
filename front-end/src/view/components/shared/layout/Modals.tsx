import React from 'react';
import ModalCreateUser from './ModalCreateUser';
import ModalEditProfile from './ModalEditProfile';
import ModalSignOut from './ModalSignOut';

export default function Modals() {
  return (
    <div id="modals" className="hidden absolute inset-0 bg-black bg-opacity-30 h-screen w-full flex justify-center items-start md:items-center pt-10 md:pt-0">
      <ModalEditProfile />
      <ModalSignOut />
      <ModalCreateUser />
    </div>
  );
}
