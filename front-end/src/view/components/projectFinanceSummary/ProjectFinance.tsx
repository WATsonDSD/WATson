import React from 'react';
import { useParams } from 'react-router-dom';
import { findProjectById } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';

export default function ProjectFinance() {
  const { idProject } = useParams();

  const project = useData(async () => findProjectById(idProject ?? ''));

  return (
    <div className="h-full w-full">
      <Header title={`Project finance : ${project?.name ?? ''}`} />
    </div>
  );
}
