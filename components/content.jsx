import React from 'react';
import DetailsCard from './details-card/details-card';
import fullStackLottie from '../public/lottie_full_stack.json';

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
      <DetailsCard
        title="Full Stack"
        experience="3"
        lottieConfig={fullStackLottieConfig}
      />
      <DetailsCard
        title="Mobile"
        experience="4"
        disclaimers={['4 Freelance', '1 Professional']}
        lottieConfig={fullStackLottieConfig}
      />
    </div>
  );
}
