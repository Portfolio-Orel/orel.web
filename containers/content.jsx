import React, { useState } from 'react';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/web-dev.json';
import DetailsCard from '../components/details-card/details-card';
import Mobile from './mobile';
import FullStack from './fullstack';

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

const PROFESSION_FULL_STACK = 'profession_full_stack';
const PROFESSION_MOBILE = 'profession_android';

export default function Content() {
  const [selectedProfession, setSelectedProfession] = useState('');

  return (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <DetailsCard
        title="Full Stack"
        experience="3"
        className={selectedProfession != '' ? 'z-0' : 'z-20'}
        lottieConfig={fullStackLottieConfig}
        onSelected={() => {
          setSelectedProfession(PROFESSION_FULL_STACK);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        visible={selectedProfession == '' || selectedProfession == PROFESSION_FULL_STACK}
      >
        <FullStack />
      </DetailsCard>
      <DetailsCard
        title="Mobile"
        experience="4"
        className={selectedProfession != '' ? 'z-0' : 'z-20'}
        lottieConfig={mobileLottieConfig}
        selectedContent={<Mobile />}
        onSelected={() => {
          setSelectedProfession(PROFESSION_MOBILE);
        }}
        onSelectedDismiss={() => {
          setSelectedProfession('');
        }}
        visible={selectedProfession == '' || selectedProfession == PROFESSION_MOBILE}
      >
        <Mobile />
      </DetailsCard>
    </div>
  );
}
