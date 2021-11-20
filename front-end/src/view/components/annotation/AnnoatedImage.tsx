import React, { useRef, useEffect } from 'react';
import template from './template.png';
import { Image } from '../../../data';

// Used for template image, image to annotate and image to verify.
// Has a background image and some points drawn on it that represents landmarks
AnnotatedImage.defaultProps = {
  onClick: undefined,
  hideNonVisible: false,
};
export default function AnnotatedImage(props: {
  image: Image,
  onClick?: Function,
  hideNonVisible?: boolean,
  landmarkColor: Function,
}) {
  const canvasRef = useRef(null);

  const draw = (ctx: any) => {
    const backgroundImage = new window.Image();
    backgroundImage.src = (props.image.data || template);
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      if (props.image.annotation) {
        Object.entries(props.image.annotation).forEach(([id, point]) => {
          if (props.hideNonVisible && point.z === 0) return;

          const { fill, stroke } = props.landmarkColor(+id);
          [ctx.fillStyle, ctx.strokeStyle] = [fill || '#00000000', stroke || '#00000000'];

          ctx.beginPath();
          ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, 5, 0, 2 * Math.PI);
          if (fill) ctx.fill();
          if (stroke) ctx.stroke();
        });
      }
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: any = (canvas || { getContext: (s: string) => { throw s; } }).getContext('2d');
    const { onClick } = props;
    draw(context);
    if (onClick) {
      context.canvas.onclick = (event: any) => onClick(context, event);
    }
  }, [draw]);

  return <canvas ref={canvasRef} width="300" height="300" />;
}
