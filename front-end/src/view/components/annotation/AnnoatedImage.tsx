import React, { useRef, useEffect } from 'react';
import template from './template.png';
import { Image } from '../../../data';

const colors: any = { 0: '#FF0000', 1: '#0000FF', 2: '#22AA00' };

// Used for template image, image to annotate and image to verify.
// Has a background image and some points drawn on it that represents landmarks
AnnotatedImage.defaultProps = {
  onClick: undefined,
  highlightedLandmark: undefined,
  hideNonVisible: false,
  landmarkColor: undefined,
};
export default function AnnotatedImage(props: {
  image: Image,
  onClick?: Function,
  highlightedLandmark?: number,
  hideNonVisible?: boolean,
  landmarkColor?: Function,
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
          if (props.hideNonVisible && point.z === 0) return;
          if (props.landmarkColor) {
            ctx.fillStyle = props.landmarkColor(id);
          } else {
            ctx.fillStyle = colors[point.z];
          }
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
