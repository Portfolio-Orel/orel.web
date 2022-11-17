import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ text }) {
  return (
    <div className="cursor-pointer flex justify-center items-center w-fill mx-1 mt-1 rounded-xl px-4">
      <div className="font-xl font-semibold text-text transition-opacity  animate-appear">{text}</div>
    </div>
  );
  
}

Button.defaultProps = {
  text: "I'm interested",
};

Button.propTypes = {
  text: PropTypes.string,
};
