import React from 'react';
import Link from 'next/link';

const items = [{ title: 'About', page: 'about' }];
export default function TopBar() {
  return (
    <div className="w-screen px-10 pt-2 flex justify-end">
      <div className="flex space-x-3">
        {items.map((item) => (
          <h2
            key={item}
            className="text-text cursor-pointer text-xl"
          >
            <Link href={`/${item.page}`}>{item.title}</Link>
          </h2>
        ))}
      </div>
    </div>
  );
}
