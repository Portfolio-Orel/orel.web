import React from 'react';

import Button from '../components/button';

export default {
  title: 'Components/Button',
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Primary',
  type: 'primary',
  onClick: () => {
    console.log('Primary button clicked');
  },
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Secondary',
  type: 'secondary',
  onClick: () => {
    console.log('Secondary button clicked');
  },
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  text: 'Tertiary',
  type: 'tertiary',
  onClick: () => {
    console.log('Tertiary button clicked');
  },
};
