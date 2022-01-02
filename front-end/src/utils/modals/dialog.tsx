import React, {
  useRef,
  useState,
  forwardRef,
  ElementRef,
  useImperativeHandle,
} from 'react';

import ReactDOM from 'react-dom';

import { v4 } from 'uuid';

import './index.css';

interface Props {
  children: JSX.Element;
}

type ExposedActions = {
  close: () => void;
};

const Dialog = forwardRef<ExposedActions, Props>(({ children }: { children: JSX.Element}, ref) => {
  const [visible, setVisibility] = useState(true);

  /**
   * Exposes the close function to
   * the parent of this component.
   */
  useImperativeHandle(ref, () => ({
    close: () => setVisibility(false),
  }));

  return visible
    ? (
      <div id="modal" className="inset-0 flex items-center justify-center bg-black bg-opacity-25">
        <div id="dialog-content" className="px-8 py-6 rounded-md shadow-md bg-white">
          {children}
        </div>
      </div>
    )
    : null;
});

export function useDialog() {
  const ref = useRef<ElementRef<typeof Dialog>>(null);

  function open(children: JSX.Element) {
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

    ReactDOM.render(<Dialog key={v4()} ref={ref}>{children}</Dialog>, root);
  }

  function close() {
    ref?.current?.close();
  }

  return { open, close };
}

export default { useDialog };
