import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import Icon from '@mdi/react';
import {
  mdiLeadPencil,
  mdiCursorMove,
  mdiUndo,
  mdiDelete,
  mdiMagnifyPlus,
  mdiMagnifyMinus,
  mdiChevronLeft,
  mdiChevronRight,
  mdiHelpCircle,
} from '@mdi/js';
import { useParams } from 'react-router-dom';
import { Annotation, Image } from '../../../data';
import AnnotatedImage from './AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImages, saveAnnotation } from '../../../data/images';

const templateImage: Image = {
  id: 'template',
  annotation: {
    // eslint-disable-next-line max-len
    1: { x: 0.03, y: 0.3, z: 1 }, 2: { x: 0.04, y: 0.4, z: 1 }, 3: { x: 0.05, y: 0.5, z: 1 }, 4: { x: 0.08, y: 0.6, z: 1 }, 5: { x: 0.14, y: 0.68, z: 1 }, 6: { x: 0.22, y: 0.76, z: 1 }, 7: { x: 0.31, y: 0.82, z: 1 }, 8: { x: 0.41, y: 0.87, z: 1 }, 9: { x: 0.53, y: 0.89, z: 1 }, 10: { x: 0.64, y: 0.86, z: 1 }, 11: { x: 0.74, y: 0.81, z: 1 }, 12: { x: 0.82, y: 0.74, z: 1 }, 13: { x: 0.88, y: 0.66, z: 1 }, 14: { x: 0.92, y: 0.57, z: 1 }, 15: { x: 0.95, y: 0.48, z: 1 }, 16: { x: 0.96, y: 0.38, z: 1 }, 17: { x: 0.96, y: 0.29, z: 1 }, 18: { x: 0.16, y: 0.17, z: 1 }, 19: { x: 0.22, y: 0.14, z: 1 }, 20: { x: 0.28, y: 0.13, z: 1 }, 21: { x: 0.35, y: 0.13, z: 1 }, 22: { x: 0.42, y: 0.15, z: 1 }, 23: { x: 0.60, y: 0.14, z: 1 }, 24: { x: 0.66, y: 0.13, z: 1 }, 25: { x: 0.73, y: 0.12, z: 1 }, 26: { x: 0.79, y: 0.13, z: 1 }, 27: { x: 0.84, y: 0.16, z: 1 }, 28: { x: 0.52, y: 0.24, z: 1 }, 29: { x: 0.52, y: 0.3, z: 1 }, 30: { x: 0.52, y: 0.35, z: 1 }, 31: { x: 0.52, y: 0.41, z: 1 }, 32: { x: 0.45, y: 0.46, z: 1 }, 33: { x: 0.48, y: 0.47, z: 1 }, 34: { x: 0.52, y: 0.47, z: 1 }, 35: { x: 0.56, y: 0.47, z: 1 }, 36: { x: 0.6, y: 0.46, z: 1 }, 37: { x: 0.26, y: 0.26, z: 1 }, 38: { x: 0.3, y: 0.24, z: 1 }, 39: { x: 0.35, y: 0.24, z: 1 }, 40: { x: 0.39, y: 0.26, z: 1 }, 41: { x: 0.35, y: 0.28, z: 1 }, 42: { x: 0.3, y: 0.28, z: 1 }, 43: { x: 0.63, y: 0.25, z: 1 }, 44: { x: 0.67, y: 0.23, z: 1 }, 45: { x: 0.72, y: 0.23, z: 1 }, 46: { x: 0.76, y: 0.25, z: 1 }, 47: { x: 0.72, y: 0.27, z: 1 }, 48: { x: 0.67, y: 0.27, z: 1 }, 49: { x: 0.36, y: 0.61, z: 1 }, 50: { x: 0.41, y: 0.57, z: 1 }, 51: { x: 0.46, y: 0.54, z: 1 }, 52: { x: 0.53, y: 0.55, z: 1 }, 53: { x: 0.58, y: 0.54, z: 1 }, 54: { x: 0.64, y: 0.57, z: 1 }, 55: { x: 0.67, y: 0.61, z: 1 }, 56: { x: 0.64, y: 0.65, z: 1 }, 57: { x: 0.59, y: 0.68, z: 1 }, 58: { x: 0.53, y: 0.69, z: 1 }, 59: { x: 0.46, y: 0.68, z: 1 }, 60: { x: 0.41, y: 0.65, z: 1 }, 61: { x: 0.41, y: 0.61, z: 1 }, 62: { x: 0.46, y: 0.58, z: 1 }, 63: { x: 0.53, y: 0.58, z: 1 }, 64: { x: 0.59, y: 0.58, z: 1 }, 65: { x: 0.64, y: 0.61, z: 1 }, 66: { x: 0.59, y: 0.63, z: 1 }, 67: { x: 0.53, y: 0.64, z: 1 }, 68: { x: 0.46, y: 0.63, z: 1 },
  },
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

export default function AnnotationView() {
  const initialState: {
    imageToAnnotate: Image,
    landmarkId?: number,
    imageTransform: {
      scale: number, translatePos: { x: number, y: number }, contrast: number, brighness: number,
    },
  } = {
    imageToAnnotate: { ...templateImage },
    landmarkId: undefined,
    imageTransform: {
      scale: 1, translatePos: { x: 0, y: 0 }, contrast: 100, brighness: 100,
    },
  };
  const [state, setState] = useState(initialState);
  const { projectId } = useParams();

  useEffect(() => {
    getImages(projectId ?? '', 'toAnnotate').then((result) => {
      setState({
        ...state,
        imageToAnnotate: result[0],
        landmarkId: nextLandmark(result[0].annotation, templateImage.annotation),
      });
    });
  }, []);

  const nextLandmark = (imageAnnotation?: Annotation, templateAnnotation?: Annotation) => {
    // TODO: move to logic
    if (templateAnnotation === undefined) return undefined;
    if (imageAnnotation === undefined) return 0;

    const strId = Object.keys(templateAnnotation).find(
      (id: string) => imageAnnotation[+id] === undefined,
    );
    return strId === undefined ? undefined : +strId;
  };

  const lastLandmark = (imageAnnotation?: Annotation) => {
    // TODO: move to logic
    if (imageAnnotation === undefined) return undefined;

    const strId = Object.keys(imageAnnotation).pop();
    return strId === undefined ? undefined : +strId;
  };

  const onImageClick = (ctx: any, event: MouseEvent, rightClick: boolean) => {
    const { canvas } = ctx;
    const { translatePos, scale } = state.imageTransform;
    // TODO: move partially to logic
    if (templateImage.annotation && state.landmarkId !== undefined) {
      const x = ((event.clientX - canvas.offsetLeft) / canvas.width - translatePos.x) / scale;
      const y = ((event.clientY - canvas.offsetTop) / canvas.height - translatePos.y) / scale;
      let z = 1;
      if (rightClick) z = 0;
      else if (event.ctrlKey) z = 2;
      if (!state.imageToAnnotate.annotation) state.imageToAnnotate.annotation = {};
      state.imageToAnnotate.annotation[state.landmarkId] = { x, y, z };
      setState({
        ...state,
        landmarkId: nextLandmark(state.imageToAnnotate.annotation, templateImage.annotation),
      });
    } else {
      // alert('You annotated every landmark in this image');
    }
  };
  const onImageWheel = (ctx: any, event: WheelEvent) => {
    const { canvas } = ctx;
    const x = (event.clientX - canvas.offsetLeft) / canvas.width;
    const y = (event.clientY - canvas.offsetTop) / canvas.height;
    zoom(event.deltaY > 0 ? zoomOut : zoomIn, { x, y });
  };

  const removeLandmark = (id: number|undefined) => {
    if (state.imageToAnnotate.annotation && id !== undefined) {
      delete state.imageToAnnotate.annotation[id];
      setState({
        ...state,
        landmarkId: nextLandmark(state.imageToAnnotate.annotation, templateImage.annotation),
      });
    } else {
      console.warn(`Could not remove landmark with id: ${id}`);
    }
  };
  const removeLastLandmark = () => {
    removeLandmark(lastLandmark(state.imageToAnnotate.annotation));
  };

  const changeContrast = (contrast: number) => {
    setState({ ...state, imageTransform: { ...state.imageTransform, contrast } });
  };
  const changeBrighness = (brighness: number) => {
    setState({ ...state, imageTransform: { ...state.imageTransform, brighness } });
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

  const save = () => {
    // TODO: Check that every landmark has been marked before saving (or try-catch ?)
    if (state.imageToAnnotate.annotation) {
      saveAnnotation(state.imageToAnnotate.annotation, state.imageToAnnotate.id, projectId as string);
    } else {
      console.warn(`Could not save annotation for image ${state.imageToAnnotate.id}`);
    }
    // TODO: Go to next image of project, if no other image, go to dashboard
  };

  const templateLandmarkColor = (id: number) => {
    if (!state.imageToAnnotate.annotation || !state.imageToAnnotate.annotation[id]) {
      if (id === state.landmarkId) {
        return { fill: '#FFFFFF', stroke: '#000000' };
      }
      return { stroke: '#525252' };
    }
    if (state.imageToAnnotate.annotation[id].z === 0) {
      return { fill: '#FF0000' };
    }
    if (state.imageToAnnotate.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
  };

  const imageLandmarkColor = (id: number) => {
    if (!state.imageToAnnotate.annotation
      || !state.imageToAnnotate.annotation[id]
      || state.imageToAnnotate.annotation[id].z === 0) {
      return { };
    }
    if (state.imageToAnnotate.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
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
      <div className="grid grid-cols-12 grid-rows-5 gap-2 h-100v bg-gray-100">
        <div className="h-full p-4 col-span-2 row-start-1 row-end-5 w-full">
          <div className="h-full p-4 w-9v bg-ui-gray shadow-lg rounded-3xl mx-auto">
            <div className="divide-y divide-gray-400">
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <button type="button" onClick={removeLastLandmark}>
                  <Icon className="col-span-1" path={mdiUndo} horizontal />
                  Undo
                </button>
                <button type="button">
                  <Icon className="col-span-1" path={mdiLeadPencil} horizontal />
                  Normal
                </button>
                <button type="button">
                  <Icon className="col-span-1" path={mdiCursorMove} horizontal />
                  Move
                </button>
                <button type="button">
                  <Icon className="col-span-1" path={mdiDelete} horizontal />
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1 h-26v my-4">
                  <Slider
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
                    value={state.imageTransform.contrast}
                    onChange={changeContrast}
                  />
                </div>
                <div className="col-span-1 h-26v my-4">
                  <Slider
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
                    value={state.imageTransform.brighness}
                    onChange={changeBrighness}
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
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Optical Flow</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full p-4 col-start-1 col-span-3 row-start-5 row-end-6 w-full">
          <div className="h-full p-4 w-20v bg-ui-light shadow-lg rounded-3xl mx-auto">
            Landmarks set:
            { state.imageToAnnotate.annotation
              ? Object.keys(state.imageToAnnotate.annotation).length
              : 0 }
            /
            {templateImage.annotation ? Object.keys(templateImage.annotation).length : 0}
            <br />
            <button className="pt-4 pb-2" type="button">
              <div className="flex py-2 px-4 h-6v w-full bg-ui-red shadow-lg rounded-3xl text-center">
                <span className="text-ui-darkred mx-auto"> Mark As invalid </span>
              </div>
            </button>
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
              image={state.imageToAnnotate}
              onClick={onImageClick}
              onMouseWheel={onImageWheel}
              landmarkColor={imageLandmarkColor}
              scale={state.imageTransform.scale}
              translatePos={state.imageTransform.translatePos}
              contrast={state.imageTransform.contrast}
              brightness={state.imageTransform.brighness}
            />
          </div>
        </div>
        <div className="p-4 col-span-1 row-start-2 row-span-2 w-full h-full">
          <button type="button" style={{ width: '6vw' }} onClick={save}>
            <div className="flex h-50v bg-ui-light shadow-lg rounded-3xl mx-auto text-center">
              <Icon className="col-span-1" path={mdiChevronRight} />
            </div>
          </button>
        </div>
        <div className="h-full p-4 col-span-3 row-span-4 w-full">
          <div className="h-80v p-4 w-fill bg-ui shadow-lg rounded-3xl mx-auto">
            <div className="h-10v p-4 w-20v bg-ui-light shadow-lg rounded-3xl mx-auto">
              Landmarks set:
              <br />
              { state.imageToAnnotate.annotation
                ? Object.keys(state.imageToAnnotate.annotation).length
                : 0 }
              /
              {templateImage.annotation ? Object.keys(templateImage.annotation).length : 0}
            </div>
            <div className="mt-12">
              <AnnotatedImage image={templateImage} landmarkColor={templateLandmarkColor} />
            </div>
          </div>
        </div>
        <div className="h-full p-4 col-start-9 col-span-4 row-start-5 row-end-6 w-full">
          <div className="h-20v px-4 w-30v mx-auto grid m-auto grid-cols-2 gap-6">
            <button className="col-span-1 pt-auto pb-0" type="button">
              <div className="flex py-2 px-4 h-6v w-full bg-ui-gray shadow-lg rounded-3xl text-center">
                <span className="mx-auto text-white"> Save For Later </span>
              </div>
            </button>
            <button className="col-span-1" type="button">
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
