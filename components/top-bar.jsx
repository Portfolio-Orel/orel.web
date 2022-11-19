import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Image from 'next/image';

const items = [{ title: 'About', page: 'about' }];
export default function TopBar({ className }) {
  return (
    <div className={`w-screen px-10 pt-3 flex justify-between ${className}`}>
      <Link href={'/'} className="text-text  text-xl">
        <Image src="/icon.png" alt="Orel Zilberman icon" width={40} height={40} />
      </Link>
      <div className="flex space-x-3">
        {items.map((item) => (
          <h2 key={item} className="text-text cursor-pointer text-xl">
            <Link href={`/${item.page}`}>{item.title}</Link>
          </h2>
        ))}
      </div>
    </div>
  );
}

TopBar.defaultProps = {
  className: '',
};

TopBar.propTypes = {
  className: PropTypes.string,
};
