/* eslint-disable react/button-has-type */
import React from 'react';
import { createProject, findProjectById } from '../../../data';
import { generateReport } from '../../../data/financier';

const projectid = createProject('dummyproject', 'laura', []);

async function createProjectExample() {
  const project = findProjectById(await projectid);
  (await project).pricePerImageAnnotation = 5;
  (await project).pricePerImageVerification = 6;
  (await project).hourlyRateAnnotation = 7;
  (await project).hourlyRateVerification = 9;
}

// componente funzionale-> lettera maiuscola iniziale 
export default function PageA() {
  return (
    <div className="h-full w-full">
      <button type="button" onClick={() => createProjectExample()} className="bg-transparent hover:bg-blue-400 px-4 py-2 rounded text-pink focus:outline-none">
        Generate report
      </button>
      <button onClick={() => generateReport()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
        <span>Download</span>
      </button>
    </div>
  );
}
