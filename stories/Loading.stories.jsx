import React from 'react';

import Loading from '../components/loading';

export default {
  title: 'Components/Loading',
  component: Loading,
};

const Template = (args) => (
  <div className="bg-background h-screen w-screen flex items-center justify-center">
    <Loading {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
    size: 10,
    color: 'text',
    text: 'Loading...',
};