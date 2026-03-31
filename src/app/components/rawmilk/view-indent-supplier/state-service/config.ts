import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { colors } from '../../../../shared/utils/constants';
export const viewIndentSupplierFilterFields: FieldConfig[] = [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'to',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
    required: true,
  },
];
export const viewIndentSupplierGridColumnsIfNotChillingPlant: FieldConfig[] = [
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: [
      { name: 'All', id: '' },
      { name: 'Unallocated', id: 'Un-Allocated' },
      { name: 'Allocated', id: 'Allocated' },
      { name: 'Indent With MCC', id: 'IndentWithMcc' },
      { name: 'Cancelled', id: 'cancel' },
    ],
  },
  {
    name: 'reportType',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select Report Type',
    options: [
      { name: 'Standard', id: 'Standard' },
      { name: 'Detailed', id: 'Detailed' },
    ],
    emitValueChanges: true,
  },
];
export const editFields: FieldConfig[] = [
  {
    name: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter Quantity',
    required: true,
  },
];
const usertype = localStorage.getItem('usertype');
const isChillingPlant = usertype == 'ChillingPlant';
const isSupplier = usertype == 'Supplier';
// ...existing code...
export const viewIndentSupplierGridColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Indent/Plant',
    field: 'indent_no',
  },
  {
    headerName: 'Target Date',
    field: 'target_date',
  },
  {
    headerName: 'Plant',
    field: 'plant_name',
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
  },
  ...(isSupplier
    ? [
        {
          headerName: 'Unallocated Quantity',
          field: 'unallocated_quantity',
          valueGetter: (params: any) => {
            const quantity = parseInt(params.data.quantity) || 0;
            const allocated = parseInt(params.data.allocated_quantity) || 0;
            return quantity - allocated;
          },
        },
      ]
    : []),
  ...(isChillingPlant
    ? [
        {
          headerName: 'Remaining Quantity',
          field: 'RemaingQuantity',
        },
      ]
    : []),
  {
    headerName: 'Dispatch Created',
    field: 'dispatchCreated',
  },
  {
    headerName: 'No. of Dispatches',
    field: 'noOfDispatch',
    cellRenderer: (params: any) => {
      const count = params.data.noOfDispatch || 0;
      const span = document.createElement('span');
      span.innerText = count;
      span.style.color = colors.primary;
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.onViewDispatches(params.data);
        }
      });
      span.addEventListener('mouseenter', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.onViewDispatches(params.data);
        }
      });
      return span;
    },
  },
  {
    headerName: 'Supplier',
    field: 'supplier_name',
  },
  {
    headerName: 'Mcc',
    field: 'mcc_name',
  },
  {
    headerName: 'Milk Type',
    field: 'milk_type_name',
  },
];
export const viewIndentSupplierGridColumnsDetailed: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Indent/Plant',
    field: 'indent_no',
  },
  {
    headerName: 'Target Date',
    field: 'target_date',
  },
  {
    headerName: 'Plant',
    field: 'plant_name',
  },
  {
    headerName: 'Supplier',
    field: 'supplier_name',
  },
  {
    headerName: 'Mcc',
    field: 'mcc_name',
  },
  {
    headerName: 'Milk Type',
    field: 'milk_type_name',
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
  },
  {
    headerName: 'Pending Dispatch',
    field: 'rem_qty',
  },
  {
    headerName: 'Dispatch Created',
    field: 'dispatchCreated',
  },
  {
    headerName: 'No. of Dispatches',
    field: 'noOfDispatch',
    cellRenderer: (params: any) => {
      const count = params.data.noOfDispatch || 0;
      const span = document.createElement('span');
      span.innerText = count;
      span.style.color = colors.primary;
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.onViewDispatches(params.data);
        }
      });
      return span;
    },
  },
];

