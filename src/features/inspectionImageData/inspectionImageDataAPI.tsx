import {
    ActionCreatorWithPayload,
    AnyAction,
    ThunkDispatch,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { IApplicationErrorState } from '../applicationError/applicationErrorSlice';
import { handleAxiosException } from '../handleAxiosException';
import { IIdentity } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IInspectionImageData } from './inspectionImageDataSlice';

export function getInspectionImageDataAPI(
    localApi: ILocalApiState,
    identity: IIdentity,
    pictureFileGUIDList: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/InspectionImageData?pictureFileGUIDList=${pictureFileGUIDList}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionImageData[] }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IInspectionImageData[]>(queryString, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}
