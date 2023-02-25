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

import type { Meta, StoryObj } from '@storybook/react';
import { JSONEditor } from '@perses-dev/components';

const meta: Meta<typeof JSONEditor> = {
  component: JSONEditor,
};

export default meta;

type Story = StoryObj<typeof JSONEditor>;

export const Primary: Story = {
  args: {
    value: {
      some: 'json',
    },
  },
};
