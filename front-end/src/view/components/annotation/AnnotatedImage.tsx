import React, { useRef, useEffect } from 'react';
import template from './template.png';
import { Image } from '../../../data';

// Used for template image, image to annotate and image to verify.
// Has a background image and some points drawn on it that represents landmarks
AnnotatedImage.defaultProps = {
  onClick: undefined,
  onMouseWheel: undefined,
  scale: 1,
  translatePos: { x: 0, y: 0 },
};
export default function AnnotatedImage(props: {
  image: Image,
  onClick?: Function,
  onMouseWheel?: Function,
  landmarkColor: Function,
  scale?: number,
  translatePos?: { x: number, y: number },
}) {
  const canvasRef = useRef(null);
  const {
    image, onClick, onMouseWheel, landmarkColor, scale, translatePos,
  } = props;

  const draw = (ctx: any) => {
    const { canvas } = ctx;
    const backgroundImage = new window.Image();
    backgroundImage.src = image.data ? URL.createObjectURL(image.data) : template;
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // scale and translate
    ctx.save();
    if (translatePos) {
      ctx.translate(translatePos.x * canvas.width, translatePos.y * canvas.width);
    }
    if (scale) ctx.scale(scale, scale);
    // draw image after loading
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      // draw landmarks
      if (image.annotation) {
        Object.entries(image.annotation).forEach(([id, point]) => {
          const { fill, stroke } = landmarkColor(+id);
          [ctx.fillStyle, ctx.strokeStyle] = [fill || '#00000000', stroke || '#00000000'];

          ctx.beginPath();
          ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
          if (fill) ctx.fill();
          if (stroke) ctx.stroke();
        });
      }
      ctx.restore();
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: any = (canvas || { getContext: (s: string) => { throw s; } }).getContext('2d');
    draw(context);
    if (onClick) {
      context.canvas.onclick = (event: any) => onClick(context, event, false);
      context.canvas.oncontextmenu = (event: any) => {
        event.preventDefault();
        onClick(context, event, true);
      };
    }
    if (onMouseWheel) {
      context.canvas.onmousewheel = (event: any) => {
        event.preventDefault();
        onMouseWheel(context, event);
      };
    }
  }, [draw]);

  return <canvas ref={canvasRef} width="300" height="300" />;
}
