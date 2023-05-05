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
import { Table, TableProps } from '@perses-dev/components';

import { red, orange, yellow, green, blue, indigo, purple } from '@mui/material/colors';

const COLOR_SHADES = ['400', '800'] as const;
const COLOR_NAMES = [red, orange, yellow, green, blue, indigo, purple];
const MOCK_COLORS = COLOR_SHADES.reduce((results, colorShade) => {
  COLOR_NAMES.map((colorName) => {
    if (colorShade in colorName) {
      results.push(colorName[colorShade]);
    }
  });
  return results;
}, [] as string[]);

function generateMockTableData(count: number): TableProps['data'] {
  const data: TableProps['data'] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name: `name ${i}`,
      value: i,
      color: MOCK_COLORS[i % MOCK_COLORS.length] as string,
    });
  }
  return data;
}

const meta: Meta<typeof Table> = {
  component: Table,
  args: {
    data: generateMockTableData(1000),
  },
  parameters: {
    // TODO: investigate how to get snapshots of interactive elements like
    // tooltips. Adding a `play` that hovers to show the tooltip was not enough,
    // so this is likely more complex and may require working with Happo support.
    happo: false,
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Primary: Story = {};