export const actionColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      // ✅ View Intent - when action_type == 3
      {
        icon: 'fa fa-eye',
        action: 'view',
        tooltip: 'View',
        visible: (data: any) => data?.action_type == 3,
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.viewIndent(data.id);
          }
        },

        iconStyle: {
          color: 'grey',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Edit Intent - when usertype == 'Supplier' && sub_indent == 1
      {
        icon: 'fa fa-pen-to-square',
        action: 'edit',
        tooltip: 'Edit',
        visible: (data: any, params: any) => {
          return data?.sub_indent == 1; // ✅ CORRECT
        },
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.fetchIndentValue(
              data.id,
              data.quantity,
              'Edit',
            );
          }
        },
        iconStyle: {
          color: colors.primary,
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Allocate - when action_type == 1
      {
        icon: 'fa fa-bars',
        action: 'allocate',
        tooltip: 'Allocate',
        visible: (data: any) => data?.action_type == 1,
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.fetchIndentValue(
              data.id,
              data.quantity,
              'New',
            );
          }
        },
        iconStyle: {
          color: colors.primary,
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Create Dispatch - when action_type == 2
      {
        icon: 'fe fe-truck',
        action: 'createDispatch',
        tooltip: 'Create Dispatch',
        visible: (data: any) => {
          // debugger;
          return data?.action_type == 2;
        },
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.Create_dis(
              data.id,
              data.target_date,
            );
          }
        },
        iconStyle: {
          color: 'green',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Dispatch Already Created - when action_type == 0 (disabled)
      {
        icon: 'fe fe-truck',
        action: 'dispatchCreated',
        tooltip: 'Dispatch Already created',
        visible: (data: any) => data?.action_type == 0,
        onClick: () => {}, // No action - just display
        iconStyle: {
          color: 'green',
          cursor: 'not-allowed',
          fontSize: '18px',
          marginRight: '10px',
          opacity: 0.6,
        },
      },
    ],
  },
};
export const viewDispatchColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Indent/Plant',
    field: 'IndentNo',
  },
  {
    headerName: 'Target Date',
    field: 'TargetDate',
  },
  {
    headerName: 'Plant',
    field: 'plant_name',
  },
  {
    headerName: 'Quantity',
    field: 'Quantity',
  },

  {
    headerName: 'Dispatch Created',
    field: 'dispatchCreated',
  },
  {
    headerName: 'No. of Dispatches',
    field: 'noOfDispatch',
    cellRenderer: (params: any) => {
      const count = params.data?.noOfDispatch || 0;
      const dispatchData = params.data?.dispatchData || [];
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';

      const span = document.createElement('span');
      span.innerText = count;
      span.style.color = colors.primary;
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      container.appendChild(span);

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'dispatch-hover-tooltip';
      tooltip.style.cssText = `
        position: fixed;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        padding: 8px;
        z-index: 9999;
        display: none;
        min-width: 350px;
        max-width: 450px;
      `;

      // Build tooltip content
      if (dispatchData.length > 0) {
        tooltip.innerHTML = `
          <div style="font-weight: 600; color: #1d4380; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #eee;">
            Dispatch Details
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 4px 8px; text-align: left; border: 1px solid #eee; font-weight: 600;">Dispatch No.</th>
                <th style="padding: 4px 8px; text-align: left; border: 1px solid #eee; font-weight: 600;">Vehicle No.</th>
                <th style="padding: 4px 8px; text-align: left; border: 1px solid #eee; font-weight: 600;">Quantity</th>
                <th style="padding: 4px 8px; text-align: left; border: 1px solid #eee; font-weight: 600;">Dispatch Date</th>
              </tr>
            </thead>
            <tbody>
              ${dispatchData
                .map(
                  (d: any) => `
                <tr>
                  <td style="padding: 4px 8px; border: 1px solid #eee;">${d.dispatch_no || '-'}</td>
                  <td style="padding: 4px 8px; border: 1px solid #eee;">${d.vehicle_no || '-'}</td>
                  <td style="padding: 4px 8px; border: 1px solid #eee;">${d.quantity || '-'}</td>
                  <td style="padding: 4px 8px; border: 1px solid #eee;">${d.dispatch_date || '-'}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        `;
      } else {
        tooltip.innerHTML = `<div style="color: #999; font-style: italic;">No dispatch data available</div>`;
      }

      document.body.appendChild(tooltip);

      // Show tooltip on mouseenter
      span.addEventListener('mouseenter', (e: MouseEvent) => {
        const rect = span.getBoundingClientRect();
        tooltip.style.display = 'block';
        tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight / 2 + rect.height / 2}px`;

        // Adjust if going off screen
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.left < 0) {
          tooltip.style.left = `${rect.right + 10}px`;
        }
        if (tooltipRect.top < 0) {
          tooltip.style.top = '10px';
        }
      });

      // Hide tooltip on mouseleave
      span.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      // Cleanup when row is removed
      params.api?.addEventListener('rowDataUpdated', () => {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      });

      return container;
    },
  },
  {
    headerName: 'Supplier',
    field: 'supplier_name',
  },
  {
    headerName: 'Mcc',
    field: 'MCCName',
  },
  {
    headerName: 'Milk Type',
    field: 'milk_type_name',
  },
  {
    headerName: 'Action',
    field: 'action',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        // ✅ Create Dispatch - when action_type == 2
        {
          icon: 'fe fe-truck',
          action: 'createDispatch',
          tooltip: 'Create Dispatch',
          visible: (data: any) => data?.action_type == 2,
          onClick: (data: any, node: any, params: any) => {
            if (params.context?.componentParent) {
              params.context.componentParent.Create_dis(
                data.id,
                data.TargetDate,
              );
            }
          },
          iconStyle: {
            color: 'green',
            cursor: 'pointer',
            fontSize: '18px',
            marginRight: '10px',
          },
        },
        // ✅ Delete Indent - when action_type == 2
        {
          icon: 'fa fa-trash',
          action: 'deleteIndent',
          tooltip: 'Delete Indent',
          visible: (data: any) => data?.action_type == 2,
          onClick: (data: any, node: any, params: any) => {
            if (params.context?.componentParent) {
              params.context.componentParent.deleteindent(data.id);
            }
          },
          iconStyle: {
            color: 'red',
            cursor: 'pointer',
            fontSize: '18px',
            marginRight: '10px',
          },
        },
        // ✅ Dispatch Already Created - when action_type == 0 (disabled)
        {
          icon: 'fe fe-truck',
          action: 'dispatchCreated',
          tooltip: 'Dispatch Already created',
          visible: (data: any) => data?.action_type === 0,
          onClick: () => {}, // No action - just display
          iconStyle: {
            color: 'green',
            cursor: 'not-allowed',
            fontSize: '18px',
            marginRight: '10px',
            opacity: 0.6,
          },
        },
      ],
    },
  },
];
export const viewNoOfDispatchColumns: GridColumnConfig[] = [
  {
    headerName: 'Dispatch No.',
    field: 'dispatch_no',
  },
  {
    headerName: 'Vehicle No.',
    field: 'vehicle_no',
  },
  {
    headerName: 'Quantity	',
    field: 'quantity',
  },
  {
    headerName: 'Dispatch Date	',
    field: 'dispatch_date',
  },
];
