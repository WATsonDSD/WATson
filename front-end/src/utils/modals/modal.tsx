import React, {
  useState,
  useEffect,
} from 'react';

import ReactDOM from 'react-dom';

import { v4 } from 'uuid';

import './index.css';

export enum ModalType {
  Alert = '',
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
  Information = 'information',
}

function Modal(props: { title: string, message: string, type: ModalType }) {
  const { title, message, type } = props;

  const [visible, setVisibility] = useState(true);

  /**
   * The user can leave the modal
   * by pressing the ESC button.
   */
  function handleEscape(event: any) {
    if (event.keyCode === 27) {
      setVisibility(false);
    }
  }

  useEffect(() => {
    if (visible) document.addEventListener('keydown', handleEscape, false);

    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [visible]);

  return (
    visible ? (
      <div id="modal" className="inset-0 flex items-center justify-center bg-black bg-opacity-25">
        <div id="modal-content" className={`${type} flex flex-col px-8 py-6 rounded-md shadow-md ${type === ModalType.Alert ? 'bg-white' : ''}`}>
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-bold">{title}</h1>
            <p>{message}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisibility(false);
            }}
            className="self-end mt-5 uppercase text-sm font-bold opacity-60 hover:opacity-100"
          >
            Close
          </button>
        </div>
      </div>
    ) : null
  );
}

export function useModal() {
  return (content: { title: string, message: string }, type?: ModalType) => {
    /** 
     * This is the root DOM element where the
     * modal components will be appended.
     */
    let root = document.getElementById('modal-root');

    // Makes sure the root element exists
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'modal-root');

      document.body.appendChild(root);
    }

    ReactDOM.render(<Modal key={v4()} title={content.title} message={content.message} type={type ?? ModalType.Alert} />, root);
  };
}

export default { useModal };
