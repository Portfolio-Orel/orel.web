/* eslint-disable */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Certificate from '../components/certificate';
import ProfessionWrapper from '../containers/profession-wrapper';

export default function Certifications(props) {
  return props.error ? <Error /> : <Content {...props.certificates} />;
}

const Error = ({ error }) => (
  <div className="flex flex-col items-center justify-top w-full h-full text-text">
    <div className="p-4 text-3xl my-4">Cetificates</div>
    <h1>{error ? error : 'Something went wrong...'}</h1>
  </div>
);

const Content = (certifications) => (
  <ProfessionWrapper title={'Cetificates'}>
    <div className="flex flex-col items-center justify-top w-full h-full overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      {Object.keys(certifications).map((id) => (
        <div key={id} className="m-5">
          <Certificate certificate={certifications[id]} />
        </div>
      ))}
    </div>
  </ProfessionWrapper>
);

Certifications.defaultProps = {
  error: null,
};

Certifications.propTypes = {
  certificates: PropTypes.shape({
    title: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    units: PropTypes.string.isRequired,
    certificatePath: PropTypes.string.isRequired,
  }),
  error: PropTypes.string,
};

export async function getServerSideProps() {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}getCertifications`);
    const data = await result.json();
    return {
      props: {
        certificates: data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: 'Something went wrong',
      },
    };
  }
}
