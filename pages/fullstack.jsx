import React from 'react';
import ProfessionWrapper from '../containers/profession-wrapper';

export default function FullStack() {
  // This component will display my full stack development projects with images and descriptions
  // The data will be fetched from a firestore function

  return (
    <ProfessionWrapper title={'Full Stack'}>
      <div className="overflow-y-auto text-text text-3xl flex justify-top items-center flex-col">
        <span className="p-2 text-xl">Coming Soon...</span>
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
    </ProfessionWrapper>
  );
}
