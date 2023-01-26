import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IApplicationErrorState } from '../applicationError/applicationErrorSlice';
import { IIdentityState } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import {
    addHeaderNote,
    getInspectionJob,
    openInspectionJob,
    removeHeaderNote,
    addObjectNote,
    removeObjectNote,
    addHeaderPicture,
    removeHeaderPicture,
    addObjectPicture,
    removeObjectPicture,
    setHeaderInspectionStatus,
    setObjectInspectionStatus,
    addBulletinAPI,
    editBulletinAPI,
    removeBulletinAPI,
    finalizeInspectionJob,
} from './inspectionJobAPI';

export interface IInspectionPart {
    partCode: string;
    partDescription: string;
    unitWeight: number;
    weightTolerance: number;
    defaultPackagingCode: string;
    requiredFinalInspection: boolean;
    deflashMethod: string;
}

export interface IInspectionPartPackaging {
    partCode: string;
    packageCode: string;
    packageDescription: string;
    standardPack: number;
    specialInstructions: string;
}

export interface IInspectionBulletin {
    partCode: string;
    pictureFileGUID: string | undefined;
    pictureFileName: string | undefined;
    note: string | undefined;
    createdByOperator: string;
    createDT: string;
    bulletinID: number;
}

export interface IInspectionHeaderNote {
    inspectionJobNumber: string;
    note: string;
    createdByOperator: string;
    createDT: string;
    noteID: number;
}

export interface IInspectionHeaderPicture {
    inspectionJobNumber: string;
    pictureFileGUID: string;
    pictureFileName: string;
    note: string;
    createdByOperator: string;
    createDT: string;
    pictureID: number;
}

export interface IInspectionObjectNote {
    inspectionJobNumber: string;
    serial: number;
    note: string;
    createdByOperator: string;
    createDT: string;
    noteID: number;
}

export interface IInspectionObjectPicture {
    inspectionJobNumber: string;
    serial: number;
    pictureFileGUID: string;
    pictureFileName: string;
    note: string;
    createdByOperator: string;
    createDT: string;
    pictureID: number;
}

export interface IInspectionObjectCombine {
    packingJobNumber: string;
    fromSerial: number;
    fromOriginalQuantity: number;
    fromNewQuantity: number;
    fromReprint: boolean;
    inspectionStatus: string;
    toSerial: number;
    toOriginalQuantity: number;
    toNewQuantity: number;
    rowID: number;
    notes: IInspectionObjectNote[];
    pictures: IInspectionObjectPicture[];
    combines: IInspectionObjectCombine[];
}

export interface IInspectionObject {
    inspectionJobNumber: string;
    serial: number;
    inspectionStatus: string;
    quantityCompleted: number;
    quantityAfterCombine: number;
    printed: boolean;
    rowID: number;
    notes: IInspectionObjectNote[];
    pictures: IInspectionObjectPicture[];
    combines: IInspectionObjectCombine[];
}

export interface IInspectionJob {
    inspectionJobNumber: string;
    inspectionOperator: string;
    inspectionStatus: string;
    packingJobNumber: string;
    packingOperator: string;
    specialInstructions: string;
    pieceWeightQuantity: number;
    pieceWeight: number;
    pieceWeightTolerance: number;
    pieceWeightValid: boolean;
    pieceWeightDiscrepancyNote: string;
    deflashOperator: string;
    deflashMachineCode: string;
    completeBoxes: number;
    partialBoxQuantity: number;
    shelfInventoryFlag: boolean;
    jobDoneFlag: boolean;
    rowID: number;
    packingDT: string;
    part: IInspectionPart;
    partPackaging: IInspectionPartPackaging;
    notes: IInspectionHeaderNote[];
    pictures: IInspectionHeaderPicture[];
    objects: IInspectionObject[];
    bulletins: IInspectionBulletin[];
    priorLots: IInspectionJob[];
    currentObjectSerial?: number;
}

export interface IInspectionJobState {
    value?: IInspectionJob;
    status: 'idle' | 'loading' | 'failed';
    error: string | null | undefined;
}

