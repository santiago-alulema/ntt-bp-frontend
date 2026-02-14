export type ActionConfig<T = any> = {
  label?: string;
  tooltip: string;
  icon?: string;
  onClick: (row: T) => void | Promise<void>;
  hidden?: boolean | ((row: T) => boolean);
  typeInput?: 'button' | 'checkbox' | 'icon' | 'radiobutton';
  sizeIcon?: 'small' | 'medium' | 'large';
  inputSize?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};
