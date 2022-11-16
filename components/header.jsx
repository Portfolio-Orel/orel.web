import Head from 'next/head';

export default function MobileHeader() {
  return (
    <div className="flex flex-col w-fit p-4 pt-8">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/resume.ico" />
      </Head>
      <h1 className="text-4xl font-bold text-text">Hi, I'm Orel.</h1>
      <h3 className="text-3xl text-text-secondary">I'm a full stack developer. </h3>
    </div>
  );
}
