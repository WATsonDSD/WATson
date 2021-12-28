import React, {
  useState,
  useEffect,
} from 'react';

import ReactDOM from 'react-dom';

import { v4 } from 'uuid';

import CloseIcon from '../../assets/icons/close-white.svg';

import './index.css';

export enum SnackBarType {
  Alert = '',
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
  Information = 'information',
}

function SnackBar(props: { title: string, message: string, type: SnackBarType }) {
  const { title, message, type } = props;

  const [visible, setVisibility] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisibility(false);
    }, 5500);
  }, []);

  return (
    visible ? (
      <div id="snackbar" className="fixed flex items-center justify-center bottom-4 w-screen p-2 fade-out">
        <div className={`${type} flex gap-x-10 px-6 py-4 rounded-md shadow-md ${type === SnackBarType.Alert ? 'bg-gray-800' : ''}`}>
          <div className="flex gap-x-2 text-white">
            <span className="font-medium">
              {title}
              :
            </span>
            <span>{message}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisibility(false);
            }}
          >
            <img src={CloseIcon} alt="Close" />
          </button>
        </div>
      </div>
    ) : null
  );
}

export function useSnackBar() {
  return (content: { title: string, message: string }, type?: SnackBarType) => {
    /** 
     * This is the root DOM element where the
     * modal components will be appended.
     */
    let root = document.getElementById('modal-root');
    let superRoot = null;

    // Makes sure the root element exists
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'modal-root');

      document.body.appendChild(root);
    }

    // Check if a modal is already displaying
    if (root.hasChildNodes()) {
      superRoot = document.createElement('div');
      superRoot.setAttribute('id', 'super-root');

      document.body.appendChild(superRoot);
    }

    ReactDOM.render(<SnackBar key={v4()} title={content.title} message={content.message} type={type ?? SnackBarType.Error} />, superRoot ?? root);
  };
}

export default { useSnackBar };
