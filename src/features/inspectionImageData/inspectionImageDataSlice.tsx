import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IApplicationErrorState } from '../applicationError/applicationErrorSlice';
import { IIdentityState } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { getInspectionImageDataAPI } from './inspectionImageDataAPI';

export interface IInspectionImageData {
    pictureFileGUID: string;
    base64Image: string;
}

export interface IInspectionImageDataState {
    value: IInspectionImageData[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null | undefined;
}

const initialState: IInspectionImageDataState = {
    value: [],
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

export const getInspectionImageData = createAsyncThunk(
    'inspectionImageData/get',
    async (pictureFileGUIDList: string, { dispatch, getState }) => {
        const { localApiDetails, identity } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
        };
        const response = await getInspectionImageDataAPI(
            localApiDetails,
            identity.value,
            pictureFileGUIDList,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

// A function that accepts an initial state, an object full of reducer functions,
// and a "slice name", and automatically generates action creators and action types
// that correspond to the reducers and state.
export const inspectionImageDataSlice = createSlice({
    name: 'inspectionImageData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInspectionImageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getInspectionImageData.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = state.value.concat(action.payload);
            })
            .addCase(getInspectionImageData.rejected, (state, action) => {
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

export const {} = inspectionImageDataSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInspectionImageData = (
    state: RootState,
): IInspectionImageData[] => state.inspectionImageData.value;

export default inspectionImageDataSlice.reducer;
