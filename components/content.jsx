import React from 'react';
import mobileLottie from '../public/lottie_mobile_development.json';
import fullStackLottie from '../public/web-dev.json';
import DetailsCard from './details-card/details-card';

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

export default function Content() {
  return (
    <div className="h-full w-fill flex flex-row justify-center items-center">
      <DetailsCard title="Full Stack" experience="3" lottieConfig={fullStackLottieConfig} />
      <DetailsCard
        title="Mobile"
        experience="4"
        disclaimers={['4 Freelance', '1 Professional']}
        lottieConfig={mobileLottieConfig}
      />
    </div>
  );
}
