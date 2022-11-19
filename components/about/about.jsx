import React from 'react';
import PropTypes from 'prop-types';

export default function About({ onDismiss, className }) {
  return (
    <div className={`${className} bg-primary h-full w-full`}>
      <div></div>
    </div>
  );
}

About.propTypes = {
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};
