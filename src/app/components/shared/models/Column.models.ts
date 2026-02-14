export interface Column<T = any> {
  name: keyof T & string;
  title: string;
  width?: string;
  style?: string;
  icon?: string;
  alignIcon?: 'left' | 'right';
  tooltip?: string;
  format?: (value: any, row: T) => string;
  isImage?: boolean;
}
