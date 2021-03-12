import React, { ComponentProps } from 'react';

import { Story } from '@storybook/react';

import SignUp from './SignUp';

export default {
  title: 'SignUp',
  component: SignUp,
};

const Template: Story<ComponentProps<typeof SignUp>> = (args) => <SignUp />;

export const FirstStory = Template.bind({});

FirstStory.args = {};
