import React from 'react';

export default function Footer() {
  return (
    <div className="flex flex-row w-screen justify-center items-center p-2">
      <a href="https://github.com/orgs/Portfolio-Orel/repositories" target="_blank">
        <img src="github.jpeg" alt="github" className="h-5 w-5 mx-1" />
      </a>
      <a href="https://www.linkedin.com/in/orel-zilberman-225a37137/" target="_blank">
        <img src="linkedin.jpeg" alt="github" className="h-5 w-5 mx-1" />
      </a>
    </div>
  );
}
