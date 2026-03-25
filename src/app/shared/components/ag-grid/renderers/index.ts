import {
  ActionCellRenderer,
  ImageCellRenderer,
  StatusCellRenderer,
//   LinkCellRenderer,
//   ProgressCellRenderer,
  BooleanCellRenderer,
//   DateCellRenderer,
//   CurrencyCellRenderer
} from './'; // Assuming all renderers are exported from a local index

// Individual exports for tree-shaking
export { ActionCellRenderer } from './action-cell-renderer.component';
export { ImageCellRenderer } from './image-cell-renderer.component';
export { StatusCellRenderer } from './status-cell-renderer.component';
// export { LinkCellRenderer } from './link-cell-renderer.component';
// export { ProgressCellRenderer } from './progress-cell-renderer.component';
export { BooleanCellRenderer } from './boolean-cell-renderer.component';
// export { DateCellRenderer } from './date-cell-renderer.component';
// export { CurrencyCellRenderer } from './currency-cell-renderer.component';

// Export interfaces and utils
export * from './interfaces';
export * from './utils';

// Lazy registry (for performance)
export const CELL_RENDERERS = {
  actionCellRenderer: () => import('./action-cell-renderer.component').then(m => m.ActionCellRenderer),
  imageCellRenderer: () => import('./image-cell-renderer.component').then(m => m.ImageCellRenderer),
  statusCellRenderer: () => import('./status-cell-renderer.component').then(m => m.StatusCellRenderer),
//   linkCellRenderer: () => import('./link-cell-renderer.component').then(m => m.LinkCellRenderer),
//   progressCellRenderer: () => import('./progress-cell-renderer.component').then(m => m.ProgressCellRenderer),
  booleanCellRenderer: () => import('./boolean-cell-renderer.component').then(m => m.BooleanCellRenderer),
//   dateCellRenderer: () => import('./date-cell-renderer.component').then(m => m.DateCellRenderer),
//   currencyCellRenderer: () => import('./currency-cell-renderer.component').then(m => m.CurrencyCellRenderer),
} as const;

// Sync registry (for immediate use)
export const CELL_RENDERERS_SYNC = {
  actionCellRenderer: ActionCellRenderer,
  imageCellRenderer: ImageCellRenderer,
  statusCellRenderer: StatusCellRenderer,
  booleanCellRenderer: BooleanCellRenderer,
  // Add others if they are commonly needed synchronously
} as const;


// --- MODIFIED HELPER FUNCTION SECTION ---

// A map of all available renderers for easy lookup
const RENDERER_MAP = {
  actionCellRenderer: ActionCellRenderer,
  imageCellRenderer: ImageCellRenderer,
  statusCellRenderer: StatusCellRenderer,
//   linkCellRenderer: LinkCellRenderer,
//   progressCellRenderer: ProgressCellRenderer,
  booleanCellRenderer: BooleanCellRenderer,
//   dateCellRenderer: DateCellRenderer,
//   currencyCellRenderer: CurrencyCellRenderer,
};

/**
 * Creates a registry of cell renderer components for use in AG-Grid.
 * This version uses a map for a more concise and extensible implementation.
 * @param rendererNames - An array of renderer names to include.
 */
export function createCellRendererRegistry(
  rendererNames: (keyof typeof RENDERER_MAP)[]
) {
  const components: any[] = [];
  const registry: any = {};

  rendererNames.forEach(name => {
    const component = RENDERER_MAP[name];
    if (component) {
      components.push(component);
      registry[name] = component;
    }
  });

  return { components, registry };
}

// --- END MODIFICATION ---


// Pre-built common combinations
export const COMMON_RENDERERS = createCellRendererRegistry([
  'actionCellRenderer',
  'statusCellRenderer',
  'imageCellRenderer'
]);

export const DATA_RENDERERS = createCellRendererRegistry([
//   'dateCellRenderer',
//   'currencyCellRenderer',
  'booleanCellRenderer'
]);

export const ALL_RENDERERS = createCellRendererRegistry([
  'actionCellRenderer',
  'imageCellRenderer',
  'statusCellRenderer',
//   'linkCellRenderer',
//   'progressCellRenderer',
  'booleanCellRenderer',
//   'dateCellRenderer',
//   'currencyCellRenderer'
]);