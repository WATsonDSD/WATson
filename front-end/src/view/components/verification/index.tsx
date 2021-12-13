import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import Icon from '@mdi/react';
import {
  mdiMagnifyPlus,
  mdiMagnifyMinus,
  mdiChevronLeft,
  mdiChevronRight,
  mdiHelpCircle,
} from '@mdi/js';
import { Image } from '../../../data';
import AnnotatedImage from '../annotation/AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImagesOfProject } from '../../../data/images';
import TemplateAnnotation from '../annotation/TemplateAnnotation';
import { rejectAnnotation, verifyImage } from '../../../data/verification';
// import { Paths } from '../shared/routes';

const templateImage: Image = {
  id: 'template',
  annotation: TemplateAnnotation,
};

const zoomIn = 1.6;
const zoomOut = 0.625;

/* TODO: Keyboard shortcuts
a - Go to previous image
d -  Go to next image
s - Save image landmarks
g - Optical Flow prediction
backspace - undo last landmark
*/

export default function VerificationView() {
  const initialState: {
    imageToVerify: Image,
    imageTransform: {
      scale: number, translatePos: { x: number, y: number }, contrast: number, brighness: number,
    },
    showReject: boolean;
  } = {
    imageToVerify: { ...templateImage },
    imageTransform: {
      scale: 1, translatePos: { x: 0, y: 0 }, contrast: 100, brighness: 100,
    },
    showReject: false,
  };
  const [state, setState] = useState(initialState);
  const { projectId } = useParams();
  const navigate = useNavigate();
  console.log(projectId, navigate);
  useEffect(() => {
    nextImage();
  }, []);

  const nextImage = () => {
    getImagesOfProject(projectId ?? '', 'needsVerifierAssignment').then((result) => {
      if (result.length === 0) {
        alert('You do not have any images to verify in this project.');
        // navigate(Paths.Projects);
        return;
      }
      setState({
        ...state,
        imageToVerify: result[0],
      });
    });
  };

  const onImageWheel = (ctx: any, event: WheelEvent) => {
    const { canvas } = ctx;
    const x = (event.clientX - canvas.offsetLeft) / canvas.width;
    const y = (event.clientY - canvas.offsetTop) / canvas.height;
    zoom(event.deltaY > 0 ? zoomOut : zoomIn, { x, y });
  };

  const zoom = (scale: number, position: { x: number, y: number }) => {
    const { imageTransform } = state;
    const x = position.x - (position.x - imageTransform.translatePos.x) * scale;
    const y = position.y - (position.y - imageTransform.translatePos.y) * scale;
    setState({
      ...state,
      imageTransform: {
        ...imageTransform,
        scale: imageTransform.scale * scale,
        translatePos: { x, y },
      },
    });
  };

  const saveAsValid = () => {
    verifyImage(projectId ?? '', state.imageToVerify.id);
    nextImage();
  };

  const changeContrast = (contrast: number) => {
    setState({ ...state, imageTransform: { ...state.imageTransform, contrast } });
  };

  const changeBrighness = (brighness: number) => {
    setState({ ...state, imageTransform: { ...state.imageTransform, brighness } });
  };

  const templateLandmarkColor = (id: number) => {
    if (!state.imageToVerify.annotation || !state.imageToVerify.annotation[id]) {
      return { stroke: '#525252' };
    }
    if (state.imageToVerify.annotation[id].z === 0) {
      return { fill: '#FF0000' };
    }
    if (state.imageToVerify.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
  };

  const imageLandmarkColor = (id: number) => {
    if (!state.imageToVerify.annotation
      || !state.imageToVerify.annotation[id]
      || state.imageToVerify.annotation[id].z === 0) {
      return { };
    }
    if (state.imageToVerify.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
  };

  const showRejectMenu = () => {
    setState({
      ...state,
      showReject: true,
    });
  };
  const hideRejectMenu = () => {
    setState({
      ...state,
      showReject: false,
    });
  };
  const sendReject = () => {
    const comment = document.getElementById('rejectionComment')?.innerText;
    console.log(comment);
    rejectAnnotation(state.imageToVerify.id, projectId ?? '', comment ?? '');
    hideRejectMenu();
  };

  // Here goes the image count condition if images to annotate is empty, allDone = true
  const allDone = false;
  if (allDone) {
    return (
      <div className="text-7xl m-auto p-auto">
        <h1 className="pt-24 pl-24"> No Image to annotate </h1>
      </div>
    );
  }
  return (
    <div>
      { state.showReject
        && (
        <div
          className="fixed h-100v w-100v bg-ui-graygloss z-10"
        >
          <div className="fixed h-80v w-60v bg-gray-100 z-20 rounded-3xl p-5vh my-10vh mx-20vw">
            <div className="mt-2vh">
              <span>Rejection Comments: </span>
            </div>
            <br />
            <textarea className="w-50v h-50v p-3 text-left align-top inline-block" id="rejectionComment" placeholder="Write comments for annotation rejection." />
            <div className="grid grid-cols-6 h-10v mt-5vh mb-0 w-full">
              <button
                className="col-start-1 col-span-1 h-6v"
                type="button"
                onClick={() => hideRejectMenu()}
              >
                <div className="flex py-2 px-4 h-6v w-full bg-ui-gray shadow-lg rounded-3xl text-center">
                  <span className="mx-auto text-white"> Back </span>
                </div>
              </button>
              <button
                className="col-start-6 col-span-1 h-6v"
                type="button"
                onClick={() => sendReject()}
              >
                <div className="flex py-2 px-4 h-6v w-full bg-ui-red shadow-lg rounded-3xl text-center">
                  <span className="text-ui-darkred mx-auto"> Confirm Reject </span>
                </div>
              </button>
            </div>
          </div>
        </div>
        )}
      <div className="grid grid-cols-12 grid-rows-5 gap-0 h-100v bg-gray-100">
        <div className="h-full p-4 col-span-2 row-start-1 row-end-5 w-full">
          <div className="h-full p-4 w-9v bg-ui-gray shadow-lg rounded-3xl ml-4 mr-auto">
            <div className="divide-y divide-gray-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1 h-60v my-4">
                  <Slider
                    onChange={changeContrast}
                    value={state.imageTransform.contrast}
                    className="col-span-1 p-auto mx-auto"
                    vertical
                  />
                </div>
                <div className="col-span-1 h-60v my-4">
                  <Slider
                    onChange={changeBrighness}
                    value={state.imageTransform.brighness}
                    className="col-span-1 p-auto mx-auto"
                    vertical
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => zoom(zoomOut, { x: 0.5, y: 0.5 })}>
                  <Icon className="col-span-1" path={mdiMagnifyMinus} horizontal />
                </button>
                <button type="button" onClick={() => zoom(zoomIn, { x: 0.5, y: 0.5 })}>
                  <Icon className="col-span-1" path={mdiMagnifyPlus} horizontal />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full p-4 col-start-1 col-span-3 row-start-5 row-end-6 w-full">
          <div className="h-full p-4 w-20v ml-1 mr-auto text-left ">
            <span className="text-lg pl-1 font-bold">Image Landmarks:</span>
            <br />
            <span className="text-5xl pl-4 text font-bold">
              {/* Get Here the data of the verification of images in the current session */}
              { state.imageToVerify.annotation
                ? Object.keys(state.imageToVerify.annotation).length
                : 1 }
              {' / '}
              {templateImage.annotation ? Object.keys(templateImage.annotation).length : 1}
            </span>
          </div>
        </div>
        <div className="h-full p-4 col-span-1 row-start-2 row-span-2 w-full">
          <button type="button" style={{ width: '6vw' }}>
            <div className="flex h-50v w-full bg-ui-light shadow-lg rounded-3xl text-center">
              <Icon className="col-span-1" path={mdiChevronLeft} />
            </div>
          </button>
        </div>
        <div className="h-full p-4 col-span-5 row-span-full w-full">
          <div className="h-95v px-4 py-4 w-full bg-ui rounded-3xl px-auto">
            <AnnotatedImage
              image={state.imageToVerify}
              onMouseWheel={onImageWheel}
              landmarkColor={imageLandmarkColor}
              scale={state.imageTransform.scale}
              translatePos={state.imageTransform.translatePos}
            />
          </div>
        </div>
        <div className="p-4 col-span-1 row-start-2 row-span-2 w-full h-full">
          <button type="button" style={{ width: '6vw' }}>
            <div className="flex h-50v bg-ui-light shadow-lg rounded-3xl mx-auto text-center">
              <Icon className="col-span-1" path={mdiChevronRight} />
            </div>
          </button>
        </div>
        <div className="h-full p-4 col-span-3 row-span-4 w-full">
          <div className="h-80v p-4 w-fill mx-auto">
            <div className="h-8v p-4 w-20v bg-ui-light shadow-lg rounded-3xl mx-auto">
              Selected landmark:
            </div>
            <div className="mt-12">
              <AnnotatedImage image={templateImage} landmarkColor={templateLandmarkColor} />
            </div>
          </div>
        </div>
        <div className="h-full p-4 col-start-9 col-span-4 row-start-5 row-end-6 w-full">
          <div className="h-15v px-4 w-30v mx-auto grid my-0 grid-cols-2 grid-rows-2 gap-x-6 gap-y-0">
            <button
              className="col-start-1 col-span-1 row-start-1 row-span-1 h-6v"
              type="button"
              // eslint-disable-next-line no-return-assign
              onClick={() => showRejectMenu()}
            >
              <div className="flex py-2 px-4 h-6v w-full bg-ui-red shadow-lg rounded-3xl text-center">
                <span className="text-ui-darkred mx-auto"> Reject Annotation </span>
              </div>
            </button>
            <button className="col-start-1 col-span-1 row-start-2 row-span-1 h-6v" type="button" onClick={saveAsValid}>
              <div className="flex py-2 px-4 h-6v w-full bg-ui-gray shadow-lg rounded-3xl text-center">
                <span className="mx-auto text-white"> Accept Annotation </span>
              </div>
            </button>
            <button className="col-start-2 col-span-1 row-start-2 row-span-1 h-6v" type="button">
              <div className="flex p-1 h-6v w-full bg-ui-gray shadow-lg rounded-3xl text-center">
                <Icon className="fill-current text-white" path={mdiHelpCircle} />
                <span className="px-4 text-white"> Help </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
