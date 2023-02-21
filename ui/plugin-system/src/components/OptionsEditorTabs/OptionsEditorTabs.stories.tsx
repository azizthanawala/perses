// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OptionsEditorTabs } from '../..';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: OptionsEditorTabs,
  args: {
    tabs: [
      {
        label: 'tab one',
        content: 'tab one',
      },
      {
        label: 'tab two',
        content: 'tab two',
      },
    ],
  },
} as ComponentMeta<typeof OptionsEditorTabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OptionsEditorTabs> = (args) => <OptionsEditorTabs {...args} />;

export const Primary = Template.bind({});
