import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Button from './button';

export default function Certificate({ certificate }) {
  return (
    <div className="flex flex-col items-center justify-top w-full h-full">
      <Image
        src={certificate.image ? certificate.image : ''}
        alt="certificate"
        height={250}
        width={250}
      />
      <h1 className="text-text text-2xl font-bold text-center">{certificate.title}</h1>
      <h1 className="text-text opacity-50 text-xl font-bold text-center">
        {certificate.length} {certificate.units}
      </h1>
      <Link
        href={certificate.certificatePath}
        className="text-text"
        target="_blank"
        rel="noreferrer"
      >
        <Button text="Certificate" type="secondary" />
      </Link>
    </div>
  );
}

Certificate.propTypes = {
  certificate: PropTypes.shape({
    title: PropTypes.string.isRequired,
    length: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
};
