/* eslint-disable */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import TopBar from '../components/top-bar';
import { useRouter } from 'next/router';
import Footer from '../components/footer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="h-screen w-screen bg-background font-Poppins grid grid-rows-layout overflow-hidden">
      <TopBar className={'z-20 row-start-1 row-end-1'} />
      <AnimatePresence>
        <motion.div
          className={`h-full w-full row-start-2 row-end-2 overflow-auto ${
            isAnimating ? 'absolute overflow-hidden z10 pt-16' : 'pt-4.5'
          }`} // Trick to make the animations of the 2 pages overlap smoothly
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationEndCapture={() => setIsAnimating(false)}
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
      <div className="row-start-3 row-end-3 flex items-center justify-center pb-2">
        <Footer />
      </div>
    </div>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
