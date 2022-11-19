import Head from 'next/head';
import TopBar from '../components/top-bar';
import Content from '../containers/content';
import Header from '../components/header';
import Footer from '../components/footer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div 
    className="h-full w-full flex flex-col align-top justify-start">
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
