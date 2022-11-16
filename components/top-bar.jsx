import React from 'react';

const items = ['About'];

export default function TopBar() {
  return (
    <div className="w-screen px-10 pt-2 flex justify-end">
      <div className='flex space-x-3'>
        {items.map((item) => (
          <h2 key={item} className="text-text cursor-pointer text-xl">{item}</h2>
        ))}
      </div>
    </div>
  );
}
