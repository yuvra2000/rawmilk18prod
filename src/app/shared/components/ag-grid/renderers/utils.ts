import { ChangeDetectionStrategy } from '@angular/core';

export const CELL_RENDERER_BASE_CONFIG = {
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
} as const;

export function getStatusVariant(value: string): string {
  const val = value.toLowerCase();
  if (['active', 'completed', 'success', 'approved', 'enabled'].includes(val)) return 'success';
  if (['inactive', 'failed', 'error', 'rejected', 'disabled'].includes(val)) return 'danger';
  if (['pending', 'warning', 'processing'].includes(val)) return 'warning';
  if (['info', 'information', 'draft'].includes(val)) return 'info';
  return 'secondary';
}

export function formatDisplayValue(value: any): string {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : String(value);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function parseNumericValue(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
