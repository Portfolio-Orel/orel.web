import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../components/button';

export default function Certificate({ certificate }) {
  return (
    <div className="flex flex-col items-center justify-top w-full h-full animate-expand-appear">
      <Image
        src={certificate.image ? certificate.image : ''}
        alt="certificate"
        height={200}
        width={200}
      />
      <h1 className="text-text text-2xl font-bold text-center">{certificate.title}</h1>
      <h1 className="text-text opacity-50 text-xl font-bold text-center">{certificate.length}</h1>
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
    image: PropTypes.string.isRequired,
  }).isRequired,
};
