import React from 'react';
import { useAppSelector } from '../../app/hooks';
import {
    IInspectionJob,
    selectInspectionJob,
} from '../../features/inspectionJob/inspectionJobSlice';
import { selectPackingJobList } from '../../features/packingJobList/packingJobListSlice';
import { InspectionJobQueue } from './1-inspection-job-queue/InspectionJobQueue';
import { BeginJobSummary } from './2-begin-job-summary/BeginJobSummary';
import { LotQuantitySummary } from './4-lot-quantity-summary/LotQuantitySummary';

export function InspectionJobSummary(props: {
    inspectionJob?: IInspectionJob;
}) {
    const packingJobList = useAppSelector(selectPackingJobList);
    const inspectionJob = useAppSelector(selectInspectionJob);

    return (
        <>
            <div tabIndex={0}>
                <InspectionJobQueue
                    packingJobList={packingJobList}
                    inspectionJob={inspectionJob}
                />

                {inspectionJob && inspectionJob.inspectionJobNumber && (
                    <>
                        <BeginJobSummary inspectionJob={inspectionJob} />
                        <LotQuantitySummary inspectionJob={inspectionJob} />
                    </>
                )}
            </div>
        </>
    );
}
