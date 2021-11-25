import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../shared/layout/Header';

export default function PageA() {
  const params = useParams();
  console.log(params);
  return (
    <div className="h-full w-full">
      <Header title="This is page A" />
      {params.param}
    </div>
  );
}
