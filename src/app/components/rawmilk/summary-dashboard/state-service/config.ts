import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const filterfields = (
  supplierList: Option[] = [],
  plantList: Option[] = [],
  milkTypeList: Option[] = []
): FieldConfig[] => [
  {
    name: 'fromDate',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
    class: 'col-md-2'
  },
  {
    name: 'toDate',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
    class: 'col-md-2'
  },
  {
    name: 'supplier',
    type: 'select',
    label: 'Supplier',
    placeholder: 'Select Supplier',
    options: supplierList,
    bindLabel: 'displayName',
    class: 'col-md-2'
  },
  {
    name: 'plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: plantList,
    bindLabel: 'displayName',
    class: 'col-md-2'
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
    class: 'col-md-2'
  }
];

export const generateGridColumns = (plantHeaders: string[]): GridColumnConfig[] => {
  const baseColumns: GridColumnConfig[] = [
    {
      headerName: 'S. No.',
      field: 'serialNo',
      valueGetter: (params: any) => (params.node ? params.node.rowIndex + 1 : null),
      width: 100,
    },
    {
      headerName: 'Supplier',
      field: 'Supplier',
    },
    {
      headerName: 'Total Trips',
      field: 'TripCount',
      cellRenderer: (params: any) => {
        const val = params.value || '';
        if (!val || val === '0') return val;
        
        const span = document.createElement('span');
        span.innerText = val;
        span.style.color = '#1D4380';
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'underline';
        span.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.showDispatchDetails(
              params.data,
              'All Plants',
              params.data.TripDisId
            );
          }
        });
        return span;
      }
    },
  ];

  const dynamicCols: GridColumnConfig[] = plantHeaders.map(plant => ({
    headerName: plant,
    field: plant,
    cellRenderer: (params: any) => {
      // console.log('Rendering cell for plant:', plant, 'with data:', params.data);
      const plantObj = params.data?.[plant];
      console.log(plantObj);
      const qty = plantObj ? plantObj.Qty : '-';

      if (qty === '-') {
        return qty;
      }

      const span = document.createElement('span');
      span.innerText = qty;
      span.style.color = '#1D4380';
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.showDispatchDetails(
            params.data,
            plant,
            plantObj.PlantDisId
          );
        }
      });
      return span;
    },
  }));

  const totalColumn: GridColumnConfig = {
    headerName: 'Total',
    field: 'TotalQty',
  };

  return [...baseColumns, ...dynamicCols, totalColumn];
};

export const dispatchDetailColumns: GridColumnConfig[] = [
  {
    headerName: 'SL',
    field: 'serialNo',
    valueGetter: (params: any) => (params.node ? params.node.rowIndex + 1 : null),
    width: 60,
  },
  {
    headerName: 'Dispatch No',
    field: 'DispatchNum',
  },
  {
    headerName: 'Vehicle No',
    field: 'VehicleNum',
  },
  {
    headerName: 'Quantity',
    field: 'TotalQty',
  },
  {
    headerName: 'Supplier Name',
    field: 'SupplierName',
  },
  {
    headerName: 'Dispatch Location',
    field: 'DisLocName',
  },
  {
    headerName: 'Plant',
    field: 'PlantName',
  },
  {
    headerName: 'Dispatch Date',
    field: 'DispatchDate',
  },
];

