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
import { Annotation, Image, ProjectID } from '../../../data';
import AnnotatedImage from './AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImages, saveAnnotation } from '../../../data/images';

const templateImage: Image = {
  id: 'template',
  annotation: {
    0: { x: 0.3, y: 0.4, z: 1 },
    1: { x: 0.7, y: 0.4, z: 1 },
    2: { x: 0.5, y: 0.6, z: 1 },
    3: { x: 0.35, y: 0.75, z: 1 },
    4: { x: 0.5, y: 0.8, z: 1 },
    5: { x: 0.65, y: 0.75, z: 1 },
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

export default function AnnotationView(props: { projectId: ProjectID }) {
  const initialState: {
    imageToAnnotate: Image,
    landmarkId?: number,
    landmarkZ: number,
    imageTransform: {
      scale: number, translatePos: { x: number, y: number }, constrast: number, brighness: number,
    },
  } = {
    imageToAnnotate: { ...templateImage },
    landmarkId: undefined,
    landmarkZ: 1,
    imageTransform: {
      scale: 1, translatePos: { x: 0, y: 0 }, constrast: 100, brighness: 100,
    },
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    getImages(props.projectId, 'toAnnotate').then((result) => {
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
      let z = state.landmarkZ;
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

  const changeLandmarkType = (z: number) => {
    setState({ ...state, landmarkZ: z });
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
      saveAnnotation(state.imageToAnnotate.annotation, state.imageToAnnotate.id, 'dummyProject1');
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
                <button type="button" onClick={() => changeLandmarkType(1)}>
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
                  <Slider className="col-span-1 p-auto mx-auto" vertical />
                </div>
                <div className="col-span-1 h-26v my-4">
                  <Slider className="col-span-1 p-auto mx-auto" vertical />
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
      {/* Old / New Page Divider */}
      {/* <div className="Annotation">
        <div className="annotation-controller">
          <button type="button" onClick={removeLastLandmark}>Undo</button>
          <button type="button">Delete (wip)</button>
          <div className="landmark-type">
            Landmark Type
            <button type="button" onClick={() => changeLandmarkType(1)}>Normal</button>
            <button type="button" onClick={() => changeLandmarkType(2)}>Occuled</button>
            <button type="button" onClick={() => changeLandmarkType(0)}>Non Visible</button>
          </div>
          <button type="button">+(wip)</button>
          <button type="button">-(wip)</button>
          <Slider onChange="()=>image.style.filter='contrast('+value*100+'%)'">Contrast</Slider>
          <Slider onChange="()=>image.style.filter='brighness('+value*100+'%)'>Brighness</Slider>
        </div>
        <div className="middle">
          <AnnotatedImage
            image={state.imageToAnnotate}
            onClick={onImageClick}
            landmarkColor={imageLandmarkColor}
          />
          <button type="button">Previous Image (wip)</button>
          <button type="button">Next Image (wip)</button>
        </div>
        <div className="right">
          <div className="landmark-info">
            Landmarks set:
            {
              state.imageToAnnotate.annotation
                ? Object.keys(state.imageToAnnotate.annotation).length
                : 0
            }
            /
            {templateImage.annotation ? Object.keys(templateImage.annotation).length : 0}
          </div>
          <AnnotatedImage image={templateImage} landmarkColor={templateLandmarkColor} />
          <button type="button" onClick={save}>Save</button>
        </div>
      </div> */}
    </div>
  );
}
