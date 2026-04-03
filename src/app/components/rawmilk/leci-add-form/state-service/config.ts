import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';

const okOptions: Option[] = [
    { id: 'OK', name: 'OK' },
    { id: 'NOT', name: 'NOT' },
    { id: 'NS', name: 'NS' }
];

const cleanlinessOptions: Option[] = [
    { id: 'SAT', name: 'SAT' },
    { id: 'UNST', name: 'UNST' }
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
    { id: 'A010', name: 'A010' },
    { id: 'A020', name: 'A020' },
    { id: 'R010', name: 'R010' }
];

const appearanceOptions: Option[] = [
    { id: 'OK', name: 'OK' },
    { id: 'NOK', name: 'NOK' },
    { id: 'NS', name: 'NS' }
];

const negPosOptions: Option[] = [
    { id: 'POS', name: 'POS' },
    { id: 'NEG', name: 'NEG' }
];

const specialTestOptions: Option[] = [
    { id: 'NEG', name: 'NEG' },
    { id: 'POS', name: 'POS' },
    { id: 'NT', name: 'NT' }
];

const boricAcidOptions: Option[] = [
    { id: 'POS', name: 'POS' },
    { id: 'NEG', name: 'NEG' }
];

const elisaOptions: Option[] = [
    { id: 'APS', name: 'APS' },
    { id: 'NA', name: 'NA' },
    { id: 'NAPS', name: 'NAPS' }
];

