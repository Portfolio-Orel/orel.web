import Head from 'next/head';
import MobileHeader from '../components/headers/web-header';

export default function Web() {
  return (
    <div className="bg-background">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/resume.ico" />
      </Head>
      <WebHeader />
      <Content />
    </div>
  );
}
