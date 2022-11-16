import React from 'react';

const items = ['Mobile', 'Web', 'About'];

export default function TopBar() {
  return (
    <div className="w-screen h-fit px-10 py-5 flex justify-between">
      <h3 className="text-text text-xl">Orel</h3>
      <div className="flex space-x-3">
        {items.map((item) => (
          <h2 className="text-text cursor-pointer text-xl">{item}</h2>
        ))}
      </div>
    </div>
  );
}
