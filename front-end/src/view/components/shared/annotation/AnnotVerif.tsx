import {
  Annotation,
  Image,
} from '../../../../data';
// eslint-disable-next-line import/extensions
import { TemplateAnnotation } from './TemplateAnnotation.json';

export const emptyImage: Image = {
  id: '',
  data: new Blob(),
  annotation: {},
};
export const templateImage: Image = {
  id: 'template',
  annotation: TemplateAnnotation,
};

export const zoomIn = 1.6;
export const zoomOut = 0.625;

export const defaultTransform: {
  scale: number, translatePos: { x: number, y: number }, contrast: number, brightness: number,
} = {
  scale: 1, translatePos: { x: 0, y: 0 }, contrast: 100, brightness: 100,
};

// Specific to annotation
export const nextLandmark = (imageAnnotation: Annotation|undefined, templateAnnotation: Annotation|undefined) => {
  if (templateAnnotation === undefined) return undefined;
  if (imageAnnotation === undefined) return +Object.keys(templateAnnotation)[0];

  const strId = Object.keys(templateAnnotation).find(
    (id: string) => imageAnnotation[+id] === undefined,
  );
  return strId === undefined ? undefined : +strId;
};
export const lastLandmark = (imageAnnotation: Annotation|undefined) => {
  if (imageAnnotation === undefined) return undefined;

  const strId = Object.keys(imageAnnotation).pop();
  return strId === undefined ? undefined : +strId;
};

export default (
  image: Image,
  setImage: Function,
  transform: {
    scale: number, translatePos: { x: number, y: number }, contrast: number, brightness: number,
  },
  setTransform: Function,
) => {
  const onImageWheel = (ctx: any, event: WheelEvent) => {
    const { canvas } = ctx;
    const x = (event.clientX - canvas.offsetLeft) / canvas.clientWidth;
    const y = (event.clientY - canvas.offsetTop) / canvas.clientHeight;
    zoom(event.deltaY > 0 ? zoomOut : zoomIn, { x, y });
  };
  const zoom = (scale: number, position: { x: number, y: number }) => {
    const x = position.x - (position.x - transform.translatePos.x) * scale;
    const y = position.y - (position.y - transform.translatePos.y) * scale;
    setTransform({
      ...transform,
      scale: transform.scale * scale,
      translatePos: { x, y },
    });
  };
  const changeContrast = (contrast: number) => {
    setTransform({ ...transform, contrast });
  };
  const changeBrightness = (brightness: number) => {
    setTransform({ ...transform, brightness });
  };

  const imageLandmarkColor = (id: number) => {
    if (!image.annotation
      || !image.annotation[id]
      || image.annotation[id].z === 0) {
      return { };
    }
    if (image.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
  };
  const templateLandmarkColor = (id: number) => {
    if (!image.annotation || !image.annotation[id]) {
      return { stroke: '#525252' };
    }
    if (image.annotation[id].z === 0) {
      return { fill: '#FF0000' };
    }
    if (image.annotation[id].z === 2) {
      return { fill: '#40C000' };
    }
    return { fill: '#525252' };
  };

  return {
    templateImage,
    zoomIn,
    zoomOut,
    defaultTransform,
    image,
    setImage,
    transform,
    setTransform,
    onImageWheel,
    zoom,
    changeContrast,
    changeBrightness,
    imageLandmarkColor,
    templateLandmarkColor,
    nextLandmark,
    lastLandmark,
  };
};
