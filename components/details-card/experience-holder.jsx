import React from 'react';

export default function ExperienceHolder({ experience, isDisclaimer, className }) {
  return (
    <div
      className={`h-20 w-20 rounded-full border-4 border-info flex flex-col items-center justify-center ${className}`}
    >
      <div className="flex flex-row">
        <h1 className="text-2xl">{experience}</h1>
        {isDisclaimer ? <h3 className="text-text-secondary pl-0.5 ">*</h3> : ''}
      </div>
      <h2>Years</h2>
    </div>
  );
}
