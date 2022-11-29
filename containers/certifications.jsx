import React from 'react';
import Certificate from '../components/certificate';

export default function Certificates() {
  return (
    <div className="flex flex-col items-center justify-top w-full h-full">
      {certificates.map((certificate) => (
        <div className="m-5">
          <Certificate certificate={certificate} />
        </div>
      ))}
    </div>
  );
}
