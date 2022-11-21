import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function LinkButton({ children, href, target, rel }) {
  return (
    <Link className="text-text" href={href} target={target} rel={rel}>
      {children}
    </Link>
  );
}

LinkButton.defaultProps = {
  target: '_blank',
  rel: 'noreferrer',
};

LinkButton.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
  rel: PropTypes.string,
};
