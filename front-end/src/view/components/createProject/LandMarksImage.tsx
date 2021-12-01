import React, { useRef, useEffect } from 'react';
import template from './template.png';
import { LandmarkSpecification } from '../../../data';

export default function LandMarksImage(props: {
    LandMarks: LandmarkSpecification
}) {
  const canvasRef = useRef(null);
  const { LandMarks } = props;
  console.log(LandMarks);

  const draw = (ctx: any) => {
    const { canvas } = ctx;
    const backgroundImage = new window.Image();
    backgroundImage.src = template;
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // scale and translate
    ctx.save();
    // draw image after loading
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      // draw landmarks
      ctx.restore();
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: any = (canvas || { getContext: (s: string) => { throw s; } }).getContext('2d');
    draw(context);
  }, []);

  return <canvas ref={canvasRef} width="300" height="300" />;
}
