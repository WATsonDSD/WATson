import React, { useEffect, useState } from 'react';
import { Annotation, Image, ImageID } from '../../../data';
import { findImageById } from '../../../data/images';
import AnnotatedImage from './AnnotatedImage';

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

  const lastLandmark = (imageAnnotation?: Annotation) => {
    // TODO: move to logic
    if (imageAnnotation === undefined) return undefined;

    const strId = Object.keys(imageAnnotation).pop();
    return strId === undefined ? undefined : +strId;
  };

  const onImageClick = (ctx: any, event: MouseEvent, rightClick: boolean) => {
    // TODO: move partially to logic
    if (templateImage.annotation && state.landmarkId !== undefined) {
      const x = (event.clientX - ctx.canvas.offsetLeft) / ctx.canvas.width;
      const y = (event.clientY - ctx.canvas.offsetTop) / ctx.canvas.height;
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
      alert('You annotated every landmark in this image');
    }
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
    <div className="Annotation">
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
        {/* <Slider onChange="()=>image.style.filter='contrast('+value*100+'%)'">Contrast</Slider>
        <Slider onChange="()=>image.style.filter='brighness('+value*100+'%)'>Brighness</Slider> */}
      </div>
      <div className="middle">
        <AnnotatedImage
          image={state.imageToAnnotate}
          onClick={onImageClick}
          hideNonVisible
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
        <button type="button">Save (wip)</button>
      </div>
    </div>
  );
}
