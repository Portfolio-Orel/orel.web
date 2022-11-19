import React, { useState } from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Button from './button';

export default function DetailsCard({
  title,
  disclaimers,
  experience,
  lottieConfig,
  onSelected,
  onSelectedDismiss,
  className,
  visible,
  children,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const hovered = (shouldExpand = true) => {
    setIsHovered(shouldExpand);
  };

  const setSelected = (selected) => {
    setIsSelected(selected);
    if (selected) {
      onSelected();
    } else {
      onSelectedDismiss();
    }
  };

  const selectedContent = () => (
    <div className="h-full w-full overflow-auto">
      <div
        className="absolute cursor-pointer left-2 top-2 duration-1000 animate-appear"
        onClick={() => {
          setSelected(false);
        }}
        role="button"
      >
        <AiOutlineArrowLeft className="text-text" size={24} />
      </div>
      <div className="p-6 w-full h-full">{children}</div>
    </div>
  );

  const notSelectedContent = () => (
    <div onClick={() => setSelected(true)} className="cursor-pointer" role="button">
      <div className="flex flex-col w-auto items-center justify-center">
        <h1 className="text-text text-2xl font-bold">{title}</h1>
        <h2 className="text-text text-l font-bold m-3">{experience} years</h2>
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
      {isHovered ? (
        <Button
          onClick={() => {
            setSelected(true);
          }}
        />
      ) : (
        ''
      )}
    </div>
  );

  return (
    <div
      onMouseEnter={() => {
        hovered(true);
      }}
      onMouseLeave={() => {
        hovered(false);
      }}
      className={`p-5 mt-5 transition-all bg-neutral shadow-md shadow-shadow hover:shadow-xl flex flex-col justify-between items-center cursor-default ${className} 
        ${
          isSelected
            ? 'duration-1000 h-full w-full relative'
            : 'duration-700 h-88 w-48 animate-floating hover:shadow-shadow rounded-md m-5'
        } ${visible ? 'visible' : 'hidden'}`}
    >
      {!isSelected ? notSelectedContent() : selectedContent()}
    </div>
  );
}

DetailsCard.defaultProps = {
  onSelected: () => {},
  onSelectedDismiss: () => {},
  visible: true,
  disclaimers: [],
  lottieConfig: null,
  className: '',
};

DetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  experience: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  onSelected: PropTypes.func,
  onSelectedDismiss: PropTypes.func,
  disclaimers: PropTypes.arrayOf(PropTypes.string),
  lottieConfig: PropTypes.object,
  className: PropTypes.string,
};
