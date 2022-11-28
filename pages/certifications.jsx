import React from 'react';
import Certificate from '../components/certificate';
import ProfessionWrapper from '../containers/profession-wrapper';
import axios from 'axios';

export default function Certificates(props) {
  return (
    <ProfessionWrapper title={'Cetificates'}>
      <div className="flex flex-col items-center justify-top w-full h-full overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
        {Object.keys(props).map((id) => (
          <div key={id} className="m-5">
            <Certificate certificate={props[id]} />
          </div>
        ))}
      </div>
    </ProfessionWrapper>
  );
}

export async function getServerSideProps(_) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/certifications`);
  return {
    props: res.data,
  };
}
