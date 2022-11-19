import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Content from '../containers/content';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Home() {
  return (
    <motion.div className="h-full w-full flex flex-col align-top justify-start">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Header />
      <Content />
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </motion.div>
  );
}
