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

import { forwardRef, MouseEvent, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FormatOptions } from '@perses-dev/core';
import { Box } from '@mui/material';
import type {
  EChartsCoreOption,
  GridComponentOption,
  LineSeriesOption,
  LegendComponentOption,
  YAXisComponentOption,
  TooltipComponentOption,
} from 'echarts';
import { ECharts as EChartsInstance, use } from 'echarts/core';
import { LineChart as EChartsLineChart } from 'echarts/charts';
import {
  GridComponent,
  DataZoomComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChart, OnEventsType } from '../EChart';
import { EChartsDataFormat, ChartInstanceFocusOpts, ChartInstance } from '../model';
import { useChartsTheme, useTimeZone } from '../context';
import { CursorCoordinates, LineChartTooltip, TooltipConfig, DEFAULT_TOOLTIP_CONFIG } from '../TimeSeriesTooltip';
import {
  clearHighlightedSeries,
  enableDataZoom,
  getDateRange,
  getFormattedDate,
  getFormattedAxis,
  restoreChart,
  ZoomEventData,
} from '../utils';

use([
  EChartsLineChart,
  GridComponent,
  DataZoomComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

export interface LineChartProps {
  height: number;
  data: EChartsDataFormat;
  yAxis?: YAXisComponentOption;
  format?: FormatOptions;
  grid?: GridComponentOption;
  legend?: LegendComponentOption;
  tooltipConfig?: TooltipConfig;
  noDataVariant?: 'chart' | 'message';
  syncGroup?: string;
  onDataZoom?: (e: ZoomEventData) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  __experimentalEChartsOptionsOverride?: (options: EChartsCoreOption) => EChartsCoreOption;
}

export const LineChart = forwardRef<ChartInstance, LineChartProps>(function LineChart(
  {
    height,
    data,
    yAxis,
    format,
    grid,
    legend,
    tooltipConfig = DEFAULT_TOOLTIP_CONFIG,
    noDataVariant = 'message',
    syncGroup,
    onDataZoom,
    onDoubleClick,
    __experimentalEChartsOptionsOverride,
  },
  ref
) {
  const chartsTheme = useChartsTheme();
  const chartRef = useRef<EChartsInstance>();
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [tooltipPinnedCoords, setTooltipPinnedCoords] = useState<CursorCoordinates | null>(null);
  const { timeZone } = useTimeZone();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useImperativeHandle(ref, () => {
    return {
      highlightSeries({ id }: ChartInstanceFocusOpts): void {
        if (!chartRef.current) {
          // when chart undef, do not highlight series when hovering over legend
          return;
        }

        chartRef.current.dispatchAction({ type: 'highlight', seriesId: id });
      },
      clearHighlightedSeries: (): void => {
        if (!chartRef.current) {
          // when chart undef, do not clear highlight series
          return;
        }
        clearHighlightedSeries(chartRef.current);
      },
    };
  }, []);

  const handleEvents: OnEventsType<LineSeriesOption['data'] | unknown> = useMemo(() => {
    return {
      datazoom: (params): void => {
        if (onDataZoom === undefined) {
          setTimeout(() => {
            // workaround so unpin happens after click event
            setTooltipPinnedCoords(null);
          }, 10);
        }
        if (onDataZoom === undefined || params.batch[0] === undefined) return;
        const startIndex = params.batch[0].startValue ?? 0;
        const endIndex = params.batch[0].endValue ?? data.xAxis.length - 1;
        const xAxisStartValue = data.xAxis[startIndex];
        const xAxisEndValue = data.xAxis[endIndex];

        if (xAxisStartValue !== undefined && xAxisEndValue !== undefined) {
          const zoomEvent: ZoomEventData = {
            start: xAxisStartValue,
            end: xAxisEndValue,
            startIndex,
            endIndex,
          };
          onDataZoom(zoomEvent);
        }
      },
    };
  }, [data, onDataZoom, setTooltipPinnedCoords]);

  if (chartRef.current !== undefined) {
    enableDataZoom(chartRef.current);
  }

  const { noDataOption } = chartsTheme;

  const option: EChartsCoreOption = useMemo(() => {
    if (data.timeSeries === undefined) return {};

    // The "chart" `noDataVariant` is only used when the `timeSeries` is an
    // empty array because a `null` value will throw an error.
    if (data.timeSeries === null || (data.timeSeries.length === 0 && noDataVariant === 'message')) return noDataOption;

    const rangeMs = data.rangeMs ?? getDateRange(data.xAxis);

    const option: EChartsCoreOption = {
      series: data.timeSeries,
      xAxis: {
        type: 'category',
        data: data.xAxis,
        max: data.xAxisMax,
        axisLabel: {
          formatter: (value: number) => {
            return getFormattedDate(value, rangeMs, timeZone);
          },
        },
      },
      yAxis: getFormattedAxis(yAxis, format),
      animation: false,
      tooltip: {
        show: true,
        trigger: 'axis',
        showContent: false, // echarts tooltip content hidden since we use custom tooltip instead
      },
      // https://echarts.apache.org/en/option.html#axisPointer
      axisPointer: {
        type: 'line',
        z: 0, // ensure point symbol shows on top of dashed line
        triggerEmphasis: false, // https://github.com/apache/echarts/issues/18495
        triggerTooltip: false,
        snap: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            icon: null, // https://stackoverflow.com/a/67684076/17575201
            yAxisIndex: 'none',
          },
        },
      },
      grid,
      legend,
    };

    if (__experimentalEChartsOptionsOverride) {
      return __experimentalEChartsOptionsOverride(option);
    }
    return option;
  }, [data, yAxis, format, grid, legend, noDataOption, timeZone, __experimentalEChartsOptionsOverride, noDataVariant]);

  return (
    <Box
      style={{ height }}
      onClick={(e) => {
        // Pin and unpin when clicking on chart canvas but not tooltip text.
        if (tooltipConfig.enablePinning && e.target instanceof HTMLCanvasElement) {
          setTooltipPinnedCoords((current) => {
            if (current === null) {
              return {
                page: {
                  x: e.pageX,
                  y: e.pageY,
                },
                client: {
                  x: e.clientX,
                  y: e.clientY,
                },
                plotCanvas: {
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                },
                target: e.target,
              };
            } else {
              return null;
            }
          });
        }
      }}
      onMouseDown={(e) => {
        const { clientX } = e;
        setIsDragging(true);
        setStartX(clientX);
      }}
      onMouseMove={(e) => {
        // Allow clicking inside tooltip to copy labels.
        if (!(e.target instanceof HTMLCanvasElement)) {
          return;
        }
        const { clientX } = e;
        if (isDragging) {
          const deltaX = clientX - startX;
          if (deltaX > 0) {
            // Hide tooltip when user drags to zoom.
            setShowTooltip(false);
          }
        }
      }}
      onMouseUp={() => {
        setIsDragging(false);
        setStartX(0);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        if (tooltipPinnedCoords === null) {
          setShowTooltip(false);
        }
        if (chartRef.current !== undefined) {
          clearHighlightedSeries(chartRef.current);
        }
      }}
      onMouseEnter={() => {
        setShowTooltip(true);
        if (chartRef.current !== undefined) {
          enableDataZoom(chartRef.current);
        }
      }}
      onDoubleClick={(e) => {
        setTooltipPinnedCoords(null);
        // either dispatch ECharts restore action to return to orig state or allow consumer to define behavior
        if (onDoubleClick === undefined) {
          if (chartRef.current !== undefined) {
            restoreChart(chartRef.current);
          }
        } else {
          onDoubleClick(e);
        }
      }}
    >
      {/* Allows overrides prop to hide custom tooltip and use the ECharts option.tooltip instead */}
      {showTooltip === true &&
        (option.tooltip as TooltipComponentOption)?.showContent === false &&
        tooltipConfig.hidden !== true && (
          <LineChartTooltip
            chartRef={chartRef}
            chartData={data}
            wrapLabels={tooltipConfig.wrapLabels}
            enablePinning={tooltipConfig.enablePinning}
            pinnedPos={tooltipPinnedCoords}
            format={format}
            onUnpinClick={() => {
              setTooltipPinnedCoords(null);
            }}
            containerId={chartsTheme.tooltipPortalContainerId}
          />
        )}
      <EChart
        sx={{
          width: '100%',
          height: '100%',
        }}
        option={option}
        theme={chartsTheme.echartsTheme}
        onEvents={handleEvents}
        _instance={chartRef}
        syncGroup={syncGroup}
      />
    </Box>
  );
});
