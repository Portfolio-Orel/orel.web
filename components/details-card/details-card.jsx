import React, { useState } from 'react';
import Lottie from 'react-lottie';
import ExperienceHolder from './experience-holder';
import PropTypes from 'prop-types';
import Button from '../Button';

export default function DetailsCard({ title, disclaimers, experience, lottieConfig }) {
  const [lottieConfigCopy, setLottieConfigCopy] = useState(lottieConfig);
  const [isExpand, setIsExpand] = useState(false);

  const stopLottie = (shouldStop = true) => {
    const newLottieConfig = { ...lottieConfig };
    newLottieConfig.autoPlay = shouldStop;
    setLottieConfigCopy(newLottieConfig);
  };

  const expand = (shouldExpand = true) => {
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
      className="h-88 w-48 m-5 p-5 transition-all animate-floating bg-neutral shadow-lg shadow-shadow hover:shadow-xl hover:shadow-shadow hover:h-96 hover:w-48 rounded-md flex flex-col justify-between items-center cursor-default"
    >
      <div className="flex flex-col w-auto items-center justify-center">
        <h1 className="text-text text-xl font-bold">{title}</h1>
        <ExperienceHolder
          experience={experience}
          isDisclaimer={disclaimers ? true : false}
          className="m-4"
        />
      </div>
      {lottieConfig ? (
        <div className="w-auto flex justify-center cursor-none">
          <Lottie
            isClickToPauseDisabled={true}
            options={lottieConfigCopy}
            height={140}
            width={140}
          />
        </div>
      ) : (
        ''
      )}
      <div className="h-1/6">
        {disclaimers
          ? disclaimers.map((disclaimer) => (
              <div key={disclaimer} className="text-sm text-text-secondary">
                * {disclaimer}
              </div>
            ))
          : ''}
      </div>
      {isExpand ? <Button /> : ''}
    </div>
  );
}

DetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  experience: PropTypes.number.isRequired,
  disclaimers: PropTypes.arrayOf(PropTypes.string),
  lottieConfig: PropTypes.any,
};
