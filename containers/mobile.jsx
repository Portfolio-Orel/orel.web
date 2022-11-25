import React from 'react';
// import Project from '../components/project';

// function Description(description) {
//   return <p className="text-text text-lg">{description}</p>;
// }

export default function FullStack() {
  return (
    <div className="overflow-y-auto h-full w-full text-text text-3xl flex justify-center items-center flex-col">
            <span className="p-2">Coming Soon...</span>
      <a
        className="text-xl"
        href="https://github.com/Portfolio-Orel/orel.web"
        target="_blank"
        rel="noreferrer"
      >
        {`You can check out this website's repository for now :)`}
      </a>
      {/* <Project
        data={[]}
      /> */}
    </div>
  );
}
