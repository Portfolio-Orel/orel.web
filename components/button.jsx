import React from 'react';
import PropTypes from 'prop-types';

const TYPE_PRIMARY = 'primary';
const TYPE_SECONDARY = 'secondary';
const TYPE_TERTIARY = 'tertiary';

const types = [TYPE_PRIMARY, TYPE_SECONDARY, TYPE_TERTIARY];

export default function Button({ text, type, onClick }) {
  const buttonType = types.includes(type) ? type : TYPE_PRIMARY;

  function getButtonClassName() {
    switch (buttonType) {
      case TYPE_PRIMARY:
        return 'text-text bg-primary font-xl font-semibold text-text rounded-lg';
      case TYPE_SECONDARY:
        return 'text-text bg-text-secondary font-xl font-semibold text-text px-4 py-2 rounded-lg shadow-md shadow-shadow';
      case TYPE_TERTIARY:
        return 'text-text bg-neutral font-xl font-semibold text-text pd-4 rounded-lg';
      default:
        return 'bg-primary font-xl font-semibold text-text rounded-lg';
    }
  }

  return (
    <div
      className={`cursor-pointer flex justify-center items-center w-fill mx-1 mt-1 rounded-xl px-4 ${getButtonClassName()}`}
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
}

Button.defaultProps = {
  text: "I'm intrigued",
  type: TYPE_PRIMARY,
  onClick: () => {},
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  type: PropTypes.oneOf(types),
};
