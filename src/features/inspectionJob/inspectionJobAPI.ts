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
import { IInspectionJob } from './inspectionJobSlice';

export interface IImageUploadData {
    serial?: number;
    imageData: string;
}

export interface IImageUploadedAPI {
    rowId: number;
    labelPath: string;
}

export function getInspectionJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/InspectionJob?inspectionJobNumber=${inspectionJob.inspectionJobNumber}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        if (!inspectionJob.inspectionJobNumber) return inspectionJob;
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IInspectionJob>(queryString, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function openInspectionJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJobNumber: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/OpenInspectionJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            packingJobNumber: packingJobNumber,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function finalizeInspectionJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/FinalizeInspectionJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function setHeaderInspectionStatus(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    inspectionStatus: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/SetHeaderInspectionStatus`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            inspectionStatus: inspectionStatus,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function setObjectInspectionStatus(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    serial: number,
    inspectionStatus: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/SetObjectInspectionStatus`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            serial: serial,
            inspectionStatus: inspectionStatus,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({
                        data: {
                            ...response.data,
                            currentObjectSerial:
                                inspectionStatus === 'SCANNED'
                                    ? serial
                                    : inspectionJob.currentObjectSerial,
                        },
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function addBulletinAPI(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    base64Image: string | null,
    note: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/AddBulletin`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            partCode: inspectionJob.part.partCode,
            base64Image: base64Image,
            note: note,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<void>(queryString, jsonBody, headers)
                .then(async () => {
                    const response = await getInspectionJob(
                        localApi,
                        identity,
                        inspectionJob!,
                        dispatch,
                        setError,
                    );

                    return resolve(response);
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function editBulletinAPI(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    newNote: string,
    bulletinID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/EditBulletin`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            part: inspectionJob.part.partCode,
            newNote: newNote,
            bulletinID: bulletinID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<void>(queryString, jsonBody, headers)
                .then(async () => {
                    const response = await getInspectionJob(
                        localApi,
                        identity,
                        inspectionJob!,
                        dispatch,
                        setError,
                    );

                    return resolve(response);
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function removeBulletinAPI(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    pictureFileName: string | undefined,
    bulletinID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/removeBulletin`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            partCode: inspectionJob.part.partCode,
            pictureFileName: pictureFileName,
            bulletinID: bulletinID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<void>(queryString, jsonBody, headers)
                .then(async () => {
                    const response = await getInspectionJob(
                        localApi,
                        identity,
                        inspectionJob!,
                        dispatch,
                        setError,
                    );

                    return resolve(response);
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function addHeaderNote(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    note: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/AddHeaderNote`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            note: note,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function removeHeaderNote(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    noteID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/RemoveHeaderNote`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            noteID: noteID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function addObjectNote(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    serial: number,
    note: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/AddObjectNote`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        console.log(note);
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            serial: serial,
            note: note,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function removeObjectNote(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    serial: number,
    noteID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/RemoveObjectNote`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            serial: serial,
            noteID: noteID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function addHeaderPicture(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    picture: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/AddHeaderPicture`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            partCode: inspectionJob.part.partCode,
            base64Image: picture,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function removeHeaderPicture(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    pictureID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/RemoveHeaderPicture`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            pictureFileName: inspectionJob.pictures.find(
                (p) => p.pictureID === pictureID,
            )!.pictureFileName,
            pictureID: pictureID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function addObjectPicture(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    serial: number,
    picture: string,
    note: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/AddObjectPicture`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            partCode: inspectionJob.part.partCode,
            serial: serial,
            base64Image: picture,
            note: note,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function removeObjectPicture(
    localApi: ILocalApiState,
    identity: IIdentity,
    inspectionJob: IInspectionJob,
    serial: number,
    pictureID: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/FinalInspection/RemoveObjectPicture`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    return new Promise<{ data: IInspectionJob }>((resolve) => {
        const jsonBody = {
            inspectionJobNumber: inspectionJob.inspectionJobNumber,
            serial: serial,
            pictureFileName: inspectionJob.objects
                .find((o) => o.serial === serial)!
                .pictures.find((p) => p.pictureID === pictureID)!
                .pictureFileName,
            pictureID: pictureID,
        };
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IInspectionJob>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve({ data: response.data });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}
