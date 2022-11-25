import React from 'react';
import WebProject from '../components/web-project';

export default {
  title: 'Components/WebProject',
  component: WebProject,
};

const Template = (args) => (
  <div className="bg-background h-screen w-screen flex items-center justify-center">
    <WebProject {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  data: [
    {
      repositoryLink: 'https://randomfox.ca/images/53.jpg',
      title: 'Random Fox',
      info: [
        {
          image: ['https://randomfox.ca/images/53.jpg'],
          description: 'This is a random fox image',
        },
      ],
    },
  ],
};
