import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import {
    IPackingJob,
    IPackingPart,
    IPackingPartPackaging,
} from '../packingJobListSlice';

const PartList: IPackingPart[] = [
    {
        partCode: '10223.1',
        partDescription: 'BUMPER - GREEN BOT',
        unitWeight: 0.0075,
        weightTolerance: 0.03,
        defaultPackagingCode: '10223.1',
        requiredFinalInspection: true,
        deflashMethod: 'MACHINE',
    },
    {
        partCode: '10363.3',
        partDescription: 'BUMPER - ORANGE BOT',
        unitWeight: 0.00267,
        weightTolerance: 0.03,
        requiredFinalInspection: false,
        defaultPackagingCode: '10363.3',
        deflashMethod: 'MACHINE',
    },
];

export const PartPackaging: IPackingPartPackaging[] = [
    {
        partCode: '',
        packageCode: '',
        packageDescription: '',
        specialInstructions: '',
        standardPack: 0,
    },
];

export const DemoPackingJobs: IPackingJob[] = [
    {
        packingJobNumber: 'PJ_000000035',
        packingOperator: 'EES',
        specialInstructions: 'SOME SPECIAL HANDLIN INSTRUCTIONS',
        pieceWeightQuantity: 20,
        pieceWeight: 0.008,
        pieceWeightTolerance: 0.03,
        pieceWeightValid: false,
        pieceWeightDiscrepancyNote: 'weighed three times',
        deflashOperator: 'DF',
        deflashMachineCode: 'T1',
        completeBoxes: 5,
        partialBoxQuantity: 111,
        shelfInventoryFlag: false,
        rowID: 229,
        part: {
            partCode: '10557',
            partDescription: 'BUMPER - 05-1-A-1 : 2',
            unitWeight: 0.0009,
            weightTolerance: 0,
            defaultPackagingCode: 'B-11.75X11X9',
            requiredFinalInspection: false,
            deflashMethod: 'MACHINE',
        },
        partPackaging: {
            partCode: '10557',
            packageCode: 'B-11.75X11X9',
            packageDescription: 'EXP0121109',
            standardPack: 17000,
            specialInstructions: '',
        },
        objects: [
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844074,
                inspectionStatus: '',
                quantityCompleted: 17000,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 709,
                combines: [],
            },
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844075,
                inspectionStatus: '',
                quantityCompleted: 17000,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 710,
                combines: [],
            },
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844076,
                inspectionStatus: '',
                quantityCompleted: 17000,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 711,
                combines: [],
            },
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844077,
                inspectionStatus: '',
                quantityCompleted: 17000,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 712,
                combines: [],
            },
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844078,
                inspectionStatus: '',
                quantityCompleted: 17000,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 713,
                combines: [],
            },
            {
                packingJobNumber: 'PJ_000000035',
                serial: 1844079,
                inspectionStatus: '',
                quantityCompleted: 111,
                quantityAfterCombine: 0,
                printed: true,
                rowID: 714,
                combines: [],
            },
        ],
        jobDoneFlag: false,
    },
];
