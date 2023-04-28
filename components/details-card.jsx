import React, { useEffect, useState } from 'react';
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
  key,
  isActive,
  buttonEndIcon,
  useIsLoading, // Temporary, TODO: Delete when new screen is ready
}) {
  const [isHovered, setIsHovered] = useState(false);
  // TODO: Uncomment once the new screen is ready
  // eslint-disable-next-line no-unused-vars
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setIsClicked(false);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isActive) return;
        onSelected();
        setIsClicked(true && useIsLoading);
      }}
      className={`p-5 mt-5 transition-all cursor-pointer bg-neutral shadow-md shadow-shadow hover:shadow-xl flex flex-col justify-between items-center duration-400 h-88 w-48 animate-floating hover:shadow-shadow rounded-md m-5 ${className} `}
      role="button"
      key={key}
    >
      <div role="button">
        <div className="flex flex-col w-auto items-center justify-center">
          <h1 className="text-text text-2xl font-bold select-none">{title}</h1>
          <div className="text-text text-l font-bold m-3 h-5">
            <h2 className="select-none">{experience ? `${experience} years` : ''}</h2>
          </div>
        </div>
        {lottieConfig ? (
          <div className="w-auto flex justify-center cursor-none">
            <Lottie isClickToPauseDisabled options={lottieConfig} height={140} width={140} />
          </div>
        ) : (
          ''
        )}
        <div className="h-1/6 select-none">
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
                if (isActive) {
                  onSelected();
                }
              }}
              isLoading={isClicked && useIsLoading} // TODO: Uncomment once the new screen is ready
              endIcon={buttonEndIcon}
              isActive={isActive}
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
  key: Date.now().toString(),
  isActive: true,
  useIsLoading: false,
  buttonEndIcon: null,
};

DetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  experience: PropTypes.string,
  onSelected: PropTypes.func,
  disclaimers: PropTypes.arrayOf(PropTypes.string),
  lottieConfig: PropTypes.object,
  className: PropTypes.string,
  key: PropTypes.string,
  isActive: PropTypes.bool,
  buttonEndIcon: PropTypes.node,
  useIsLoading: PropTypes.bool,
};
