import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Content from '../containers/content';
import Header from '../components/header';

export default function Home() {
  return (
    <motion.div className="h-full w-full flex flex-col align-top justify-start overflow-clip">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Header />
      <Content />
    </motion.div>
  );
}
