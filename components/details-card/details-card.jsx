import React, { useState } from 'react';
import Lottie from 'react-lottie';
import ExperienceHolder from './experience-holder';
import PropTypes from 'prop-types';
import Button from '../Button';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function DetailsCard({
  title,
  disclaimers,
  experience,
  lottieConfig,
  onSelected,
  selectedContent,
  onSelectedDismiss,
  className,
  visible,
}) {
  const [lottieConfigCopy, setLottieConfigCopy] = useState(lottieConfig);
  const [isExpand, setIsExpand] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

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
      className={`h-88 w-48 p-5 transition-all bg-neutral shadow-lg shadow-shadow hover:shadow-xl flex flex-col justify-between items-center cursor-default ${className} 
        ${
          isSelected
            ? 'h-full w-full'
            : 'animate-floating hover:shadow-shadow hover:h-96 hover:w-48 rounded-md m-5'
        } ${visible ? 'visible' : 'hidden'}`}
    >
      {!isSelected ? (
        <div>
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
          {isExpand ? (
            <Button
              onClick={() => {
                setIsSelected(true);
                onSelected();
              }}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            className="m-3 absolute cursor-pointer"
            onClick={() => {
              setIsSelected(false);
              onSelectedDismiss();
            }}
          >
            <AiOutlineArrowLeft className="text-text top-0 left-0" height={40} width={40} />
          </div>
        </div>
      )}
      {isSelected ? <selectedContent /> : ''}
    </div>
  );
}

DetailsCard.defaultProps = {
  onSelected: () => {},
  onSelectedDismiss: () => {},
  visible: true,
};

DetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  experience: PropTypes.string.isRequired,
  selectedContent: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  onSelected: PropTypes.func,
  onSelectedDismiss: PropTypes.func,
  disclaimers: PropTypes.arrayOf(PropTypes.string),
  lottieConfig: PropTypes.any,
  className: PropTypes.string,
};
