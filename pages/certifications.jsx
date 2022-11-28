import React from 'react';
import Certificate from '../components/certificate';
import machineLearningImage from '../public/courses/Machine_Learning.jpg';
import cyberSecurityVol1Image from '../public/courses/Cyber_Security_1.jpg';

const machineLearningCertificate = {
  title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',
  length: '43 hours',
  key: 'machine-learning',
  image: machineLearningImage,
  certificatePath: 'courses/certificates/Certificate_Machine_Learning.jpg',
};

const cyberSecurityVol1 = {
  title: 'The Complete Cyber Security Course : Hackers Exposed!',
  length: '12 hours',
  key: 'Cyber_Security_1',
  image: cyberSecurityVol1Image,
  certificatePath: 'courses/certificates/Certificate_Cyber_Security_1.jpg',
};

const certificates = [machineLearningCertificate, cyberSecurityVol1];

export default function Certificates() {
  return (
    <div className="flex flex-col items-center justify-top w-full h-full overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      {certificates.map((certificate) => (
        <div key={certificate.key} className="m-5">
          <Certificate certificate={certificate} />
        </div>
      ))}
    </div>
  );
}
