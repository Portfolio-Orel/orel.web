import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

function ProjectComponent({ data }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl text-text font-bold">{data.title}</h1>
      <div className="flex flex-col items-center">
        {data.info.map((info) => (
          <div key={data.title} className="flex flex-col items-center justify-center">
            <Image src={info.image} alt={data.title} className="h-80 w-80" />
            {info.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Project({ data }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {data.map((item) => (
        <ProjectComponent key={item.title} data={item} />
      ))}
    </div>
  );
}

Project.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      repositoryLink: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      info: PropTypes.arrayOf(
        PropTypes.shape({
          image: PropTypes.arrayOf(PropTypes.string).isRequired,
          description: PropTypes.node.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
