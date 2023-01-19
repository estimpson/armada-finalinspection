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
import { IMachine } from '../machine/machineSlice';
import { IPart } from '../part/partSlice';
import { DemoPackingJobs } from './demo/demoPackingJobs';
import { IPackingJob } from './packingJobListSlice';

export function retrievePackingJobs(
    localApi: ILocalApiState,
    identity: IIdentity,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/CompletedPackingJobs`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };

    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPackingJob[]>(queryString, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data,
                    });
                })
                .catch((ex) => {
                    console.log('error here');
                    handleAxiosException(ex, dispatch, setError);
                });
        }

        // fallback to demo data
        return resolve({
            data: DemoPackingJobs,
        });
    });
}
