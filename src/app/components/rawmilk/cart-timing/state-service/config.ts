import {
  ActionCellRendererComponent,
  GridColumnConfig,
  StatusCellRendererComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { colors } from '../../../../shared/utils/constants';

export const cartTimingColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Adda Name',
    field: 'adda_name',
    width: 200,
    valueGetter: (params: any) => {
      const addaName = params?.data?.adda_name || '';
      const addaCode = params?.data?.adda_code || '';
      return addaName && addaCode
        ? `${addaName}-${addaCode}`
        : addaName || addaCode;
    },
  },
  {
    headerName: 'Franchise Name',
    field: 'franchise_name',

    valueGetter: (params: any) => {
      const franchiseName = params?.data?.franchise_name || '';
      const franchiseCode = params?.data?.franchise_code || '';
      return franchiseName && franchiseCode
        ? `${franchiseName}-${franchiseCode}`
        : franchiseName || franchiseCode;
    },
  },
  {
    headerName: 'No of Carts',
    field: 'noOfCart',
    width: 120,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Day',
    field: 'day',
    width: 160,
    valueGetter: (params: any) => {
      const day = params?.data?.day;
      const dayMap: Record<string, string> = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
        '7': 'Sunday',
      };
      if (day === null || day === undefined || day === '') {
        return '';
      }
      return dayMap[String(day)] || String(day);
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Start Time',
    field: 'start_time',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
    width: 120,
  },
  {
    headerName: 'End Time',
    field: 'end_time',
    width: 120,

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 140,
    minWidth: 120,
    valueGetter: (params: any) =>
      Number(params?.data?.status) === 1 ? 'Active' : 'Deactive',
    cellRenderer: StatusCellRendererComponent,
    cellRendererParams: {
      status: (params: any) =>
        Number(params?.data?.status) === 1 ? 'active' : 'inactive',
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Action',
    field: 'action',
    pinned: 'right',
    width: 100,
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa-solid fa-pen-to-square',
          tooltip: 'Edit',
          onClick: (data: any, node: any, params: any) => {
            const parent = params?.context?.componentParent;
            if (parent && typeof parent.onEdit === 'function') {
              parent.onEdit(data);
            }
          },
          iconStyle: {
            color: colors.primary,
            cursor: 'pointer',
            fontSize: '16px',
          },
        },
      ],
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
    sortable: false,
    filter: false,
  },
];
const statusList: Option[] = [
  { name: 'Active', id: 1 },
  { name: 'Deactive', id: 2 },
];
export const dayList = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];

const dayListOptions: Option[] = dayList.map((day) => ({
  name: day.label,
  id: day.value,
}));

export const getStatusOption = (status: any): Option | null => {
  const statusId = Number(status) === 1 ? 1 : 2;
  return statusList.find((item) => Number(item.id) === statusId) || null;
};

export const getDayOption = (day: any): Option | null => {
  const dayValue = Number(day);
  if (Number.isNaN(dayValue)) {
    return null;
  }
  return dayListOptions.find((item) => Number(item.id) === dayValue) || null;
};

export const editFields = (
  addaList: Option[] = [],
  franchiseList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'adda_code',
    type: 'select',
    label: 'Adda',
    placeholder: 'Select Adda',
    options: addaList,
    required: true,
  },
  {
    name: 'noOfCart',
    type: 'number',
    label: 'No Of Cart',
    placeholder: 'Enter No Of Cart',
    required: true,
    min: 1,
  },
  {
    name: 'franchise_code',
    type: 'select',
    label: 'Franchise',
    placeholder: 'Select Franchise',
    options: franchiseList,
    required: true,
  },
  {
    name: 'start_time',
    type: 'time',
    label: 'Start Time',
    placeholder: 'Select Start Time',
    required: true,
  },
  {
    name: 'end_time',
    type: 'time',
    label: 'End Time',
    placeholder: 'Select End Time',
    required: true,
  },
  {
    name: 'day',
    type: 'select',
    label: 'Day',
    placeholder: 'Select Day',
    options: dayListOptions,
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: statusList,
    required: true,
  },
];
export const addFields = (
  addaList: Option[] = [],
  franchiseList: Option[] = [],
  noOfFranchise: number = 1,
): FieldConfig[] => [
  {
    name: 'adda_code',
    type: 'select',
    label: 'Adda',
    placeholder: 'Select Adda',
    options: addaList,
    required: true,
  },
  {
    name: 'noOfCart',
    type: 'number',
    label: 'No of Cart',
    placeholder: 'Enter No Of Cart',
    required: true,
    min: 1,
  },
  {
    name: 'noOfFranchise',
    type: 'number',
    label: 'No Of Franchise',
    placeholder: 'Enter No Of Franchise',
    required: true,
    min: 1,
    emitValueChanges: true,
  },
  ...Array.from({ length: Math.max(1, Number(noOfFranchise) || 1) }).flatMap(
    (_, index) => {
      const sectionNo = index + 1;
      const suffix = sectionNo === 1 ? '' : `_${sectionNo}`;

      return [
        {
          name: `franchise_code${suffix}`,
          type: 'select',
          label: sectionNo === 1 ? 'Franchise' : `Franchise ${sectionNo}`,
          placeholder: 'Select Franchise',
          options: franchiseList,
          required: true,
          class: 'col-md-12',
        },
        {
          name: `franchiseDetails${suffix}`,
          label: '',
          type: 'formarray',
          class: 'col-12',
          minItems: 1,
          labelClass: 'font-weight-bold ',
          formArrayFields: [
            {
              name: 'start_time',
              type: 'time',
              label: 'Start Time',
              placeholder: 'Select Start Time',
              required: true,
              class: 'col-md-3',
            },
            {
              name: 'end_time',
              type: 'time',
              label: 'End Time',
              placeholder: 'Select End Time',
              required: true,
              class: 'col-md-3',
            },
            {
              name: 'day',
              type: 'select',
              label: 'Day',
              placeholder: 'Select Day',
              options: dayListOptions,
              required: true,
              class: 'col-md-4',
            },
          ],
        },
      ] as FieldConfig[];
    },
  ),
];
