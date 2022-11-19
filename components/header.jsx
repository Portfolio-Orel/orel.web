import React from 'react';
import Head from 'next/head';

export default function MobileHeader() {
  return (
    <div className="flex flex-col w-fit px-4">
      <Head>
        <title>Orel Zilberman</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <h1 className="text-4xl text-text-secondary">Hi, I&apos;m Orel.</h1>
      <h3 className="text-3xl font-bold  text-text">I&apos;m a software developer. </h3>
    </div>
  );
}
