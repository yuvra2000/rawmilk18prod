import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { colors } from '../../../../shared/utils/constants';
const userType = localStorage.getItem('usertype') || '';
export const TripDashbordFilterFields: FieldConfig[] = [
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
  {
    name: 'supplier',
    type: 'select',
    label: 'Supplier Name',
    placeholder: 'Select Supplier Name',
    options: [],
    bindLabel: 'displayName',
    class:
      userType == 'Supplier' || userType == 'ChillingPlant'
        ? 'd-none'
        : 'col-md-2', // Hide for suppliers, show for others
    emitValueChanges: true,
  },

  {
    name: 'Plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: [], // 🔥 dynamic
    bindLabel: 'displayName',
  },
  {
    name: 'transporter',
    type: 'select',
    label: 'Transporter',
    placeholder: 'Select Transporter',
    options: [], // 🔥 dynamic
    bindLabel: 'TransporterName',
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'MCC',
    placeholder: 'Select MCC',
    options: [], // 🔥 dynamic
    bindLabel: 'displayName',
    class: userType == 'ChillingPlant' ? 'd-none' : 'col-md-2', // Hide for suppliers, show for others
    emitValueChanges: true,
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
            // if (params.context?.componentParent) {
            //   params.context.componentParent.Create_dis(
            //     data.id,
            //     data.TargetDate,
            //   );
            // }
            params.context?.handleActionClick?.('Create_dis', params.data);
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

export const tripDashboardGird: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    valueGetter: 'node.rowIndex + 1',
    width: 90,
  },
  {
    headerName: 'Milk Type',
    field: 'MilkType',
  },
  {
    headerName: 'Dispatch Date',
    field: 'DispatchDate',
  },
  {
    headerName: 'Dispatch No.',
    field: 'ChallanNo',
  },
  {
    headerName: 'Vehicle No.',
    field: 'vehicle_no',
    cellRenderer: (params: any) => {
      const span = document.createElement('span');
      span.style.color =
        params.data.vehicleStatus === 'Running'
          ? 'green'
          : params.data.vehicleStatus === 'Stopped'
            ? 'red'
            : params.data.vehicleStatus === 'InActive'
              ? 'grey'
              : params.data.vehicleStatus === 'At Destination'
                ? '#1d4380'
                : params.data.vehicleStatus === 'At Source'
                  ? 'black'
                  : 'inherit';
      span.style.textDecoration = 'underline';
      span.style.cursor = 'pointer';
      span.textContent = params.value;
      span.addEventListener('click', (event: any) => {
        if (params.context.componentParent) {
          params.context.componentParent.onVehicleClick(params);
        }
      });
      return span;
    },
  },
  {
    headerName: 'Supplier',
    field: 'Supplier',
  },
  {
    headerName: 'Plant',
    field: 'Plant',
  },
  {
    headerName: 'Target Date',
    field: 'targetDate',
  },
  {
    headerName: 'Tanker Status',
    field: 'vehicleStatus',
    valueGetter: (params: any) => {
      const status = params.data.vehicleStatus;
      switch (status) {
        case 'Running':
          return 'Intransit';
        case 'Stopped':
          return 'Stopped';
        case 'At Destination':
          return 'At Destination';
        case 'At Source':
          return 'At Source';
        case 'Return':
          return 'Return';
        case 'NoGPS':
          return 'NoGPS';
        default:
          return 'Data Not Available';
      }
    },
  },
  {
    headerName: 'Qty',
    field: 'Qty',
  },
  {
    headerName: 'Fat',
    field: 'Fat',
  },
  {
    headerName: 'Snf',
    field: 'Snf',
  },
  {
    headerName: 'ETA / Arrival Time',
    field: 'eta',
  },
  {
    headerName: 'Driver Details',
    field: 'DriverDetails',
  },
  {
    headerName: 'Status',
    field: 'dispatchStatus',
  },
  // {
  //   headerName: 'Live Lock Status',
  //   field: 'lockStatus',
  //   cellRenderer: (params: any) => {
  //     if (!params.value) return '';
  //     let html = '';
  //     params.value.forEach((status: any) => {
  //       Object.keys(status).forEach((key) => {
  //         if (key !== 'imei') {
  //           html += `${key}: ${status[key]} , `;
  //         }
  //       });
  //     });
  //     return html;
  //   },
  // },
  {
    headerName: 'Live Lock Status',
    field: 'lockStatus',
    autoHeight: true,
    cellRenderer: (params: any) => {
      if (!params.value) return '';

      const container = document.createElement('div');

      const entries: any[] = [];

      params.value.forEach((status: any) => {
        Object.keys(status).forEach((key) => {
          if (key !== 'imei') {
            entries.push({
              key,
              value: status[key],
              imei: status.imei,
            });
          }
        });
      });

      entries.forEach((entry, index) => {
        // 🔹 clickable span (ONLY text + icon)
        const clickableSpan = document.createElement('span');

        const text = document.createElement('span');
        text.innerText = `${entry.key}: `;
        clickableSpan.appendChild(text);

        const icon = document.createElement('i');
        icon.className = getIconClass(entry.value);
        icon.style.marginRight = '5px';
        clickableSpan.appendChild(icon);

        // 🔥 apply click ONLY here
        if (isKeyClickable(entry.key)) {
          clickableSpan.style.cursor = 'pointer';
          clickableSpan.style.textDecoration = 'underline';

          clickableSpan.addEventListener('click', () => {
            params.context?.componentParent?.onKeyClick(
              params.data,
              entry.imei,
            );
          });
        }

        container.appendChild(clickableSpan);

        // 🔥 comma OUTSIDE clickable span
        if (index !== entries.length - 1) {
          const comma = document.createElement('span');
          comma.innerText = ', ';
          container.appendChild(comma);
        }
      });

      return container;
    },
  },
  // {

  //   headerName: 'Live Lock Status',
  //   field: 'lockStatus',
  //   autoHeight: true,
  //   cellRenderer: (params: any) => {
  //     if (!params.value) return '';

  //     const container = document.createElement('div');

  //     params.value.forEach((status: any) => {
  //       Object.keys(status).forEach((key) => {
  //         if (key === 'imei') return;

  //         const span = document.createElement('span');

  //         // 🔹 text
  //         const text = document.createElement('span');
  //         text.innerText = `${key}: `;
  //         span.appendChild(text);

  //         // 🔹 icon
  //         const icon = document.createElement('i');
  //         icon.className = getIconClass(status[key]);
  //         icon.style.marginRight = '5px';
  //         span.appendChild(icon);

  //         // 🔹 spacing
  //         span.appendChild(document.createTextNode(' , '));

  //         // 🔥 clickable only MH / DH
  //         if (isKeyClickable(key)) {
  //           span.style.cursor = 'pointer';
  //           span.style.textDecoration = 'underline';

  //           span.addEventListener('click', () => {
  //             if (params.context?.componentParent) {
  //               params.context.componentParent.onKeyClick(
  //                 params.data,
  //                 status.imei,
  //               );
  //             }
  //           });
  //         }

  //         container.appendChild(span);
  //       });
  //     });

  //     return container;
  //   },
  // },
  {
    headerName: 'Transporter',
    field: 'Transporter',
  },
  {
    headerName: 'Mcc',
    field: 'Mcc',
  },
  {
    headerName: 'Lr. No.',
    field: 'LRNumber',
  },
  {
    headerName: 'Indent No.',
    field: 'IndentNo',
  },
  {
    headerName: 'Temperature',
    field: 'Temperature',
  },
  {
    headerName: 'MBRT',
    field: 'Mbrt',
  },
  {
    headerName: 'Mapped Plant',
    field: 'PlantOld',
  },
  {
    headerName: 'Alerts',
    field: 'Alerts',
    autoHeight: true,
    cellRenderer: (params: any) => {
      if (!params.value) return '';

      const container = document.createElement('div');

      Object.keys(params.value).forEach((regionKey) => {
        const wrapper = document.createElement('span');
        wrapper.style.marginRight = '8px';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';

        // 🔹 square icon
        const icon = document.createElement('i');
        icon.className = 'fa fa-square';
        icon.style.fontSize = '15px';
        icon.style.marginRight = '2px';

        // 🔹 label (clickable)
        const label = document.createElement('span');
        label.innerText = regionKey;
        label.style.color = 'black';
        label.style.fontSize = '15px';
        label.style.cursor = 'pointer';
        label.style.marginLeft = '2px';

        label.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.alertDatat(
              params.data.AlertData?.[regionKey],
              params.data.Mcc,
              params.data.Plant,
              params.data.Supplier,
            );
          }
        });

        // 🔹 badge (count)
        const sup = document.createElement('sup');

        const badge = document.createElement('span');
        badge.innerText = params.value[regionKey];
        badge.style.color = 'red';
        badge.style.fontSize = '14px';
        badge.style.marginLeft = '2px';
        badge.style.fontWeight = '700';

        sup.appendChild(badge);

        // append all
        wrapper.appendChild(icon);
        wrapper.appendChild(label);
        wrapper.appendChild(sup);

        container.appendChild(wrapper);
      });

      return container;
    },
  },
  {
    headerName: 'Mcc Geofence Out',
    field: 'MccGeofenceOut',
  },
  {
    headerName: 'Nearby',
    cellRenderer: () => {
      return `<span class="map-btn">Map View</span>`;
    },
  },
];

function getIconClass(value: any): string {
  const iconMap: { [key: string]: string } = {
    Y: 'fe fe-lock text-success',
    N: 'fe fe-unlock text-danger',
    IN: 'fe fe-lock text-secondary',
    '1': 'fa fa-map-marker text-success',
    '0': 'fa fa-map-marker text-secondary',
  };
  return iconMap[String(value)] || '';
}

function isKeyClickable(key: any): boolean {
  const keyStr = String(key);
  return keyStr === 'MH' || keyStr === 'DH';
}
