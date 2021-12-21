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
  findProjectById, useUserNotNull,
} from '../../../data';
import AnnotatedImage from '../shared/annotation/AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImagesOfUser, saveAnnotation } from '../../../data/images';
import AnnotVerif, {
  emptyImage,
  templateImage,
  zoomIn,
  zoomOut,
  defaultTransform,
  nextLandmark,
  lastLandmark,
  mousePosition,
} from '../shared/annotation/AnnotVerif';

import { Paths } from '../shared/routes';

/* TODO: Keyboard shortcuts
a - Go to previous image
d -  Go to next image
s - Save image landmarks
g - Optical Flow prediction
backspace - undo last landmark
*/

export default function AnnotationView() {
  const [image, setImage] = useState({ ...emptyImage });
  const [transform, setTransform] = useState({ ...defaultTransform });
  const [landmarkId, setLandmarkId] = useState(undefined as number|undefined);
  const [tool, setTool] = useState('normal' as 'normal'|'move'|'delete');
  const [movedLandmark, setMovedLandmark] = useState(null as number|null);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const [user] = useUserNotNull();

  const {
    onImageWheel,
    zoom,
    changeContrast,
    changeBrightness,
    imageLandmarkColor,
    templateLandmarkColor: defaultTemplateLandmarkColor,
    getHoveredLandmark,
  } = AnnotVerif(image, setImage, transform, setTransform);

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
      setImage(result[0]);
      const next = nextLandmark(image.annotation, templateImage.annotation);
      setLandmarkId(next);
      setTransform(defaultTransform);
    });
  };

  const onImageClick = (ctx: any, event: MouseEvent, rightClick: boolean) => {
    const { x, y } = mousePosition(ctx.canvas, transform, event);

    if (tool === 'normal') {
      if (templateImage.annotation && landmarkId !== undefined) {
        let z = 1;
        if (rightClick) z = 0;
        else if (event.ctrlKey || event.metaKey) z = 2;
        if (!image.annotation) image.annotation = {};
        image.annotation[landmarkId] = { x, y, z };
        setLandmarkId(nextLandmark(image.annotation, templateImage.annotation));
      } else {
      // TODO: Alert user that every landmark has been annotated
        console.warn('Every landmark has been annotated');
      }
    } else if (tool === 'delete') {
      const hoveredLandmark = getHoveredLandmark(x, y);
      console.log('deleting landmark', hoveredLandmark);
      if (hoveredLandmark) removeLandmark(hoveredLandmark);
      setLandmarkId(nextLandmark(image.annotation, templateImage.annotation));
    } else if (tool === 'move') {
      setMovedLandmark(null);
    }
  };

  const onMouseDown = (ctx: any, event: MouseEvent) => {
    const { x, y } = mousePosition(ctx.canvas, transform, event);
    if (tool === 'move' && movedLandmark === null) {
      setMovedLandmark(getHoveredLandmark(x, y));
    }
  };

  const onMouseMove = (ctx: any, event: MouseEvent) => {
    if (tool === 'move' && movedLandmark !== null && image.annotation) {
      const { x, y } = mousePosition(ctx.canvas, transform, event);
      const newAnnotation = { ...image.annotation };
      newAnnotation[movedLandmark].x = x;
      newAnnotation[movedLandmark].y = y;
      setImage({ ...image, annotation: newAnnotation });
    }
  };

  const removeLandmark = (id: number|undefined) => {
    if (image.annotation && id !== undefined) {
      delete image.annotation[id];
      setLandmarkId(nextLandmark(image.annotation, templateImage.annotation));
    } else {
      console.warn(`Could not remove landmark with id: ${id}`);
    }
  };
  const removeLastLandmark = () => {
    removeLandmark(lastLandmark(image.annotation));
  };

  const save = () => {
    if (image.annotation === undefined) {
      console.warn(`Could not save annotation for image ${image.id}`);
      return;
    }
    saveAnnotation(image.annotation, image.id, projectId as string)
      .then(() => {
        nextImage();
      })
      .catch((e) => {
        // TODO: Alert user that the annotation is incorrect
        console.warn(e);
      });
  };

  const templateLandmarkColor = (id: number) => {
    // Highlight the current landmark
    if ((tool === 'normal' && id === landmarkId) || (tool === 'move' && id === movedLandmark)) {
      return { fill: '#FFFF60', stroke: '#000000' };
    }
    return defaultTemplateLandmarkColor(id);
  };

  return (
    <div>
      <div className="grid grid-cols-12 grid-rows-5 gap-2 h-100v bg-gray-100">
        <div className="h-full p-4 col-span-2 row-start-1 row-end-5 w-full">
          <div className="h-full p-4 w-9v bg-ui-gray shadow-lg rounded-3xl mx-auto">
            <div className="divide-y divide-gray-400">
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <button type="button" onClick={removeLastLandmark}>
                  <Icon className="col-span-1" path={mdiUndo} />
                  Undo
                </button>
                <button className={tool === 'normal' ? 'bg-blue-500' : ''} type="button" onClick={() => setTool('normal')}>
                  <Icon className="col-span-1" path={mdiLeadPencil} />
                  Normal
                </button>
                <button className={tool === 'move' ? 'bg-blue-500' : ''} type="button" onClick={() => setTool('move')}>
                  <Icon className="col-span-1" path={mdiCursorMove} />
                  Move
                </button>
                <button className={tool === 'delete' ? 'bg-blue-500' : ''} type="button" onClick={() => setTool('delete')}>
                  <Icon className="col-span-1" path={mdiDelete} />
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1 h-26v my-4">
                  <Slider
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
                    value={transform.contrast}
                    onChange={changeContrast}
                  />
                </div>
                <div className="col-span-1 h-26v my-4">
                  <Slider
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
                    value={transform.brightness}
                    onChange={changeBrightness}
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
            Progress (WIP):
            {0}
            /
            {0}
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
              image={image}
              onClick={onImageClick}
              onMouseWheel={onImageWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              landmarkColor={imageLandmarkColor}
              scale={transform.scale}
              translatePos={transform.translatePos}
              contrast={transform.contrast}
              brightness={transform.brightness}
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
          <div className="h-80v p-4 w-fill bg-ui shadow-lg rounded-3xl mx-auto">
            <div className="h-10v p-4 w-fill bg-ui-light shadow-lg rounded-3xl mx-auto">
              Landmarks set:
              <br />
              { image.annotation
                ? Object.keys(image.annotation).length
                : 0 }
              /
              {templateImage.annotation ? Object.keys(templateImage.annotation).length : 0}
            </div>
            <div className="mt-12">
              <AnnotatedImage image={templateImage} landmarkColor={templateLandmarkColor} />
            </div>
          </div>
        </div>
        <div className="h-full p-4 w-25v  col-start-9 col-span-4 row-start-5 row-end-6 ">
          <div className="h-20v px-4  mx-auto grid m-auto grid-cols-2 gap-6">
            <button className="col-span-1 pt-auto pb-0" type="button" onClick={save}>
              <div className="flex py-2 px-4 h-6v w-full bg-ui-gray shadow-lg rounded-3xl text-center">
                <span className="mx-auto text-white"> Save Annotation </span>
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
