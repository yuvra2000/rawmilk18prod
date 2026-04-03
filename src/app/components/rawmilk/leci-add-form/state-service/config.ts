import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';

const negPosOptions: Option[] = [
    { id: 'NEG', name: 'NEG' },
    { id: 'POS', name: 'POS' }
];

const okOptions: Option[] = [
    { id: 'OK', name: 'OK' },
    { id: 'NOK', name: 'NOK' }
];

const cleanlinessOptions: Option[] = [
    { id: 'SAT', name: 'SAT' },
    { id: 'UNSAT', name: 'UNSAT' }
];

const organolepticOptions: Option[] = [
    { id: 'NOR', name: 'NOR' },
    { id: 'ABR', name: 'ABR' }
];

const foreignMatterOptions: Option[] = [
    { id: 'ABS', name: 'ABS' },
    { id: 'PRE', name: 'PRE' }
];

const usageDecisionOptions: Option[] = [
    { id: 'A010', name: 'A010' }
];

const appearanceOptions: Option[] = [
    { id: 'OK', name: 'OK' },
    { id: 'NOT OK', name: 'NOT OK' }
];

export const leciAddFormFields = (): FieldConfig[] => [
    {
        name: 'truckNo',
        type: 'text',
        label: 'Truck No',
        placeholder: 'Enter Truck No',
    },
    {
        name: 'compartmentNo',
        type: 'text',
        label: 'Compartment No',
        placeholder: 'Enter Compartment No',
    },
    {
        name: 'driverName',
        type: 'text',
        label: 'Driver Name',
        placeholder: 'Enter Driver Name',
    },
    {
        name: 'lrNo',
        type: 'text',
        label: 'LR No',
        placeholder: 'Enter LR No',
    },
    {
        name: 'dispatchDate',
        type: 'text',
        label: 'Dispatch Date',
        placeholder: 'YYYY-MM-DD HH:MM:SS',
    },
    {
        name: 'supplierCode',
        type: 'text',
        label: 'Supplier Code',
        placeholder: 'Enter Supplier Code',
    },
    {
        name: 'mccCode',
        type: 'text',
        label: 'BMC / MCC Code',
        placeholder: 'Enter MCC Code',
    },
    {
        name: 'schedulingAgreementNo',
        type: 'text',
        label: 'Scheduling Agreement No',
        placeholder: 'Enter Agreement No',
    },
    {
        name: 'poLineNumber',
        type: 'text',
        label: 'PO Line Number',
        placeholder: 'Enter PO Line No',
    },
    {
        name: 'supplierFat',
        type: 'text',
        label: 'Supplier FAT',
        placeholder: 'Enter Supplier FAT',
    },
    {
        name: 'supplierSnf',
        type: 'text',
        label: 'Supplier SNF',
        placeholder: 'Enter Supplier SNF',
    },
    {
        name: 'materialCode',
        type: 'text',
        label: 'Material Code',
        placeholder: 'Enter Material Code',
    },
    {
        name: 'plantCode',
        type: 'text',
        label: 'Plant Code',
        placeholder: 'Enter Plant Code',
    },
    {
        name: 'validityPeriod',
        type: 'text',
        label: 'Validity Period',
        placeholder: 'Enter Validity Period',
    },
    {
        name: 'secutrackDispatchNo',
        type: 'text',
        label: 'Secutrack Dispatch No.',
        placeholder: 'Enter Dispatch No',
    },
    {
        name: 'quantity103',
        type: 'text',
        label: 'Quantity-103',
        placeholder: 'Enter Quantity',
    },
    {
        name: 'checkInDate',
        type: 'date',
        label: 'Check In Date',
        placeholder: 'Select Date',
    },
    {
        name: 'checkInTime',
        type: 'text',
        label: 'Check In Time',
        placeholder: 'Enter Time',
    },
    {
        name: 'checkPointNumber',
        type: 'text',
        label: 'Check Point Number',
        placeholder: 'Enter Point No',
    },
    {
        name: 'documentDate',
        type: 'date',
        label: 'Document Date',
        placeholder: 'Select Date',
    },
    {
        name: 'postingDate',
        type: 'date',
        label: 'Posting Date',
        placeholder: 'Select Date',
    },
    {
        name: 'netQuantityReceived',
        type: 'text',
        label: 'Net Quantity Received',
        placeholder: 'Enter Net Quantity',
    },
    {
        name: 'seal',
        type: 'select',
        label: 'Seal',
        placeholder: 'Select Seal',
        options: okOptions,
    },
    {
        name: 'cleanliness',
        type: 'select',
        label: 'Cleanliness',
        placeholder: 'Select Cleanliness',
        options: cleanlinessOptions,
    },
    {
        name: 'temperature',
        type: 'text',
        label: 'Temperature °C',
        placeholder: 'Enter Temp',
    },
    {
        name: 'organolepticEvaluation',
        type: 'select',
        label: 'Organoleptic Evaluation',
        placeholder: 'Select Evaluation',
        options: organolepticOptions,
    },
    {
        name: 'foreignMatter',
        type: 'select',
        label: 'Foreign matter',
        placeholder: 'Select Foreign Matter',
        options: foreignMatterOptions,
    },
    {
        name: 'titrableAcidity',
        type: 'text',
        label: 'Titrable Acidity%on 8.5% SNF',
        placeholder: 'Enter Acidity',
    },
    {
        name: 'methyleneBrtTest',
        type: 'text',
        label: 'Methylene (BRT) Test',
        placeholder: 'Enter MBRT',
    },
    {
        name: 'clotOnBoiling',
        type: 'select',
        label: 'Clot on boiling',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'alcoholTest',
        type: 'select',
        label: 'Alcohol test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'neutralizerRaTest',
        type: 'select',
        label: 'Neutralizer(R A) test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'ureaTest',
        type: 'select',
        label: 'Urea test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'ammoniaCompound',
        type: 'select',
        label: 'Ammonia compound',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'starchCerealFlourTest',
        type: 'select',
        label: 'Starch & Cereal Flour test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'saltTest',
        type: 'select',
        label: 'Salt test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'sugarTest',
        type: 'select',
        label: 'Sugar test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'glucoseTest',
        type: 'select',
        label: 'Glucose test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'maltodextrinTest',
        type: 'select',
        label: 'Maltodextrin test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'sodiumIonPpm',
        type: 'text',
        label: 'Sodium ion (ppm) on 8.5% SNF',
        placeholder: 'Enter Sodium',
    },
    {
        name: 'reichertMeissleValue',
        type: 'text',
        label: 'Reichert Meissle Value',
        placeholder: 'Enter RM Value',
    },
    {
        name: 'brAt40C',
        type: 'text',
        label: 'BR at 40°C',
        placeholder: 'Enter BR',
    },
    {
        name: 'detergentTest',
        type: 'select',
        label: 'Detergent test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'formalinTest',
        type: 'select',
        label: 'Formalin Test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'hydrogenPeroxideTest',
        type: 'select',
        label: 'Hydrogen Peroxide Test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'addedSmpTest',
        type: 'select',
        label: 'Added SMP Test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'fatPercent',
        type: 'text',
        label: 'Fat %',
        placeholder: 'Enter Fat %',
    },
    {
        name: 'proteinPercent',
        type: 'text',
        label: 'Protein%',
        placeholder: 'Enter Protein %',
    },
    {
        name: 'snfPercent',
        type: 'text',
        label: 'SNF%',
        placeholder: 'Enter SNF %',
    },
    {
        name: 'totalSolidsPercent',
        type: 'text',
        label: 'Total Solids %',
        placeholder: '',
        disabled: true,
    },
    {
        name: 'proteinOnSnfBasis',
        type: 'text',
        label: 'Protein% on SNF basis',
        placeholder: '',
        disabled: true,
    },
    {
        name: 'usageDecisionCode',
        type: 'select',
        label: 'Usage decision code',
        placeholder: 'Select Code',
        options: usageDecisionOptions,
    },
    {
        name: 'qa32Qnty',
        type: 'text',
        label: 'QA32 QNTY',
        placeholder: 'Enter QNTY',
    },
    {
        name: 'storageLocation',
        type: 'text',
        label: 'Storage Location',
        placeholder: 'Enter Location',
    },
    {
        name: 'appearance',
        type: 'select',
        label: 'Appearance',
        placeholder: 'Select Appearance',
        options: appearanceOptions,
    },
    {
        name: 'nitrateCompound',
        type: 'select',
        label: 'Nitrate Compound',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'boricAcid',
        type: 'select',
        label: 'Boric Acid',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'elisaTest',
        type: 'select',
        label: 'ELISA Test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
    },
    {
        name: 'remarks',
        type: 'textarea',
        label: 'Remarks',
        placeholder: 'Enter Remarks',
        rows: 1,
        forceNewLine: true,
    }
];
