import Link from 'next/link';
import React from 'react';
import data from '../../asset/data.json';
import Button from '../../components/button';

function Paragraph(paragraph) {
  function buildPragraph() {
    const { lines } = paragraph;
    return lines.map((line) => (
      <span key={line} className="text-text text-lg">
        {line}
      </span>
    ));
  }

  return <body className="text-text text-lg font-light">{buildPragraph()}</body>;
}

export default function About() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      {data.about.paragraphs
        ? data.about.paragraphs.map((paragraph) => (
            <>
              {Paragraph(paragraph)} <br />
            </>
          ))
        : 'Hello'}
      <Link className="text-text" href="files/cover-letter.pdf" target="_blank" rel="noreferrer">
        <Button text="Cover Letter" type="secondary" />
      </Link>
      <Link href="files/resume.pdf" className="text-text" target="_blank" rel="noreferrer">
        <Button text="Resume" type="secondary" />
      </Link>
    </div>
  );
}
