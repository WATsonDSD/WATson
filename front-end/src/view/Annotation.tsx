import React, { useRef, useEffect } from 'react';
import template from './template.png';
import { Annotation, Image } from '../data';
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

class AnnotationView extends React.Component<{ imageId: string }> {
  // eslint-disable-next-line max-len
  static nextLandmark(imageAnnotation: Annotation|undefined, templateAnnotation: Annotation|undefined): number|null {
    if (templateAnnotation === undefined) return null;
    if (imageAnnotation === undefined) return 0;

    const strId = Object.keys(templateAnnotation).find(
      (id: string) => imageAnnotation[+id] === undefined,
    );
    return strId === undefined ? null : +strId;
  }

  state = {
    imageToAnnotate: templateImage,
    landmarkId: 0,
    landmarkZ: 1,
  }

  componentDidMount() {
    const { imageId } = this.props;
    findImageById(imageId).then((result) => {
      // this.state.imageToAnnotate = { ...result, annotation: { 3: { x: 0.3, y: 0.4, z: 1 } } };
      this.setState({
        imageToAnnotate: result,
        // eslint-disable-next-line max-len
        landmarkId: AnnotationView.nextLandmark(result.annotation, templateImage.annotation),
      });
      this.forceUpdate();
    });
  }

  render() {
    const { imageToAnnotate, landmarkId, landmarkZ } = this.state;

    const onImageClick = (ctx: any, event: MouseEvent) => {
      if (templateImage.annotation) {
        const x = event.clientX / ctx.canvas.width;
        const y = event.clientY / ctx.canvas.height;
        if (!imageToAnnotate.annotation) imageToAnnotate.annotation = {};
        imageToAnnotate.annotation[landmarkId] = { x, y, z: landmarkZ };
        this.setState({
          // eslint-disable-next-line max-len
          landmarkId: AnnotationView.nextLandmark(imageToAnnotate.annotation, templateImage.annotation),
        });
      } else {
        alert('You annotated every landmark in this image');
      }
    };

    const changeLandmarkType = (z: number) => {
      this.setState({ landmarkZ: z });
    };

    return (
      <div className="Annotation">
        <div className="">
          <AnnotatedImage image={imageToAnnotate} onClick={onImageClick} />
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
          <AnnotatedImage image={templateImage} highlightedLandmark={landmarkId} />
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
            imageToAnnotate.annotation
              ? Object.entries(imageToAnnotate.annotation)
                .map(([id, point]) => (
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
    const context: any = (canvas || { getContext: (str: string) => { throw str; } }).getContext('2d');
    draw(context);
    if (onClick) context.canvas.onclick = (event: any) => onClick(context, event);
  }, [draw]);

  return <canvas ref={canvasRef} width="300" height="300" />;
}

export default AnnotationView;
export { AnnotatedImage };
