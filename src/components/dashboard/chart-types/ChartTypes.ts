
// Define supported chart types
export type ChartType = 'area' | 'bar' | 'pie' | 'donut' | 'empty';

export interface RingData {
  ring: 'inner' | 'outer';
  data: any[];
  colors: string[];
}

export interface MetricChartProps {
  title: string;
  description?: string;
  type: ChartType;
  data: any[] | RingData[];
  dataKey: string;
  categories?: string[];
  colors?: string[];
  individualColors?: boolean;
  height?: number;
  hideLegend?: boolean;
  tooltipFormatter?: (value: number, name: string, entry: any) => React.ReactNode;
  isLoading?: boolean;
  emptyStateMessage?: string;
  compareKey?: string;
  categoryNames?: string[];
}

export interface ChartComponentProps {
  data: any[] | RingData[];
  dataKey: string;
  categories?: string[];
  colors?: string[];
  individualColors?: boolean;
  height?: number;
  hideLegend?: boolean;
  tooltipFormatter?: (value: number, name: string, entry: any) => React.ReactNode;
  renderTooltip: (props: any) => React.ReactNode;
}
