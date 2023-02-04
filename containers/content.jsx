import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/lottie_web_development.json';
import certificateLottie from '../public/lottie_certificate.json';
import DetailsCard from '../components/details-card';
import Button from '../components/button';

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

const TOPIC_FULL_STACK = 'fullstack';
const TOPIC_MOBILE = 'mobile';
const TOPIC_CERTIFICATIONS = 'certifications';
const TOPIC_GAME = 'game';

export default function Content() {
  const [selectedProfession, setSelectedProfession] = useState('');

  function setNewRoute() {
    Router.push(`/${selectedProfession}`);
  }

  useEffect(() => {
    if (selectedProfession) {
      setNewRoute();
    }
  }, [selectedProfession]);

  useEffect(() => {
    setSelectedProfession('');
  }, []);

  return (
    <div className="h-full w-full flex-column justify-center items-center">
      <div className="h-full w-full flex flex-row justify-center items-center">
        <DetailsCard
          title="Full Stack"
          experience="4"
          className={selectedProfession !== '' ? 'z-0' : 'z-20'}
          lottieConfig={fullStackLottieConfig}
          onSelected={() => {
            setSelectedProfession(TOPIC_FULL_STACK);
          }}
          onSelectedDismiss={() => {
            setSelectedProfession('');
          }}
          visible={selectedProfession === '' || selectedProfession === TOPIC_FULL_STACK}
        />
        <DetailsCard
          title="Mobile"
          experience="4"
          className={selectedProfession !== '' ? 'z-0' : 'z-20'}
          lottieConfig={mobileLottieConfig}
          onSelected={() => {
            setSelectedProfession(TOPIC_MOBILE);
          }}
          onSelectedDismiss={() => {
            setSelectedProfession('');
          }}
          visible={selectedProfession === '' || selectedProfession === TOPIC_MOBILE}
        />
        <DetailsCard
          title="Certificates"
          className={selectedProfession !== '' ? 'z-0' : 'z-20'}
          lottieConfig={certificateLottieConfig}
          onSelected={() => {
            setSelectedProfession(TOPIC_CERTIFICATIONS);
          }}
          onSelectedDismiss={() => {
            setSelectedProfession('');
          }}
          visible={selectedProfession === '' || selectedProfession === TOPIC_CERTIFICATIONS}
        />
        <Button
          onClick={() => setSelectedProfession(TOPIC_GAME)}
          className="z-20"
          text="Or play it!"
        />
      </div>
    </div>
  );
}
