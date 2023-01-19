import identityReducer from '../features/identity/identitySlice';
import applicationErrorReducer from '../features/applicationError/applicationErrorSlice';
import localApiDetailsReducer from '../features/localApi/localApiSlice';
import machineReducer from '../features/machine/machineSlice';
import partReducer from '../features/part/partSlice';
import inspectionJobReducer from '../features/inspectionJob/inspectionJobSlice';
import barcodeScannerReducer from '../features/barcodeScanner/barcodeScannerSlice';
import packingJobListReducer from '../features/packingJobList/packingJobListSlice';
import inspectionImageDataReducer from '../features/inspectionImageData/inspectionImageDataSlice';

import {
    Action,
    combineReducers,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';

const reducers = combineReducers({
    identity: identityReducer,
    applicationError: applicationErrorReducer,
    localApiDetails: localApiDetailsReducer,
    machineList: machineReducer,
    partList: partReducer,
    inspectionJob: inspectionJobReducer,
    scannerData: barcodeScannerReducer,
    packingJobList: packingJobListReducer,
    inspectionImageData: inspectionImageDataReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    blacklist: [
        'identity',
        'applicationError',
        'localApiDetails',
        'scannerData',
        'inspectionImageData',
        // 'inspectionJob',
    ],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
