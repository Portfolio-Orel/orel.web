import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/lottie_web_development.json';
import certificateLottie from '../public/lottie_certificate.json';
import DetailsCard from '../components/details-card';
import Button from '../components/button';

const Lottie = {
  mobile: mobileLottie,
  fullStack: fullStackLottie,
  certificate: certificateLottie,
};

const GetLottieConfig = (lottie) => {
  const genericLottieConfig = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  switch (lottie) {
    case Lottie.mobile:
      genericLottieConfig.animationData = mobileLottie;
      break;
    case Lottie.fullStack:
      genericLottieConfig.animationData = fullStackLottie;
      break;
    case Lottie.certificate:
      genericLottieConfig.animationData = certificateLottie;
      genericLottieConfig.loop = false;
      genericLottieConfig.speed = 0.2;
      break;
    default:
      genericLottieConfig.animationData = mobileLottie;
      break;
  }
  return genericLottieConfig;
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
          lottieConfig={GetLottieConfig(Lottie.fullStack)}
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
          lottieConfig={GetLottieConfig(Lottie.mobile)}
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
          lottieConfig={GetLottieConfig(Lottie.certificate)}
          onSelected={() => {
            setSelectedProfession(TOPIC_CERTIFICATIONS);
          }}
          onSelectedDismiss={() => {
            setSelectedProfession('');
          }}
          visible={selectedProfession === '' || selectedProfession === TOPIC_CERTIFICATIONS}
          isActive = {false}
        />
        <div className="text-text flex justify-center items-center flex-col">
          <span className="text-lg">Still in production... But you can play it!</span>
          <Button
            onClick={() => setSelectedProfession(TOPIC_GAME)}
            className="z-20"
            text="Play"
          />
          <span className="text-text-secondary text-xs">Do it at your own risk </span>
          <span className="text-text-secondary text-xs">It might be a bit buggy.. ;)</span>
        </div>
      </div>
    </div>
  );
}
