import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

export const leciReportColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'sno',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
    pinned: 'left',
  },

  // ─── Gate Entry (LECI) ───────────────────────────────────────────────
  {
    headerName: 'Gate Entry(LECI)',
    children: [
      {
        headerName: 'Check In Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['CheckInDate'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Check In Time',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['CheckInTime'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Truck No',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['TruckNo'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Compartment No 1',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['CompartmentNo'],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Driver Name',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['DriverName'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'LR No',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['LrNo'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Dispatch Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['DispatchDate'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Supplier Code',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['MilkSupplierCode'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'BMC/ MCC Code',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['MccCode'],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Check point Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['CheckPointNo'],
                width: 170,
              },
            ],
          },
        ],
      },
      {
        headerName: 'LECI Message',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['LeciMessage'],
                width: 200,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Gate Entry Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['GateEntry-LECI']?.['GateEntryNo'],
                width: 170,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── MIGO 103 ────────────────────────────────────────────────────────
  {
    headerName: 'MIGO 103',
    children: [
      {
        headerName: 'Scheduling Agreement No',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['SchedulingAgreementNo'],
                width: 200,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Document Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['MIG103-DocumentDate'],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Posting Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['MIG103-PostingDate'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'PO Line Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['PO-LineNo'],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Quantity - 103',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['Quantity103'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Supplier FAT',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['Supplier-FAT'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Supplier SNF',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['Supplier-SNF'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'MIGO Message',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['MIGO-Message'],
                width: 220,
              },
            ],
          },
        ],
      },
      {
        headerName: 'MIGO - 103 Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIG103']?.['MIGO103-No'],
                width: 180,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── QA32 ────────────────────────────────────────────────────────────
  {
    headerName: 'QA32',
    children: [
      // Seal: Level2=ColumnLabel, Level3=OK/NOK (value range), Level4=SEAL (SAP code)
      {
        headerName: 'Seal',
        children: [
          {
            headerName: 'OK/NOK',
            children: [
              {
                headerName: 'SEAL',
                valueGetter: (params: any) => params.data?.['QA32']?.['Seal'],
                width: 100,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Cleanliness',
        children: [
          {
            headerName: 'SAT/UNSAT',
            children: [
              {
                headerName: 'CLEAN',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Cleanliness'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Temperature degree celcius',
        children: [
          {
            headerName: 'Max 7',
            children: [
              {
                headerName: 'TEMPUL',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Temperature-Degree'],
                width: 220,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Organoleptic Evaluation',
        children: [
          {
            headerName: 'NOR/ABR',
            children: [
              {
                headerName: 'OREV',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Organoleptic-Evaluation'],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Foreign matter',
        children: [
          {
            headerName: 'PRE/ABS',
            children: [
              {
                headerName: 'FM',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['ForeignMatter'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Titrable Acidity % on 8.5% SNF',
        children: [
          {
            headerName: '0.100 to 0.153',
            children: [
              {
                headerName: 'TALABL',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['TitrableAcidity%'],
                width: 240,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Methylene Blue Reduction Time Test',
        children: [
          {
            headerName: 'Min 30 minutes',
            children: [
              {
                headerName: 'MBRTLLM',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['MethyleneBlueReduction'],
                width: 260,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Clot on boiling',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'COB',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['ClotOnBoiling'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Alcohol test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'ALCOH',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['AlcoholTest'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Neutralizer (Rosalic acid ) test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'NEUT',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Neutralizer'],
                width: 220,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Urea test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'UREA',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['UreaTest'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Ammonia compound',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'AMMCOMP',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Ammonia-Compound'],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Starch and Cereal Flour test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'STRACH',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Starch/Cereal(FlourTest)'],
                width: 210,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Salt test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'SALT',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['SaltTest'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Sugar test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'SUGAR',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['SugarTest'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Glucose test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'GLUCOSE',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['GlucoseTest'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Maltodextrin ( By Enzymatic ) test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'MALTODEX',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Maltodextrin'],
                width: 240,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Sodium ion ( ppm ) on 8.5% SNF',
        children: [
          {
            headerName: 'Max 550 ppm',
            children: [
              {
                headerName: 'SODIUMML',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Sodium-ION'],
                width: 240,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Reichert Meissle ( RM ) Value',
        children: [
          {
            headerName: 'Min 26',
            children: [
              {
                headerName: 'RM',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Reichert-Meissle'],
                width: 240,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Butyro Refractometer (BR ) at 40°C',
        children: [
          {
            headerName: '40 to 44',
            children: [
              {
                headerName: 'BRR',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Butyro-Refractometer'],
                width: 260,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Detergent test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: 'DETER',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['DetergentTest'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Formalin Test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Formalin-Test'],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Hydrogen Peroxide Test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['HydrogenPerOxide-Test'],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Added SMP Test',
        children: [
          {
            headerName: 'POS/NEG',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['QA32-AddedSmpTest'],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Fat %',
        children: [
          {
            headerName: 'Target 6.5 (Range 6.4-6.6)',
            children: [
              {
                headerName: 'FATBLR',
                valueGetter: (params: any) => params.data?.['QA32']?.['Fat%'],
                width: 200,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Protein%',
        children: [
          {
            headerName: 'Min 34%',
            children: [
              {
                headerName: 'PRTNL',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Protein%'],
                width: 100,
              },
            ],
          },
        ],
      },
      {
        headerName: 'SNF%',
        children: [
          {
            headerName: 'Target 9.3 (Range 9.1-9.5)',
            children: [
              {
                headerName: 'SNFBLR',
                valueGetter: (params: any) => params.data?.['QA32']?.['Snf%'],
                width: 240,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Total Solids %',
        children: [
          {
            headerName: 'AZ+BB',
            children: [
              {
                headerName: 'TSBL',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['TotalSolid%'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Protein% on SNF basis',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'PRTCAL',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['Protein%(Snf-Basis)'],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Usage decision code',
        children: [
          {
            headerName: 'A010',
            children: [
              {
                headerName: 'VCODE',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['UsageDecisionCode'],
                width: 190,
              },
            ],
          },
        ],
      },
      {
        headerName: 'QA32 QNTY',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['QA32']?.['QA32-Quantity'],
                width: 120,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── MIGO-Mvt 105 ────────────────────────────────────────────────────
  {
    headerName: 'MIGO-Mvt 105 (ReleasedGR Block stock)',
    children: [
      {
        headerName: 'Document Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'BLDAT',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'MIGO-MVT105-DocumentDate'
                  ],
                width: 160,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Posting Date',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'BUDAT',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'MIGO-MVT105-PostingDate'
                  ],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Net Quantity Received',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'MENGE',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'NetQuantityReceived'
                  ],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Storage Location',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'LGORT',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'StorageLocation'
                  ],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Date of Manufacture',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: 'BUDAT',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'ManufactureDate'
                  ],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'MIGO Message (Auto Populate from SAP)',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'MIGO105-Message'
                  ],
                width: 310,
              },
            ],
          },
        ],
      },
      {
        headerName: 'MIGO-105 Number (Auto Populate)',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MIGO-MVT105(ReleasedGrBlockStock)']?.[
                    'MIGO105-Number'
                  ],
                width: 280,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── Material Code, Agreement and Plant Code ─────────────────────────
  {
    headerName: 'Material Code, Agreement and Plant Code',
    children: [
      {
        headerName: 'Material Code',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.[
                    'MaterialCode'
                  ],
                width: 130,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Agreement Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.[
                    'AgreementNo'
                  ],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Plant Code',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.[
                    'PlantCode'
                  ],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Master Sheet Id',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.[
                    'MasterSheetId'
                  ],
                width: 180,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Line Number',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.['LineNo'],
                width: 120,
              },
            ],
          },
        ],
      },
      {
        headerName: 'Mismatch',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MaterialCode/Agreement/PlantCode']?.[
                    'Mismatch'
                  ],
                width: 120,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── Milk Supplier code and BMC/MCC ──────────────────────────────────
  {
    headerName: 'Milk Supplier code and BMC/MCC',
    children: [
      {
        headerName: '', // spacer
        children: [
          {
            headerName: 'MismatchSupplier',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MilkSupplierCode']?.['Mismatch'],
                width: 150,
              },
            ],
          },
        ],
      },
      {
        headerName: 'MismatchMcc',
        children: [
          {
            headerName: '',
            children: [
              {
                headerName: '',
                valueGetter: (params: any) =>
                  params.data?.['MilkSupplierCode']?.['MismatchMcc'],
                width: 130,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── Standalone columns ───────────────────────────────────────────────
  {
    headerName: 'Duplicate Records',
    children: [
      {
        headerName: '',
        children: [
          {
            headerName: '',
            field: 'DuplicateRecords',
            width: 150,
          },
        ],
      },
    ],
  },
  {
    headerName: 'Completed / Not Completed',
    children: [
      {
        headerName: '',
        children: [
          {
            headerName: '',
            field: 'Completed/NotCompleted',
            width: 240,
          },
        ],
      },
    ],
  },

  // ─── Others Details ───────────────────────────────────────────────────
  {
    headerName: 'Others Details',
    children: [
      {
        headerName: 'Qtl Validation',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'Qtl-Validation', width: 130 }],
          },
        ],
      },
      {
        headerName: 'Supplier Name as per Agreement',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'SupplierName', width: 280 }],
          },
        ],
      },
      {
        headerName: 'Material Name',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'MaterialName', width: 180 }],
          },
        ],
      },
      {
        headerName: 'Difference',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'Difference', width: 120 }],
          },
        ],
      },
      {
        headerName: 'Validity Period End',
        children: [
          {
            headerName: '',
            children: [
              { headerName: '', field: 'ValidityPeriodEnd', width: 150 },
            ],
          },
        ],
      },
      {
        headerName: 'Appearance',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'Appearance', width: 120 }],
          },
        ],
      },
      {
        headerName: 'Nitrate Compound',
        children: [
          {
            headerName: '',
            children: [
              { headerName: '', field: 'NitrateCompound', width: 150 },
            ],
          },
        ],
      },
      {
        headerName: 'Boric Acid',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'BoricAcid', width: 120 }],
          },
        ],
      },
      {
        headerName: 'Added SMP Test',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'AddedSmpTest', width: 160 }],
          },
        ],
      },
      {
        headerName: 'ELISA Test',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'ElisaTest', width: 120 }],
          },
        ],
      },
      {
        headerName: 'Goods Recipient',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'Goodsrecipient', width: 150 }],
          },
        ],
      },
      {
        headerName: 'Secutrack Dispatch No.',
        children: [
          {
            headerName: '',
            children: [
              { headerName: '', field: 'SecutrakDispatchNo', width: 180 },
            ],
          },
        ],
      },
      {
        headerName: 'Remarks',
        children: [
          {
            headerName: '',
            children: [{ headerName: '', field: 'Remarks', width: 200 }],
          },
        ],
      },
    ],
  },
];

export const leciFilterFields = (
  mpcOptions: Option[] = [],
  mccOptions: Option[] = [],
): FieldConfig[] => [
  {
    name: 'fromDate',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
  },
  {
    name: 'toDate',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
  },
  {
    name: 'mpc',
    type: 'select',
    label: 'MPC',
    placeholder: 'Select MPC',
    options: mpcOptions,
    bindLabel: 'name',
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'MCC',
    placeholder: 'Select MCC',
    options: mccOptions,
    bindLabel: 'name',
  },
];
