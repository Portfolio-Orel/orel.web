import Head from 'next/head';
import Content from '../components/content';
import MobileHeader from '../components/header';
import TopBar from '../components/top-bar';

export default function Mobile() {
  return (
    <div className="h-screen w-screen bg-background flex flex-col align-top justify-start">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/resume.ico" />
      </Head>
      <TopBar />
      <MobileHeader />
      <Content />
    </div>
  );
}
