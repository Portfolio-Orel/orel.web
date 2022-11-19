import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const variants = {
  in: {
    opacity: 1,
    // scale: 1,
    // y: 0,
    // transition: {
    //   duration: 0.75,
    //   delay: 0.5,
    // },
  },
  out: {
    opacity: 0,
    // scale: 1,
    // y: 40,
    // transition: {
    //   duration: 0.75,
    // },
  },
};

export default function About() {
  const { asPath } = useRouter();

  return (
    <div className="h-screen w-screen bg-primary">
      <AnimatePresence initial={true} exitBeforeEnter>
        <motion.div key={asPath} variants={variants} animate="in" initial="out" exit="out">
          <h1>About</h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
