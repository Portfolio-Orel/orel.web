import Head from 'next/head';
import TopBar from '../components/top-bar';
import Content from '../components/content';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div className="h-screen w-screen bg-background flex flex-col align-top justify-start">
      <Head>
        <title>Orels Zilberman</title>
        <link rel="icon" href="/resume.ico" />
      </Head>
      <TopBar />
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
