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
import { useUserNotNull } from '../../../data';
import AnnotatedImage from '../shared/annotation/AnnotatedImage';
import 'rc-slider/assets/index.css';
import { getImagesOfUserFromProject } from '../../../data/images';
import { acceptAnnotation, modifyAnnotation, rejectAnnotation } from '../../../data/verification';
import { Paths } from '../shared/routes';

import AnnotVerif, {
  emptyImage,
  templateImage,
  zoomIn,
  zoomOut,
  defaultTransform,
} from '../shared/annotation/AnnotVerif';

export default function VerificationView() {
  const [image, setImage] = useState({ ...emptyImage });
  const [transform, setTransform] = useState({ ...defaultTransform });
  const [showReject, setShowReject] = useState(false);
  const [movedLandmark, setMovedLandmark] = useState(null as number|null);
  const [edit, setEdit] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const [user] = useUserNotNull();

  const {
    onImageWheel,
    zoom,
    changeContrast,
    changeBrightness,
    imageLandmarkColor,
    templateLandmarkColor,
    onMouseDownMove,
    onMouseMoveMove,
    onMouseUpMove,
  } = AnnotVerif(image, setImage, transform, setTransform, movedLandmark, setMovedLandmark);

  useEffect(() => {
    nextImage();
  }, []);

  const nextImage = () => {
    getImagesOfUserFromProject(projectId ?? '', 'toVerify', user.uuid).then((result) => {
      if (result.length === 0) {
        alert('You do not have any images to verify in this project.');
        navigate(Paths.Projects);
        return;
      }
      setImage(result[0]);
      setTransform(defaultTransform);
    });
  };

  const saveAsValid = async () => {
    if (edit) await modifyAnnotation(projectId ?? '', image.id, image.annotation ?? {});
    await acceptAnnotation(projectId ?? '', image.id);
    nextImage();
  };

  const editImage = () => {
    if (edit) modifyAnnotation(projectId ?? '', image.id, image.annotation ?? {});
    setEdit(!edit);
  };

  const sendReject = async () => {
    const comment = (document.getElementById('rejectionComment') as HTMLTextAreaElement).value;
    console.log(comment);
    await rejectAnnotation(image.id, projectId ?? '', comment ?? '');
    setShowReject(false);
    nextImage();
  };

  const onClick = () => {
    if (edit) onMouseUpMove();
  };
  const onMouseDown = (ctx: any, event: MouseEvent) => {
    if (edit) onMouseDownMove(ctx, event);
  };
  const onMouseMove = (ctx: any, event: MouseEvent) => {
    if (edit) onMouseMoveMove(ctx, event);
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
      { showReject
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
                onClick={() => setShowReject(false)}
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
              <div>
                <button className="py-2 px-4 h-6v w-full bg-ui-darkgray shadow-lg rounded-3xl text-center" type="button" onClick={editImage}>
                  <span className="mx-auto text-white">
                    {edit ? 'Confirm modifications' : 'Edit annotation' }
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1 h-60v my-4">
                  <Slider
                    onChange={changeContrast}
                    value={transform.contrast}
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
                  />
                </div>
                <div className="col-span-1 h-60v my-4">
                  <Slider
                    onChange={changeBrightness}
                    value={transform.brightness}
                    className="col-span-1 p-auto mx-auto"
                    vertical
                    max={200}
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
              { image.annotation
                ? Object.keys(image.annotation).length
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
              image={image}
              onClick={onClick}
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
              onClick={() => setShowReject(true)}
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
