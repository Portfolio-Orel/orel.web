import React from 'react';

export default function DetailsCard({ title, icon, description }) {
  return (
    <div className="h-72 w-32 m-5 p-5 transition-all animate-floating bg-neutral shadow-xl shadow-shadow cursor-pointer hover:animate-none hover:shadow-2xl hover:shadow-shadow hover:h-80 hover:w-40 rounded-md">
      <h1 className="text-text">{title}</h1>
      <h2 className="text-text-secondary">{description}</h2>
    </div>
  );
}
