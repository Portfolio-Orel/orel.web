import React from 'react';
import PropTypes from 'prop-types';

const TYPE_PRIMARY = 'primary';
const TYPE_SECONDARY = 'secondary';
const TYPE_TERTIARY = 'tertiary';

const types = [TYPE_PRIMARY, TYPE_SECONDARY, TYPE_TERTIARY];

export default function Button({ text, type, onClick }) {
  const buttonType = types.includes(type) ? type : TYPE_PRIMARY;

  function getButton() {
    switch (buttonType) {
      case TYPE_PRIMARY:
        return <ButtonPrimary text={text} onClick={onClick} />;
      case TYPE_SECONDARY:
        return <ButtonSecondary text={text} onClick={onClick} />;
      case TYPE_TERTIARY:
        return <ButtonTertiary text={text} onClick={onClick} />;
      default:
        return <ButtonPrimary text={text} onClick={onClick} />;
    }
  }

  return (
    <div className="cursor-pointer flex justify-center items-center w-fill mx-1 mt-1 rounded-xl px-4">
      {getButton(text, onClick)}
    </div>
  );
}

function ButtonPrimary({ text, onClick }) {
  return (
    <div
      className="bg-primary font-xl font-semibold text-text transition-opacity animate-appear"
      key="button-primary"
      role="button"
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
}

function ButtonSecondary({ text, onClick }) {
  return (
    <div
      className="bg-secondary font-xl font-semibold text-text transition-opacity animate-appear"
      key="button-secondary"
      role="button"
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
}

function ButtonTertiary({ text, onClick }) {
  return (
    <div
      className="bg-neutral font-xl font-semibold text-text transition-opacity animate-appear"
      key="button-tertiary"
      role="button"
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
