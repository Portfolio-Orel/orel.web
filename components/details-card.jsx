import React, { useState } from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import Button from './button';

export default function DetailsCard({
  title,
  disclaimers,
  experience,
  lottieConfig,
  onSelected,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onSelected();
        setIsClicked(true);
      }}
      className={`p-5 mt-5 transition-all cursor-pointer bg-neutral shadow-md shadow-shadow hover:shadow-xl flex flex-col justify-between items-center duration-400 h-88 w-48 animate-floating hover:shadow-shadow rounded-md m-5 ${className} `}
      role="button"
    >
      <div role="button">
        <div className="flex flex-col w-auto items-center justify-center">
          <h1 className="text-text text-2xl font-bold">{title}</h1>
          <div className="text-text text-l font-bold m-3 h-5">
            <h2>{experience ? `${experience} years` : ''}</h2>
          </div>
        </div>
        {lottieConfig ? (
          <div className="w-auto flex justify-center cursor-none">
            <Lottie isClickToPauseDisabled options={lottieConfig} height={140} width={140} />
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
        {isHovered || isClicked ? (
          <div className="flex items-center justify-center mt-5 transition-all animate-appear">
            <Button
              type="tertiary"
              onClick={() => {
                onSelected();
              }}
              isLoading={isClicked}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

DetailsCard.defaultProps = {
  onSelected: () => {},
  experience: null,
  disclaimers: [],
  lottieConfig: null,
  className: '',
};

DetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  experience: PropTypes.string,
  onSelected: PropTypes.func,
  disclaimers: PropTypes.arrayOf(PropTypes.string),
  lottieConfig: PropTypes.object,
  className: PropTypes.string,
};
