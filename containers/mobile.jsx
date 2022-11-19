import React from 'react';

export default function Mobile() {
  return (
    <div className="overflow-y-auto h-full w-full text-text text-3xl flex justify-center items-center flex-col">
      <span className="p-2">Coming Soon...</span>
      <a
        className="text-xl"
        href="https://github.com/orgs/Portfolio-Orel/repositories"
        target="_blank"
        rel="noreferrer"
      >
        {`You can check out my portfolio's repository for now :)`}
      </a>
    </div>
  );
}
