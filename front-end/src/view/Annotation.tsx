import React, { useRef, useEffect, useState } from 'react';
import template from './template.png';
import { Annotation, Image, ImageID } from '../data';
import { findImageById } from '../data/images';

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

function AnnotationView(props: { imageId: ImageID }) {
  const initialState: {
    imageToAnnotate: Image,
    landmarkId: number|null,
    landmarkZ: number,
  } = {
    imageToAnnotate: templateImage,
    landmarkId: null,
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
    if (templateAnnotation === undefined) return null;
    if (imageAnnotation === undefined) return 0;

    const strId = Object.keys(templateAnnotation).find(
      (id: string) => imageAnnotation[+id] === undefined,
    );
    return strId === undefined ? null : +strId;
  };

  const onImageClick = (ctx: any, event: MouseEvent) => {
    if (templateImage.annotation && state.landmarkId != null) {
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

  return (
    <div className="Annotation">
      <div className="">
        <AnnotatedImage image={state.imageToAnnotate} onClick={onImageClick} />
        <div className="image-controller">
          <button type="button" id="previous-image">Previous Image</button>
          <button type="button" id="zoom-in">+</button>
          <button type="button" id="zoom-out">-</button>
          {/* <Slider id="change-contrast">Contrast</Slider>
        <Slider id="change-brightness">Brighness</Slider> */}
          <button type="button" id="next-image">Next Image</button>
        </div>
      </div>
      <div className="annotation-controller">
        <button type="button" id="undo">Undo</button>
        <AnnotatedImage image={templateImage} highlightedLandmark={state.landmarkId} />
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

// Used for template image, image to annotate and image to verify.
// Has a background image and some points drawn on it that represents landmarks
AnnotatedImage.defaultProps = { onClick: null, highlightedLandmark: null };
function AnnotatedImage(props: {
  image: Image,
  onClick?: Function|null,
  highlightedLandmark?: number|null,
}) {
  const { image, onClick, highlightedLandmark } = props;

  const canvasRef = useRef(null);

  const draw = (ctx: any) => {
    const backgroundImage = new window.Image();
    backgroundImage.src = (image.data || template);
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      if (image.annotation) {
        Object.entries(image.annotation).forEach(([id, point]) => {
          const colors: any = { 0: '#FF0000', 1: '#0000FF', 2: '#22AA00' };
          ctx.fillStyle = colors[point.z];
          ctx.beginPath();
          ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, 5, 0, 2 * Math.PI);
          ctx.fill();
          if (highlightedLandmark === +id) {
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
      }
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: any = (canvas || { getContext: (s: string) => { throw s; } }).getContext('2d');
    draw(context);
    if (onClick) context.canvas.onclick = (event: any) => onClick(context, event);
  }, [draw]);

  return <canvas ref={canvasRef} width="300" height="300" />;
}

export default AnnotationView;
export { AnnotatedImage };