const initialState: IInspectionJobState = {
    value: undefined,
    status: 'idle',
    error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const SetError = createAction<IApplicationErrorState>(
    'applicationError/applicationErrorOccurred',
);

export const getInspectionJobAsync = createAsyncThunk(
    'inspectionJob/getInspectionJob',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await getInspectionJob(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const openInspectionJobAsync = createAsyncThunk(
    'inspectionJob/openInspectionJob',
    async (packingJobNumber: string, { dispatch, getState }) => {
        const { localApiDetails, identity } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
        };
        const response = await openInspectionJob(
            localApiDetails,
            identity.value,
            packingJobNumber,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const finalizeInspectionJobAsync = createAsyncThunk(
    'inspectionJob/finalize',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await finalizeInspectionJob(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const setHeaderStatusAsync = createAsyncThunk(
    'inspectionJob/setHeaderStatus',
    async (status: string, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await setHeaderInspectionStatus(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            status,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const setObjectStatusAsync = createAsyncThunk(
    'inspectionJob/setObjectStatus',
    async (
        input: { serial: number; status: string },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await setObjectInspectionStatus(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.serial,
            input.status,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const addBulletin = createAsyncThunk(
    'inspectionJob/addBulletin',
    async (
        input: { image64Data: string | null; note: string },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await addBulletinAPI(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.image64Data,
            input.note,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const editBulletin = createAsyncThunk(
    'inspectionJob/editBulletin',
    async (
        input: { newNote: string; bulletinID: number },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await editBulletinAPI(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.newNote,
            input.bulletinID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const removeBulletin = createAsyncThunk(
    'inspectionJob/removeBulletin',
    async (
        input: { pictureFileName: string | undefined; bulletinID: number },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await removeBulletinAPI(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.pictureFileName,
            input.bulletinID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const addHeaderNoteAsync = createAsyncThunk(
    'inspectionJob/addHeaderNote',
    async (note: string, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await addHeaderNote(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            note,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const removeHeaderNoteAsync = createAsyncThunk(
    'inspectionJob/removeHeaderNote',
    async (noteID: number, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await removeHeaderNote(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            noteID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const addObjectNoteAsync = createAsyncThunk(
    'inspectionJob/addObjectNote',
    async (input: { serial: number; note: string }, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await addObjectNote(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.serial,
            input.note,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const removeObjectNoteAsync = createAsyncThunk(
    'inspectionJob/removeObjectNote',
    async (
        input: { serial: number; noteID: number },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await removeObjectNote(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.serial,
            input.noteID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const addHeaderPictureAsync = createAsyncThunk(
    'inspectionJob/addHeaderPicture',
    async (picture: string, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await addHeaderPicture(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            picture,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const removeHeaderPictureAsync = createAsyncThunk(
    'inspectionJob/removeHeaderPicture',
    async (pictureID: number, { dispatch, getState }) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await removeHeaderPicture(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            pictureID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const addObjectPictureAsync = createAsyncThunk(
    'inspectionJob/addObjectPicture',
    async (
        input: { serial: number; picture: string; note: string },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await addObjectPicture(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.serial,
            input.picture,
            input.note,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const removeObjectPictureAsync = createAsyncThunk(
    'inspectionJob/removeObjectPicture',
    async (
        input: { serial: number; pictureID: number },
        { dispatch, getState },
    ) => {
        const { localApiDetails, identity, inspectionJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            inspectionJob: IInspectionJobState;
        };
        const response = await removeObjectPicture(
            localApiDetails,
            identity.value,
            inspectionJob.value!,
            input.serial,
            input.pictureID,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

// A function that accepts an initial state, an object full of reducer functions,
// and a "slice name", and automatically generates action creators and action types
// that correspond to the reducers and state.
export const inspectionJobSlice = createSlice({
    name: 'inspectionJob',
    initialState,
    reducers: {
        newJob: (state) => {
            state.value = initialState.value;
            state.status = initialState.status;
        },
        //todo: error checking
        //can't edit job with inventory
        //can't delete box after combine
        //todo: notification on async tasks
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(getInspectionJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getInspectionJobAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(getInspectionJobAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(openInspectionJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(openInspectionJobAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(openInspectionJobAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(finalizeInspectionJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(finalizeInspectionJobAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(finalizeInspectionJobAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(setHeaderStatusAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setHeaderStatusAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(setHeaderStatusAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(setObjectStatusAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setObjectStatusAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial:
                        action.payload.currentObjectSerial ||
                        state.value?.currentObjectSerial,
                };
            })
            .addCase(setObjectStatusAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(addBulletin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addBulletin.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial:
                        action.payload.currentObjectSerial ||
                        state.value?.currentObjectSerial,
                };
            })
            .addCase(addBulletin.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(editBulletin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editBulletin.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial:
                        action.payload.currentObjectSerial ||
                        state.value?.currentObjectSerial,
                };
            })
            .addCase(editBulletin.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(removeBulletin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeBulletin.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial:
                        action.payload.currentObjectSerial ||
                        state.value?.currentObjectSerial,
                };
            })
            .addCase(removeBulletin.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(addHeaderNoteAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addHeaderNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(addHeaderNoteAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(removeHeaderNoteAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeHeaderNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(removeHeaderNoteAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(addObjectNoteAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addObjectNoteAsync.fulfilled, (state, action) => {
                console.log(
                    action.payload.objects.find(
                        (o) => o.serial === state.value?.currentObjectSerial,
                    )?.notes,
                );
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(addObjectNoteAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(removeObjectNoteAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeObjectNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(removeObjectNoteAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(addHeaderPictureAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addHeaderPictureAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(addHeaderPictureAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(removeHeaderPictureAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeHeaderPictureAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(removeHeaderPictureAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(addObjectPictureAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addObjectPictureAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(addObjectPictureAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            })

            .addCase(removeObjectPictureAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeObjectPictureAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...action.payload,
                    currentObjectSerial: state.value?.currentObjectSerial,
                };
            })
            .addCase(removeObjectPictureAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            });
    },
});

export const { newJob } = inspectionJobSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInspectionJob = (
    state: RootState,
): IInspectionJob | undefined => state.inspectionJob.value;

export default inspectionJobSlice.reducer;
