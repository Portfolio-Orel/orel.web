import Head from 'next/head';

export default function MobileHeader() {
  return (
    <div className="flex flex-col w-fit p-4 pt-8">
      <Head>
        <title>Orel Zilberman</title>
        <link rel="icon" href="/resume.ico" />
      </Head>
      <h1 className="text-4xl text-text-secondary">Hi, I'm Orel.</h1>
      <h3 className="text-3xl font-bold  text-text">I'm a software developer. </h3>
    </div>
  );
}
