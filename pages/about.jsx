import React from 'react';
import data from '../asset/data.json';
import resume from '../asset/download/resume.pdf';
import coverLetter from '../asset/download/cover-letter.pdf';

export default function About() {
  const openResume = () => {
    window.open(coverLetter);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-text">{data.about}</h1>
      <a className="text-text" href={coverLetter} target="_blank">
        Cover Letter
      </a>
      <a className="text-text" onClick={() => openResume()}>
        Resume
      </a>
      <iframe
            style={{ width: "563px", height: "666px" }}
            src={resume}
            type='application/pdf'
            title='title'
          />
    </div>
  );
}
