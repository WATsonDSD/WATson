import React, { useRef, useEffect, useState } from 'react';
import template from './template.png';
import { Image } from '../../../../data';

// Used for template image, image to annotate and image to verify.
// Has a background image and some points drawn on it that represents landmarks
AnnotatedImage.defaultProps = {
  onClick: undefined,
  onMouseWheel: undefined,
  onMouseDown: undefined,
  onMouseMove: undefined,
  scale: 1,
  translatePos: { x: 0, y: 0 },
  contrast: 100,
  brightness: 100,
  size: '300',
};
export default function AnnotatedImage(props: {
  image: Image,
  onClick?: Function,
  onMouseWheel?: Function,
  onMouseDown?: Function,
  onMouseMove?: Function,
  landmarkColor: Function,
  scale?: number,
  translatePos?: { x: number, y: number },
  contrast?: number,
  brightness?: number,
  size?: string,
}) {
  const {
    image, onClick, onMouseWheel, onMouseDown, onMouseMove, landmarkColor, scale, translatePos, size,
  } = props;

  const [imageSize, setImageSize] = useState({ w: size || '300', h: size || '300' });
  const { w, h } = imageSize;
  const canvasRef = useRef(null);

  const draw = (ctx: any) => {
    const { canvas } = ctx;
    const backgroundImage = new window.Image();
    backgroundImage.src = image.data ? URL.crimagebjectURL(image.data) : template; image;
    // draw canvas after image loading
    backgroundImage.onload = () => {
      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // scale and translate
      ctx.save();
      if (translatePos) {
        ctx.translate(translatePos.x * canvas.width, translatePos.y * canvas.height);
      }
      if (scale) ctx.scale(scale, scale);
      if (Number(h) !== (Number(imageSize.w) * backgroundImage.naturalHeight) / backgroundImage.naturalWidth) {
        setImageSize({
          ...imageSize,
          h: String((Number(imageSize.w) * backgroundImage.naturalHeight) / backgroundImage.naturalWidth),
        });
      }
      // draw image
      const { brightness, contrast } = props;
      ctx.filter = `
        ${brightness !== undefined ? ctx.filter = `brightness(${brightness}%)` : ''}
        ${contrast !== undefined ? ctx.filter = `contrast(${contrast}%)` : ''}
      `;
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'brightness(100%) contrast(100%)';
      // draw landmarks
      if (image.annotation) {
        Object.entries(image.annotation).forEach(([id, point]) => {
          const { fill, stroke } = landmarkColor(+id);
          [ctx.fillStyle, ctx.strokeStyle] = [fill || '#00000000', stroke || '#00000000'];

          ctx.beginPath();
          ctx.arc(point.x * canvas.width, point.y * canvas.height, 4 / (scale ?? 1), 0, 2 * Math.PI);
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
    if (onMouseDown) {
      context.canvas.onmousedown = (event: any) => onMouseDown(context, event);
    }
    if (onMouseMove) {
      context.canvas.onmousemove = (event: any) => onMouseMove(context, event);
    }
  }, [draw]);

  return (
    <div className="h-full w-full">
      <canvas className="w-full py-auto" ref={canvasRef} width={w} height={h} />
    </div>
  );
}
