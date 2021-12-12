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
import { useNavigate, useParams } from 'react-router-dom';
import {
  Annotation, findProjectById, Image, useUserNotNull,
} from '../../../data';
import AnnotatedImage from './AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImagesOfUser, saveAnnotation } from '../../../data/images';
import TemplateAnnotation from './TemplateAnnotation';

import { Paths } from '../shared/routes';

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
  const navigate = useNavigate();
  const [user] = useUserNotNull();

  useEffect(() => {
    findProjectById(projectId ?? '')
      .then((project) => {
        Object.keys(templateImage.annotation ?? {}).forEach((a) => {
          if (!project.landmarks.includes(+a) && templateImage.annotation) {
            delete templateImage.annotation[+a];
          }
        });
      });
    nextImage();
  }, []);

  const nextImage = () => {
    getImagesOfUser(projectId ?? '', 'toAnnotate', user!.id).then((result) => {
      if (result.length === 0) {
        console.warn('Every image is annotated');
        alert('You do not have any images to annotate in this project.');
        navigate(Paths.Projects);
        return;
      }
      setState({
        ...state,
        imageToAnnotate: result[0],
        landmarkId: nextLandmark(result[0].annotation, templateImage.annotation),
      });
    });
  };

  const nextLandmark = (imageAnnotation?: Annotation, templateAnnotation?: Annotation) => {
    // TODO: move to logic
    if (templateAnnotation === undefined) return undefined;
    if (imageAnnotation === undefined) return +Object.keys(templateAnnotation)[0];

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
      // TODO: Alert user that every landmark has been annotated
      console.warn('Every landmark has been annotated');
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
    if (state.imageToAnnotate.annotation === undefined) {
      console.warn(`Could not save annotation for image ${state.imageToAnnotate.id}`);
      return;
    }
    saveAnnotation(state.imageToAnnotate.annotation, state.imageToAnnotate.id, projectId as string)
      .then(() => {
        nextImage();
      })
      .catch((e) => {
        // TODO: Alert user that the annotation is incorrect
        console.warn(e);
      });
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
