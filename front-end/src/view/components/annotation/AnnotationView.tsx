import React, { useEffect, useState } from 'react';
import { Annotation, Image, ImageID } from '../../../data';
import { findImageById } from '../../../data/images';
import AnnotatedImage from './AnnoatedImage';

const templateImage: Image = {
  id: 'template',
  data: null,
  annotation: {
    0: { x: 0.3, y: 0.4, z: 1 },
    1: { x: 0.7, y: 0.4, z: 1 },
    2: { x: 0.5, y: 0.6, z: 1 },
    3: { x: 0.35, y: 0.75, z: 1 },
    4: { x: 0.5, y: 0.8, z: 1 },
    5: { x: 0.65, y: 0.75, z: 1 },
  },
};

/* TODO: Keyboard shortcuts
Right Click - Not visible landmark (Code 0) (oncontextmenu="")
Left Click - Visible landmark (Code 1)
Shift+Left Click -Occluded landmark (Code 2) (event.ctrlKey)
a - Go to previous image
d -  Go to next image
s - Save image landmarks
Mouse Scroll - Zoom In/Out
g - Optical Flow prediction
backspace - undo last landmark
*/

export default function AnnotationView(props: { imageId: ImageID }) {
  const initialState: {
    imageToAnnotate: Image,
    landmarkId?: number,
    landmarkZ: number,
  } = {
    imageToAnnotate: templateImage,
    landmarkId: undefined,
    landmarkZ: 1,
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    findImageById(props.imageId).then((result) => {
      setState({
        ...state,
        imageToAnnotate: result,
        landmarkId: nextLandmark(result.annotation, templateImage.annotation),
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

  const onImageClick = (ctx: any, event: MouseEvent) => {
    // TODO: move partially to logic
    if (templateImage.annotation && state.landmarkId !== undefined) {
      const x = event.clientX / ctx.canvas.width;
      const y = event.clientY / ctx.canvas.height;
      if (!state.imageToAnnotate.annotation) state.imageToAnnotate.annotation = {};
      state.imageToAnnotate.annotation[state.landmarkId] = { x, y, z: state.landmarkZ };
      setState({
        ...state,
        landmarkId: nextLandmark(state.imageToAnnotate.annotation, templateImage.annotation),
      });
    } else {
      alert('You annotated every landmark in this image');
    }
  };

  const changeLandmarkType = (z: number) => {
    setState({ ...state, landmarkZ: z });
  };

  const templateLandmarkColor = (id: number) => {
    if (!state.imageToAnnotate.annotation || !state.imageToAnnotate.annotation[id]) {
      if (id === state.landmarkId) {
        return { fill: '#0000FF', stroke: '#FFFFFF' };
      }
      return { stroke: '#FFFFFF' };
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
      return { fill: '#0080FF' };
    }
    return { fill: '#525252' };
  };

  return (
    <div className="Annotation">
      <div className="">
        <AnnotatedImage
          image={state.imageToAnnotate}
          onClick={onImageClick}
          hideNonVisible
          landmarkColor={imageLandmarkColor}
        />
        <div className="image-controller">
          <button type="button" id="previous-image">Previous Image</button>
          <button type="button" id="zoom-in">+</button>
          <button type="button" id="zoom-out">-</button>
          {/* <Slider onChange="()=>image.style.filter='contrast('+value*100+'%)'">Contrast</Slider>
        <Slider onChange="()=>image.style.filter='brighness('+value*100+'%)'>Brighness</Slider> */}
          <button type="button" id="next-image">Next Image</button>
        </div>
      </div>
      <div className="annotation-controller">
        <button type="button" id="undo">Undo</button>
        <AnnotatedImage image={templateImage} landmarkColor={templateLandmarkColor} />
        <div className="landmark-type">
          Landmark Type
          <button type="button" onClick={() => changeLandmarkType(1)}>Normal</button>
          <button type="button" onClick={() => changeLandmarkType(2)}>Occuled</button>
          <button type="button" onClick={() => changeLandmarkType(0)}>Non Visible</button>
        </div>
      </div>
      <div className="landmark-list">
        <ul>
          {
            state.imageToAnnotate.annotation
              ? Object.entries(state.imageToAnnotate.annotation).map(([id, point]) => (
                <li>
                  { id }
                  : (
                  {point.x}
                  ,
                  {point.y}
                  ,
                  {point.z}
                  )
                </li>
              ))
              : 'Could not get landmarks'
          }
        </ul>
      </div>
    </div>
  );
}
