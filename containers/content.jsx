import React, { useState } from 'react';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/lottie_web_development.json';
import certificateLottie from '../public/lottie_certificate.json';
import DetailsCard from '../components/details-card';
import Mobile from './mobile';
import FullStack from './fullstack';
import Certificates from './certificates';

const mobileLottieConfig = {
  loop: true,
  autoplay: true,
  animationData: mobileLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const fullStackLottieConfig = {
  loop: true,
  autoplay: true,
  animationData: fullStackLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const certificateLottieConfig = {
  loop: false,
  autoplay: true,
  animationData: certificateLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
  speed: 0.2,
};

const TOPIC_FULL_STACK = 'topic_full_stack';
const TOPIC_MOBILE = 'topic_android';
const TOPIC_CERTIFICATES = 'topic_certificates';

export default function Content() {
  const [selectedProfession, setSelectedProfession] = useState('');

  return (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <DetailsCard
        title="Full Stack"
        experience="4"
        className={selectedProfession != '' ? 'z-0' : 'z-20'}
        lottieConfig={fullStackLottieConfig}
        onSelected={() => {
          setSelectedProfession(TOPIC_FULL_STACK);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        visible={selectedProfession == '' || selectedProfession == TOPIC_FULL_STACK}
      >
        <FullStack />
      </DetailsCard>
      <DetailsCard
        title="Mobile"
        experience="4"
        className={selectedProfession != '' ? 'z-0' : 'z-20'}
        lottieConfig={mobileLottieConfig}
        onSelected={() => {
          setSelectedProfession(TOPIC_MOBILE);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        visible={selectedProfession == '' || selectedProfession == TOPIC_MOBILE}
      >
        <Mobile />
      </DetailsCard>
      <DetailsCard
        title="Certificates"
        className={selectedProfession != '' ? 'z-0' : 'z-20'}
        lottieConfig={certificateLottieConfig}
        onSelected={() => {
          setSelectedProfession(TOPIC_CERTIFICATES);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        visible={selectedProfession == '' || selectedProfession == TOPIC_CERTIFICATES}
      >
        <Certificates />
      </DetailsCard>
    </div>
  );
}
