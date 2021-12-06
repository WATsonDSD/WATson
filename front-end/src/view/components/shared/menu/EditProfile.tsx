import React from 'react';

function openModal(value: boolean) {
  const modalOverlay = document.querySelector('#editOverlay');
  const modal = document.querySelector('#edit');
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

export default function EditProfile() {
  const button = (
    <button type="button" onClick={() => openModal(true)}>
      Edit Profile
    </button>
  );
  return (
    <div>
      {button}
    </div>
  );
}
