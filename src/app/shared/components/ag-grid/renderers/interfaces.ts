export interface ActionConfig {
  icon?: string;
  label?: string;
  tooltip?: string;
  cssClass?: string;
  isImg?: boolean;
  iconStyle?: { [key: string]: any };
  disabled?: (data: any) => boolean;
  onClick?: (data: any, node: any) => void;
}

export interface ImageConfig {
  altText?: string;
  noImageText?: string;
  showViewIcon?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  onImageClick?: (data: any, imageUrl: string) => void;
}

export interface LinkConfig {
  target?: '_blank' | '_self' | '_parent' | '_top';
  urlField?: string;
  labelField?: string;
  onClick?: (data: any, url: string) => void;
}

export interface BadgeConfig {
  colorField?: string;
  iconField?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

export interface ProgressConfig {
  max?: number;
  showPercentage?: boolean;
  colorThreshold?: { value: number; color: string }[];
}

export interface BooleanConfig {
  showText?: boolean;
  trueIcon?: string;
  falseIcon?: string;
  trueText?: string;
  falseText?: string;
}

export interface DateConfig {
  format?: string;
  timezone?: string;
}

export interface CurrencyConfig {
  currency?: string;
  symbol?: 'symbol' | 'symbol-narrow' | 'code';
  digitsInfo?: string;
}

// Base cell renderer interface
export interface BaseCellRendererConfig {
  className?: string;
  style?: { [key: string]: any };
}
