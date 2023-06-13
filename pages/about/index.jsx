import Link from 'next/link';
import React from 'react';
import data from '../../asset/data.json';
import Button from '../../components/button';

function Paragraph(paragraph) {
  function buildPragraph() {
    const { lines } = paragraph;
    return lines.map((line) => (
      <span key={line} className="text-text text-2xl">
        {line}
      </span>
    ));
  }

  return <div className="text-text text-lg font-light">{buildPragraph()}</div>;
}

export default function About() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center align-center mx-96">
        {data.about.paragraphs
          ? data.about.paragraphs.map((paragraph) => (
              <>
                {Paragraph(paragraph)} <br />
              </>
            ))
          : ''}
      </div>
      <div className="flex flex-row gap-6">
        {/* <Link className="text-text" href="files/cover-letter.pdf" target="_blank" rel="noreferrer">
          <Button text="Cover Letter" type="secondary" />
        </Link> */}
        <Link href="files/cv.pdf" className="text-text" target="_blank" rel="noreferrer">
          <Button text="CV" type="secondary" />
        </Link>
      </div>
    </div>
  );
}
