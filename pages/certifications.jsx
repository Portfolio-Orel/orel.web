/* eslint-disable */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Certificate from '../components/certificate';
import ProfessionWrapper from '../containers/profession-wrapper';

export default function Certificates(certificates) {
  return (
    <ProfessionWrapper title={'Cetificates'}>
      <div className="flex flex-col items-center justify-top w-full h-full overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
        {Object.keys(certificates).map((id) => (
          <div key={id} className="m-5">
            <Certificate certificate={certificates[id]} />
          </div>
        ))}
      </div>
    </ProfessionWrapper>
  );
}

Certificates.propTypes = {
  certificates: PropTypes.shape({
    title: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    units: PropTypes.string.isRequired,
    certificatePath: PropTypes.string.isRequired,
  }).isRequired,
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/certifications`);
  return {
    props: data,
  };
}
