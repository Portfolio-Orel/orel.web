import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/fa';

export default function Mobile() {
  return (
    <div className="overflow-y-auto h-fit w-fit">
      <div className="absolute top-0 left-0">
        <AiOutlineArrowLeft />
      </div>
    </div>
  );
}
