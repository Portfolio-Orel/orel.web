import React from 'react';
// import Project from '../components/project';

// function Description(description) {
//   return <p className="text-text text-lg">{description}</p>;
// }

export default function Mobile() {
  return (
    <div className="overflow-y-auto text-text text-3xl flex justify-top items-center flex-col">
      <span className="p-2">Coming Soon...</span>
      <a
        className="text-xl"
        href="https://github.com/orgs/Portfolio-Orel/repositories?q=&type=all&language=kotlin&sort="
        target="_blank"
        rel="noreferrer"
      >
        {`You can check out my portfolio's repository for now :)`}
      </a>
      {/* <Project data={[]} /> */}
    </div>
  );
}
