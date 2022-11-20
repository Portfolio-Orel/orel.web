import React from 'react';
import resume from '../../asset/download/resume.pdf';
import  Router from 'next/router';

export default function Resume() {
  Router.push(
    {
      pathname: '/products',
      query: { sortBy: 'price' },
    },
    undefined,
    { shallow: true }
  );
  // Open a pdf in a new tab
  const openResume = () => {
    window.open(resume);
  };
  return (
    <>
      <div className="text-text" onClick={() => openResume()}>
        Open Resume
      </div>
      <a className="text-text" href={resume} download="pdf">
        Download
      </a>
    </>
  );
}
