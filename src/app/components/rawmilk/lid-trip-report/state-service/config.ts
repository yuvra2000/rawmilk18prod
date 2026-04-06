import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';

export const lidOpenLocationOptions: Option[] = [
	{ id: 'All', name: 'All' },
	{ id: 'Source', name: 'Source' },
	{ id: 'Destination', name: 'Destination' },
	{ id: 'Others (Moving)', name: 'Others (Moving)' },
	{ id: 'Others (stopped)', name: 'Others (stopped)' },
];

export const lidTripReportFilterFields = (mpcNameList: Option[] = []): FieldConfig[] => [
	{
		name: 'fromDate',
		type: 'datetime',
		label: 'From Date',
		placeholder: 'Select Date & Time',
		required: false,
	},
	{
		name: 'toDate',
		type: 'datetime',
		label: 'To Date',
		placeholder: 'Select Date & Time',
		required: false,
	},
	{
		name: 'mpcName',
		type: 'select',
		label: 'MPC Name',
		placeholder: '--Select--',
		options: mpcNameList,
		bindLabel: 'name',
		required: false,
	},
	{
		name: 'lidOpenLocation',
		type: 'select',
		label: 'Location',
		placeholder: '--Select--',
		options: lidOpenLocationOptions,
		bindLabel: 'name',
		required: false,
	},
];

export const lidTripGridColumns: GridColumnConfig[] = [
	{
		headerName: 'Sr No',
		field: 'serialNo',
		valueGetter: (params: any) => params.node.rowIndex + 1,
		width: 100,
	},
	{
		headerName: 'Group ID',
		field: 'GroupId',
	},
	{
		headerName: 'Supplier',
		valueGetter: (params: any) => {
			if (params.data?.MpcName || params.data?.MpcCode) {
				return `${params.data?.MpcName || ''}-${params.data?.MpcCode || ''}`;
			}
			return '';
		},
	},
	{
		headerName: 'Mcc',
		valueGetter: (params: any) => {
			if (params.data?.MccName || params.data?.MccCode) {
				return `${params.data?.MccName || ''}-${params.data?.MccCode || ''}`;
			}
			return '';
		},
	},
	{
		headerName: 'Dispatch Location',
		field: 'MccCoords',
	},
	{
		headerName: 'Lr No.',
		field: 'LrNumber',
	},
	{
		headerName: 'Transporter Name',
		field: 'TransporterName',
	},
	{
		headerName: 'Destination',
		field: 'DestinationName',
	},
	{
		headerName: 'Destination Geocoord',
		field: 'DestinationCoords',
	},
	{
		headerName: 'Gate In Time',
		field: 'plantGateInTime',
	},
	{
		headerName: 'Gate Out Time',
		field: 'plantGateOutTime',
	},
	{
		headerName: 'Lock closing Time',
		valueGetter: (params: any) => {
			const data = params.data;
			if (!data) return '';
			let result = [];
			if (data.ImeiData1) result.push(`${data.ImeiData1.DeviceLocation || ''} - ${data.ImeiData1.ClosingTime || ''}`);
			if (data.ImeiData2) result.push(`${data.ImeiData2.DeviceLocation || ''} - ${data.ImeiData2.ClosingTime || ''}`);
			if (data.ImeiData3) result.push(`${data.ImeiData3.DeviceLocation || ''} - ${data.ImeiData3.ClosingTime || ''}`);
			if (data.ImeiData4) result.push(`${data.ImeiData4.DeviceLocation || ''} - ${data.ImeiData4.ClosingTime || ''}`);
			return result.join(' / ');
		},
	},
	{
		headerName: 'User Id',
		valueGetter: (params: any) => {
			const data = params.data;
			if (!data) return '';
			let result = [];
			if (data.ImeiData1 && data.ImeiData1.Username) result.push(data.ImeiData1.Username);
			if (data.ImeiData2 && data.ImeiData2.Username) result.push(data.ImeiData2.Username);
			if (data.ImeiData3 && data.ImeiData3.Username) result.push(data.ImeiData3.Username);
			if (data.ImeiData4 && data.ImeiData4.Username) result.push(data.ImeiData4.Username);
			return result.join(', ');
		},
	},
	{
		headerName: 'Alert Type',
		field: 'AlertType',
	},
	{
		headerName: 'Unlock Time',
		field: 'UnlockTime',
	},
	{
		headerName: 'Unlock Geocoord',
		field: 'UnlockGeocoord',
	},
	{
		headerName: 'Unlock Location',
		field: 'UnlockLocation',
	},
	{
		headerName: 'Lock Time',
		field: 'LockTime',
	},
	{
		headerName: 'Lock Geocoord',
		field: 'LockGeocoord',
	},
	{
		headerName: 'Lock Location',
		field: 'LockLocation',
	},
	{
		headerName: 'Violation Time',
		field: 'ViolationTime',
	},
	{
		headerName: 'V_Qat',
		valueGetter: (params: any) => params.data?.ActualVariations?.Qty,
	},
	{
		headerName: 'V_Fat',
		valueGetter: (params: any) => params.data?.ActualVariations?.Fat,
	},
	{
		headerName: 'V_Snf',
		valueGetter: (params: any) => params.data?.ActualVariations?.Snf,
	},
	{
		headerName: 'Dispatch No',
		field: 'DispatchNo',
	},
	{
		headerName: 'Indent No',
		field: 'IndentNo',
	},
	{
		headerName: 'Dispatch Date & Time',
		field: 'DispatchDate',
	},
	{
		headerName: 'Dispatch Close Date',
		field: 'DisCloseDate',
	},
	{
		headerName: 'Vehicle No',
		field: 'VehicleNumber',
	},
	{
		headerName: 'IMEI No',
		field: 'ImeiNo',
	},
	{
		headerName: 'Device Type Name',
		field: 'DeviceTypeName',
	},
	{
		headerName: 'Device Location Name',
		field: 'DeviceLocName',
	},
	{
		headerName: 'Lid Open Location',
		field: 'LidOpenLoc',
	},
	{
		headerName: 'Stoppage Location',
		field: 'StopLocation',
	},
	{
		headerName: 'Stoppage Start Time',
		field: 'StopStartTime',
	},
	{
		headerName: 'Stoppage End Time',
		field: 'StopEndTime',
	},
	{
		headerName: 'Stoppage Duration',
		field: 'StopDuration',
	},
];
