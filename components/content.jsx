import React from 'react';
import mobileLottie from '../public/lottie_mobile_development';
import fullStackLottie from '../public/web-dev';
import DetailsCard from './details-card/details-card';
import { Player } from '@lottiefiles/react-lottie-player';

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
  src: 'https://assets6.lottiefiles.com/packages/lf20_uzvwjpkq.json',
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
      <Player
        autoplay
        loop
        src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
        style={{ height: '300px', width: '300px' }}
      >
      </Player>
    </div>
  );
}
