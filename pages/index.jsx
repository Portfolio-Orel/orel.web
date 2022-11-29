import React from 'react';
import Head from 'next/head';
import Content from '../containers/content';
import Header from '../components/header';
import Auth from '../auth';

export default function Home() {
  Auth();

  return (
    <div className="h-full w-full flex flex-col align-top justify-start overflow-clip">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Header />
      <Content />
    </div>
  );
}
