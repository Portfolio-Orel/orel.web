import { motion, AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import TopBar from '../components/top-bar';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="h-screen w-screen bg-background font-Poppins flex flex-col">
      <TopBar className={'z-20'} />
      <AnimatePresence>
        <motion.div
          className={`h-full w-full pt-8 ${isAnimating ? 'absolute overflow-hidden z10' : ''}`} // Trick to make the animations of the 2 pages overlap smoothly
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationEnd={() => setIsAnimating(false)}
          key={router.route}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{
            duration: 0.5,
          }}
          variants={{
            initialState: {
              opacity: 0,
            },
            animateState: {
              opacity: 1,
            },
            exitState: {
              opacity: 0,
            },
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default MyApp;
