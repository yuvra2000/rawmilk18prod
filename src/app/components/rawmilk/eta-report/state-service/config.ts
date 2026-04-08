import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { userType } from '../../projection/state-service/config';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

const metricCellValue = (metric: any): string => {
  const qty = metric?.qty ?? 0;
  const unit = metric?.unit ?? '';
  const cnt = metric?.cnt ?? 0;
  return `${qty}${unit ? ` ${unit}` : ''} (${cnt})`;
};

const clickableMetricColumn = (
  headerName: string,
  field: string,
  valueGetter: (params: any) => string,
  extra?: Partial<GridColumnConfig> & { bucketKey?: string },
): GridColumnConfig => ({
  headerName,
  field,
  valueGetter,
  cellStyle: {
    cursor: 'pointer',
    textAlign: 'right',
    ...(extra?.cellStyle as object),
  },
  onCellClicked: (params: any) => {
    params.context?.componentParent?.onClick?.({
      row: params.data,
      column: field,
      label: headerName,
      bucketKey: extra?.bucketKey ?? null,
    });
  },
  ...extra,
});

const collectBucketKeys = (rows: any[] = []): string[] => {
  const seen = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row?.Buckets || {}).forEach((key) => seen.add(key));
  });
  return Array.from(seen);
};

export const filterfields = (
  milkTypeList: Option[] = [],
  supplierList: Option[] = [],
  plantList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select From Date',
    required: true,
    class: 'col-md-2',
  },
  {
    name: 'to',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select To Date',
    required: true,
    class: 'col-md-2',
  },
  {
    name: 'supplier',
    type: 'select',
    label: 'Supplier Name',
    placeholder: 'Select Supplier Name',
    options: supplierList,
    bindLabel: 'displayName',
    class:
      userType == 'Supplier' || userType == 'ChillingPlant'
        ? 'd-none'
        : 'col-md-2',
    emitValueChanges: true,
    multiple: true,
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
    class: 'col-md-2',
    multiple: true,
  },
  {
    name: 'plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: plantList,
    bindLabel: 'displayName',
    class: userType == 'Corporate Plant' ? 'd-none' : 'col-md-2',
    multiple: true,
  },
];

export const etaReportColumns = (rows: any[] = []): GridColumnConfig[] => {
  const bucketKeys = collectBucketKeys(rows);

  return [
    {
      headerName: 'Sr No',
      field: 'srNo',
      width: 90,
      pinned: 'left',
      valueGetter: (params: any) => params.node?.rowIndex + 1,

      onCellClicked: (params: any) => {
        params.context?.componentParent?.onClick?.({
          row: params.data,
          column: 'srNo',
          label: 'Sr No',
        });
      },
    },
    clickableMetricColumn(
      'Plant',
      'Plant',
      (params: any) => params.data?.Plant || '',
      {
        width: 110,
        pinned: 'left',
        cellStyle: { textAlign: 'center' },
      },
    ),
    clickableMetricColumn(
      'Milk Type',
      'MilkType',
      (params: any) => params.data?.MilkType || '',
      {
        width: 130,
        pinned: 'left',
        cellStyle: { textAlign: 'center' },
      },
    ),
    clickableMetricColumn('Planned', 'Planned', (params: any) =>
      metricCellValue(params.data?.Planned),
    ),
    clickableMetricColumn('Arrived', 'Arrived', (params: any) =>
      metricCellValue(params.data?.Arrived),
    ),
    clickableMetricColumn('Not Known', 'NotKnown', (params: any) =>
      metricCellValue(params.data?.NotKnown),
    ),
    clickableMetricColumn('Pending', 'Pending', (params: any) =>
      metricCellValue(params.data?.Pending),
    ),
    ...bucketKeys.map((bucketKey) =>
      clickableMetricColumn(
        bucketKey,
        `bucket_${bucketKey.replace(/[^a-zA-Z0-9]+/g, '_')}`,
        (params: any) => metricCellValue(params.data?.Buckets?.[bucketKey]),
        { bucketKey },
      ),
    ),
  ];
};

const pickValue = (data: any, keys: string[]): any => {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return '';
};

export const bucketDetailsColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr No',
    field: 'srNo',
    width: 90,
    valueGetter: (params: any) => params.node?.rowIndex + 1,
  },
  {
    headerName: 'Vehicle No',
    field: 'vehicleno',
  },
  {
    headerName: 'Milk Type',
    field: 'milktype',
  },
  {
    headerName: 'Destination',
    field: 'destination',
    valueGetter: (params: any) =>
      pickValue(params.data, ['Destination', 'destination', 'destinationName']),
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
    valueGetter: (params: any) =>
      pickValue(params.data, ['Quantity', 'quantity']),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Transit Status',
    field: 'transit_status',
    valueGetter: (params: any) =>
      pickValue(params.data, [
        'Transit Status',
        'transitStatus',
        'transit_status',
      ]),
    cellRenderer: (params: any) => {
      debugger;
      const raw = params.value;
      const numericValue = Number(raw);

      let status = 'Unknown';
      if (numericValue == 1 || raw == 'To be Dispatched')
        status = 'To be Dispatched';
      if (numericValue == 2 || raw == 'In Transit') status = 'In Transit';

      const statusClass =
        status === 'To be Dispatched'
          ? 'bg-primary'
          : status === 'In Transit'
            ? 'bg-info'
            : 'bg-secondary';
      const span = document.createElement('span');
      span.className = `badge ${statusClass}`;
      span.textContent = status;
      return span.outerHTML;
    },
  },
  {
    headerName: 'Arrival Date',
    field: 'arrivalDate',
    valueGetter: (params: any) =>
      pickValue(params.data, [
        'Arrival Date',
        'ArrivalDate',
        'arrivalDate',
        'arivaldate',
      ]),
  },
];
