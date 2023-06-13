import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import LottieComponent from 'react-lottie';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/lottie_web_development.json';
import certificateLottie from '../public/lottie_certificate.json';
import newTabLottie from '../public/lottie_new_tab.json';
import DetailsCard from '../components/details-card';

import { GITHUB_FULLSTACK, GITHUB_MOBILE } from '../common/consts';

const Lottie = {
  mobile: mobileLottie,
  fullStack: fullStackLottie,
  certificate: certificateLottie,
  newTab: newTabLottie,
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
    case Lottie.newTab:
      genericLottieConfig.animationData = newTabLottie;
      genericLottieConfig.loop = false;
      genericLottieConfig.speed = 0.1;
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
// TODO: Uncomment when the game is ready
// eslint-disable-next-line no-unused-vars
const TOPIC_GAME = 'game';

export default function Content() {
  const [selectedProfession, setSelectedProfession] = useState('');

  function setNewRoute() {
    Router.push(`/${selectedProfession}`);
  }

  /* TEMPORARY - UNTIL I FIX sm:justify-center */
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowSizeChange);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleWindowSizeChange);
      }
    };
  }, []);
  /* TEMPORARY - UNTIL I FIX sm:justify-center */

  useEffect(() => {
    if (selectedProfession) {
      // setNewRoute(); // TODO: Create a page with the profession portfolio
      let url;
      switch (selectedProfession) {
        case TOPIC_FULL_STACK:
          url = GITHUB_FULLSTACK;
          break;
        case TOPIC_MOBILE:
          url = GITHUB_MOBILE;
          break;
        default:
          setNewRoute();
          return;
      }
      if (window && url) {
        window.open(`${url}`, '_blank');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfession]);

  useEffect(() => {
    setSelectedProfession('');
  }, []);

  return (
    <div
      className={`w-full h-full flex ${
        width > 700 ? 'justify-center' : ''
      } flex-row items-center overflow-auto`}
    >
      <DetailsCard
        title="Full Stack"
        experience="5"
        className={selectedProfession !== '' ? 'z-0' : 'z-20'}
        lottieConfig={GetLottieConfig(Lottie.fullStack)}
        onSelected={() => {
          setSelectedProfession(TOPIC_FULL_STACK);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        buttonEndIcon={
          <LottieComponent
            isClickToPauseDisabled
            options={GetLottieConfig(Lottie.newTab)}
            height={20}
            width={20}
          />
        } // TODO: Remove when the new screen is ready
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
        buttonEndIcon={
          <LottieComponent
            isClickToPauseDisabled
            options={GetLottieConfig(Lottie.newTab)}
            height={20}
            width={20}
          />
        } // TODO: Remove when the new screen is ready
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
        useIsLoading
      />
      {/* <div className="text-text flex justify-center items-center flex-col" style={{border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: 16}}>
          <span className="text-lg">Still in production... But you can test it out!</span>
          <Button
            onClick={() => setSelectedProfession(TOPIC_GAME)}
            className="z-20 mx-1 my-4 p-2 text-2xl"
            text="Play"
          />
          <span className="text-text-secondary text-xs">Do it at your own risk </span>
          <span className="text-text-secondary text-xs">It might be a bit buggy... ;)</span>
        </div> */}
    </div>
  );
}
