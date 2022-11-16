import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='font-Roboto'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
