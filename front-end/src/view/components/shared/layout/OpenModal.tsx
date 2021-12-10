export default function openModal(value: boolean, id: string) {
  const modalOverlay = document.querySelector('#modals');
  const modal = document.querySelector(id);
  const modalCl = modal?.classList;
  const overlayCl = modalOverlay;

  if (value) {
    console.log(0);
    overlayCl?.classList.remove('hidden');
    setTimeout(() => {
      modalCl?.remove('opacity-0');
      modalCl?.remove('-translate-y-full');
      modalCl?.remove('scale-150');
      modalCl?.remove('hidden');
    }, 100);
  } else {
    console.log(1);
    modalCl?.add('-translate-y-full');
    setTimeout(() => {
      modalCl?.add('opacity-0');
      modalCl?.add('scale-150');
      modalCl?.add('hidden');
    }, 100);
    setTimeout(() => overlayCl?.classList.add('hidden'), 300);
  }
}
