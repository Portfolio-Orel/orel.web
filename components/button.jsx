import React from 'react';
import PropTypes from 'prop-types';
import Loading from './loading';

const TYPE_PRIMARY = 'primary';
const TYPE_SECONDARY = 'secondary';
const TYPE_TERTIARY = 'tertiary';

const types = [TYPE_PRIMARY, TYPE_SECONDARY, TYPE_TERTIARY];

export default function Button({ text, type, onClick, isLoading, isActive, className, endIcon }) {
  const buttonType = types.includes(type) ? type : TYPE_PRIMARY;

  function getButtonClassName() {
    switch (buttonType) {
      case TYPE_PRIMARY:
        return 'text-text bg-primary font-semibold rounded-lg px-4 py-2 rounded-lg shadow-md shadow-shadow';
      case TYPE_SECONDARY:
        return 'text-text bg-text-secondary font-semibold text-text px-4 py-2 rounded-lg shadow-md shadow-shadow';
      case TYPE_TERTIARY:
        return 'text-text bg-neutral font-semibold text-text pd-4 rounded-lg';
      default:
        return 'bg-primary font-semibold text-text rounded-lg';
    }
  }

  return (
    <div
      className={`cursor-pointer flex justify-center items-center w-fill text-lg ${getButtonClassName()}  ${className}`}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`flex flex-row justify-center items-center gap-2 rounded-xl select-none`}
          onClick={() => {
            if (isActive) {
              onClick();
            }
          }}
          role="button"
        >
          {isActive ? text : 'Soon..'}
          {endIcon}
        </div>
      )}
    </div>
  );
}

Button.defaultProps = {
  text: "I'm intrigued",
  type: TYPE_PRIMARY,
  onClick: () => {},
  isLoading: false,
  isActive: true,
  className: '',
  endIcon: null,
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  type: PropTypes.oneOf(types),
  isLoading: PropTypes.bool,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  endIcon: PropTypes.node,
};
