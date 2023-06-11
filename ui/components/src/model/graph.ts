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

import { TimeSeriesValueTuple } from '@perses-dev/core';
// import { ComposeOption } from 'echarts';
import { ScatterDataItemOption } from 'echarts/types/src/chart/scatter/ScatterSeries';
import { LineSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import { LegendItem } from '../';

// TODO: use ComposeOption to fix tooltip type workarounds
// export type ChartsOption = ComposeOption<TooltipComponentOption>;

// adjust display when there are many time series to help with performance
export const OPTIMIZED_MODE_SERIES_LIMIT = 1000;

export type UnixTimeMs = number;

export interface GraphSeries {
  name: string;
  values: TimeSeriesValueTuple[];
}

export type EChartsValues = number | null | '-';

// export type LineSeriesData = LineSeriesOption['data'];
// export type LineChartSupportedSeriesTypes = ComposeOption<LineSeriesOption | ScatterSeriesOption>;
// // export interface EChartsTimeSeries extends LineChartSupportedSeriesTypes {
// //   data?: EChartsValues[] | AnnotationSeries;
// //   annotations?: unknown[];
// // }

// export type LineChartSupportedSeriesTypes = ComposeOption<LineSeriesOption | ScatterSeriesOption>;
// export type LineChartSupportedSeriesTypes = ComposeOption<LineSeriesOption | ScatterSeriesOption>;

export type TimeSeriesChartVisualModes = 'line' | 'scatter' | 'bar';

// export interface EChartsTimeSeries extends LineChartSupportedSeriesTypes {
// export interface EChartsTimeSeries extends Omit<LineSeriesOption, 'data' | 'type'> {
export interface EChartsTimeSeries extends Omit<LineSeriesOption, 'data'> {
  data: EChartsValues[];
  // data: EChartsValues[] | AnnotationSeriesData;
  // type: TimeSeriesChartVisualModes;
  // annotations?: unknown[];
}

export type TimeSeriesWithAnnotations = EChartsTimeSeries | AnnotationSeries;

export type EChartsDataFormat = {
  // timeSeries: EChartsTimeSeries[] | AnnotationSeries[];
  timeSeries: TimeSeriesWithAnnotations[];
  xAxis: number[];
  xAxisAlt?: number[]; // TODO: temporary axis for annotations, remove after TimeChart supersedes LineChart
  legendItems?: LegendItem[];
  xAxisMax?: number | string;
  rangeMs?: number;
};

// export interface AnnotationSeries extends ScatterSeriesOption {
export interface AnnotationSeries extends Omit<ScatterSeriesOption, 'data'> {
  data: AnnotationSeriesData;
  annotations?: unknown[];
}

export interface AnnotationSeriesDatum extends ScatterDataItemOption {
  itemStyle?: {
    color: string;
  };
}

export type AnnotationSeriesData = TimeSeriesValueTuple[];

// export type AnnotationSeriesData = AnnotationSeriesDatum[];
