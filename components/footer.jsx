import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

export default function Footer({ className }) {
  const iconSize = 20;
  return (
    <div className={`flex flex-row w-screen justify-center items-center p-2 ${className}`}>
      <a
        href="https://github.com/orgs/Portfolio-Orel/repositories"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src="/github.jpeg"
          alt="github"
          className="mx-1"
          width={iconSize}
          height={iconSize}
        />
      </a>
      <a
        href="https://www.linkedin.com/in/orel-zilberman-225a37137/"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src="/linkedin.jpeg"
          alt="github"
          className="mx-1"
          width={iconSize}
          height={iconSize}
        />
      </a>
    </div>
  );
}

Footer.defaultProps = {
  className: '',
};

Footer.propTypes = {
  className: PropTypes.string,
};
