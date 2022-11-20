import React from 'react';
import data from '../../asset/data.json';
import Link from 'next/link';

export default function About() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-text">{data.about}</h1>
      <Link className="text-text" href="files/cover-letter.pdf" target="_blank" rel="noreferrer">
        Cover Letter
      </Link>
      <Link href="files/resume.pdf" className="text-text" target="_blank" rel="noreferrer">
        Resume
      </Link>
    </div>
  );
}
