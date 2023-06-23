import Link from 'next/link';
import React from 'react';
import LottieComponent from 'react-lottie';
import data from '../../asset/data.json';
import Button from '../../components/button';
import newTabLottie from '../../public/lottie_new_tab.json';

const newTabLottieProps = {
  loop: false,
  autoplay: true,
  animationData: newTabLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

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
      <div className="flex flex-col align-center mx-10 my-5 sm:mx-96 overflow-auto">
        {data.about.paragraphs
          ? data.about.paragraphs.map((paragraph) => (
              <>
                {Paragraph(paragraph)} <br />
              </>
            ))
          : ''}
      </div>
      <div className="flex flex-row gap-6">
        <Link href="files/cv.pdf" className="text-text" target="_blank" rel="noreferrer">
          <Button
            text="My Resume"
            type="primary"
            endIcon={
              <LottieComponent
                isClickToPauseDisabled
                options={newTabLottieProps}
                height={20}
                width={20}
              />
            }
          />
        </Link>
      </div>
    </div>
  );
}
