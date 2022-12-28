import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

export default function ProfessionWrapper({ title, children }) {
  return (
    <div className="overflow-y-auto h-full w-full text-text text-3xl flex justify-top items-center flex-col">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/icon.png" />
      </Head> 
      <div className="p-4 text-3xl underline underline-offset-1 font-bold my-4">{title}</div>
      {children}
    </div>
  );
}

ProfessionWrapper.defaultProps = {
  title: 'Coming Soon...',
  children: null,
};

ProfessionWrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
