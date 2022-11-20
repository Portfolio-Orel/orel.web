import Link from 'next/link';
import React from 'react';
import data from '../../asset/data.json';

export default function About() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      {data.about.paragraphs
        ? data.about.paragraphs.map((paragraph) => {
            return (
              <>
                {Paragraph(paragraph)} <br />
              </>
            );
          })
        : 'Hello'}
      <Link className="text-text" href="files/cover-letter.pdf" target="_blank" rel="noreferrer">
        Cover Letter
      </Link>
      <Link href="files/resume.pdf" className="text-text" target="_blank" rel="noreferrer">
        Resume
      </Link>
    </div>
  );
}

const Paragraph = (paragraph) => {
  const buildPragraph = () => {
    const { lines } = paragraph;
    return lines.map((line, index) => {
      return (
        <span key={index} className="text-text text-lg">
          {line}
        </span>
      );
    });
  };

  return <body className="text-text text-lg font-light">{buildPragraph()}</body>;
};