export const leciAddFormFields = (): FieldConfig[] => [
    {
        name: 'truckNo',
        type: 'text',
        label: 'Truck No',
        placeholder: 'Enter Truck No',
        required: true,
        disabled: true
    },
    {
        name: 'compartmentNo',
        type: 'text',
        label: 'Compartment No',
        placeholder: 'Enter Compartment No',
        required: true,
        disabled: true
    },
    {
        name: 'driverName',
        type: 'text',
        label: 'Driver Name',
        placeholder: 'Enter Driver Name',
        required: true,
        disabled: true
    },
    {
        name: 'lrNo',
        type: 'text',
        label: 'LR No',
        placeholder: 'Enter LR No',
        required: true,
        disabled: true
    },
    {
        name: 'dispatchDate',
        type: 'text',
        label: 'Dispatch Date',
        placeholder: 'YYYY-MM-DD HH:MM:SS',
        required: true,
        disabled: true
    },
    {
        name: 'supplierCode',
        type: 'text',
        label: 'Supplier Code',
        placeholder: 'Enter Supplier Code',
        required: true,
        disabled: true
    },
    {
        name: 'mccCode',
        type: 'text',
        label: 'BMC / MCC Code',
        placeholder: 'Enter MCC Code',
        required: true,
        disabled: true
    },
    {
        name: 'schedulingAgreementNo',
        type: 'text',
        label: 'Scheduling Agreement No',
        placeholder: 'Enter Agreement No',
        required: true,
        disabled: true
    },
    {
        name: 'poLineNumber',
        type: 'text',
        label: 'PO Line Number',
        placeholder: 'Enter PO Line No',
        required: true,
        disabled: true
    },
    {
        name: 'supplierFat',
        type: 'text',
        label: 'Supplier FAT',
        placeholder: 'Enter Supplier FAT',
        required: true,
        disabled: true
    },
    {
        name: 'supplierSnf',
        type: 'text',
        label: 'Supplier SNF',
        placeholder: 'Enter Supplier SNF',
        required: true,
        disabled: true
    },
    {
        name: 'materialCode',
        type: 'text',
        label: 'Material Code',
        placeholder: 'Enter Material Code',
        required: true,
        disabled: true
    },
    {
        name: 'plantCode',
        type: 'text',
        label: 'Plant Code',
        placeholder: 'Enter Plant Code',
        required: true,
        disabled: true
    },
    {
        name: 'validityPeriod',
        type: 'text',
        label: 'Validity Period',
        placeholder: 'Enter Validity Period',
        required: true,
        disabled: true
    },
    {
        name: 'secutrackDispatchNo',
        type: 'text',
        label: 'Secutrack Dispatch No.',
        placeholder: 'Enter Dispatch No',
        required: true,
        disabled: true
    },
    {
        name: 'quantity103',
        type: 'text',
        label: 'Quantity-103',
        placeholder: 'Enter Quantity',
        required: true,
        disabled: true
    },
    {
        name: 'checkInDate',
        type: 'date',
        label: 'Check In Date',
        placeholder: 'Select Date',
        required: true
    },
    {
        name: 'checkInTime',
        type: 'text',
        label: 'Check In Time',
        placeholder: 'Enter Time',
        required: true
    },
    {
        name: 'checkPointNumber',
        type: 'text',
        label: 'Check Point Number',
        placeholder: 'Enter Point No',
        required: true,
        disabled: true
    },
    {
        name: 'documentDate',
        type: 'date',
        label: 'Document Date',
        placeholder: 'Select Date',
        required: true,
        disabled: true
    },
    {
        name: 'postingDate',
        type: 'date',
        label: 'Posting Date',
        placeholder: 'Select Date',
        required: true,
        disabled: true
    },
    {
        name: 'netQuantityReceived',
        type: 'text',
        label: 'Net Quantity Received',
        placeholder: 'Enter Net Quantity',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'seal',
        type: 'select',
        label: 'Seal',
        placeholder: 'Select Seal',
        options: okOptions,
        required: true
    },
    {
        name: 'cleanliness',
        type: 'select',
        label: 'Cleanliness',
        placeholder: 'Select Cleanliness',
        options: cleanlinessOptions,
        required: true
    },
    {
        name: 'temperature',
        type: 'text',
        label: 'Temperature °C',
        placeholder: 'Enter Temp',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'organolepticEvaluation',
        type: 'select',
        label: 'Organoleptic Evaluation',
        placeholder: 'Select Evaluation',
        options: organolepticOptions,
        required: true
    },
    {
        name: 'foreignMatter',
        type: 'select',
        label: 'Foreign matter',
        placeholder: 'Select Foreign Matter',
        options: foreignMatterOptions,
        required: true
    },
    {
        name: 'titrableAcidity',
        type: 'text',
        label: 'Titrable Acidity%on 8.5% SNF',
        placeholder: 'Enter Acidity',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'methyleneBrtTest',
        type: 'text',
        label: 'Methylene (BRT) Test',
        placeholder: 'Enter MBRT',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'clotOnBoiling',
        type: 'select',
        label: 'Clot on boiling',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'alcoholTest',
        type: 'select',
        label: 'Alcohol test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'neutralizerRaTest',
        type: 'select',
        label: 'Neutralizer(R A) test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'ureaTest',
        type: 'select',
        label: 'Urea test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'ammoniaCompound',
        type: 'select',
        label: 'Ammonia compound',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'starchCerealFlourTest',
        type: 'select',
        label: 'Starch & Cereal Flour test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'saltTest',
        type: 'select',
        label: 'Salt test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'sugarTest',
        type: 'select',
        label: 'Sugar test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'glucoseTest',
        type: 'select',
        label: 'Glucose test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'maltodextrinTest',
        type: 'select',
        label: 'Maltodextrin test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'sodiumIonPpm',
        type: 'text',
        label: 'Sodium ion (ppm) on 8.5% SNF',
        placeholder: 'Enter Sodium',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'reichertMeissleValue',
        type: 'text',
        label: 'Reichert Meissle Value',
        placeholder: 'Enter RM Value',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'brAt40C',
        type: 'text',
        label: 'BR at 40°C',
        placeholder: 'Enter BR',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'detergentTest',
        type: 'select',
        label: 'Detergent test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'formalinTest',
        type: 'select',
        label: 'Formalin Test',
        placeholder: 'Select NEG/POS/NT',
        options: specialTestOptions,
        required: true
    },
    {
        name: 'hydrogenPeroxideTest',
        type: 'select',
        label: 'Hydrogen Peroxide Test',
        placeholder: 'Select NEG/POS/NT',
        options: specialTestOptions,
        required: true
    },
    {
        name: 'addedSmpTest',
        type: 'select',
        label: 'Added SMP Test',
        placeholder: 'Select NEG/POS',
        options: negPosOptions,
        required: true
    },
    {
        name: 'fatPercent',
        type: 'text',
        label: 'Fat %',
        placeholder: 'Enter Fat %',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' },
        emitValueChanges: true
    },
    {
        name: 'proteinPercent',
        type: 'text',
        label: 'Protein%',
        placeholder: 'Enter Protein %',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' },
        emitValueChanges: true
    },
    {
        name: 'snfPercent',
        type: 'text',
        label: 'SNF%',
        placeholder: 'Enter SNF %',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' },
        emitValueChanges: true
    },
    {
        name: 'totalSolidsPercent',
        type: 'text',
        label: 'Total Solids %',
        placeholder: '',
        required: true,
        disabled: true,
    },
    {
        name: 'proteinOnSnfBasis',
        type: 'text',
        label: 'Protein% on SNF basis',
        placeholder: '',
        required: true,
        disabled: true,
    },
    {
        name: 'usageDecisionCode',
        type: 'select',
        label: 'Usage decision code',
        placeholder: 'Select Code',
        options: usageDecisionOptions,
        required: true
    },
    {
        name: 'qa32Qnty',
        type: 'text',
        label: 'QA32 QNTY',
        placeholder: 'Enter QNTY',
        required: true,
        inputFormatting: { filter: 'numbers-decimal' }
    },
    {
        name: 'storageLocation',
        type: 'text',
        label: 'Storage Location',
        placeholder: 'Enter Location',
        required: true
    },
    {
        name: 'appearance',
        type: 'select',
        label: 'Appearance',
        placeholder: 'Select Appearance',
        options: appearanceOptions,
        required: true
    },
    {
        name: 'nitrateCompound',
        type: 'select',
        label: 'Nitrate Compound',
        placeholder: 'Select NEG/POS/NT',
        options: specialTestOptions,
        required: true
    },
    {
        name: 'boricAcid',
        type: 'select',
        label: 'Boric Acid',
        placeholder: 'Select NEG/POS',
        options: boricAcidOptions,
        required: true
    },
    {
        name: 'elisaTest',
        type: 'select',
        label: 'ELISA Test',
        placeholder: 'Select APS/NA/NAPS',
        options: elisaOptions,
        required: true
    },
    {
        name: 'remarks',
        type: 'textarea',
        label: 'Remarks',
        placeholder: 'Enter Remarks',
        rows: 1,
        forceNewLine: true,
        required: false
    }
];

