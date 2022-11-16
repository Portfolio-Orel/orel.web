import React, { useState } from 'react';
import Lottie from 'react-lottie';
import ExperienceHolder from './experience-holder';

export default function DetailsCard({ title, icon, disclaimers, experience, lottieConfig }) {
  const [lottieConfigCopy, setLottieConfigCopy] = useState(lottieConfig);
  const [isExpand, setIsExpand] = useState(false);

  const stopLottie = (shouldStop = true) => {
    const newLottieConfig = { ...lottieConfig };
    newLottieConfig.autoPlay = shouldStop;
    setLottieConfigCopy(newLottieConfig);
  };

  const expand = (shouldExpand = trued) => {
    setIsExpand(shouldExpand);
  };

  return (
    <div
      onMouseEnter={() => {
        stopLottie(true);
        expand(true);
      }}
      onMouseLeave={() => {
        stopLottie(false);
        expand(false);
      }}
      className="h-80 w-36 m-5 p-5 transition-all animate-floating bg-neutral shadow-xl shadow-shadow cursor-pointer hover:shadow-2xl hover:shadow-shadow hover:h-96 hover:w-48 rounded-md flex flex-col justify-between items-center"
    >
      <div className="flex flex-col w-auto items-center justify-center">
        <h1 className="text-text text-xl font-bold">{title}</h1>
        <ExperienceHolder experience={experience} isDisclaimer={disclaimers} className="m-4" />
      </div>
      {lottieConfig ? (
        <div className="w-auto flex justify-center">
          <Lottie options={lottieConfigCopy} height={100} width={100} />
        </div>
      ) : (
        ''
      )}
      <div className="h-1/6">
        {disclaimers
          ? disclaimers.map((disclaimer) => (
              <div className="text-sm text-text-secondary">* {disclaimer}</div>
            ))
          : ''}
      </div>
    </div>
  );
}
