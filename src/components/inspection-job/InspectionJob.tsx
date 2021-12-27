import React, { useEffect, useRef, useState } from 'react';
import { IInspectionJob } from '../../features/inspectionJob/inspectionJobSlice';

export function InspectionJob(props: { inspectionJob: IInspectionJob }) {
    const [scanData, setScanData] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    function handleKeyDown(event: React.KeyboardEvent) {
        let currentScanData = '';
        if (scanTimerRef.current) {
            clearTimeout(scanTimerRef.current);
            currentScanData = scanData;
        }
        scanTimerRef.current = setTimeout(() => {
            setScanData('');
        }, 1000);

        setScanData(currentScanData + event.code + ',');
    }

    const mainRef = useRef<HTMLDivElement>(null);
    const scanTimerRef = useRef<NodeJS.Timeout>();

    //  Set focus to the container in order to capture keyboard events.
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.focus();
        }
    }, [mainRef]);

    return (
        <>
            <div
                onKeyDown={(event: React.KeyboardEvent) => {
                    handleKeyDown(event);
                }}
                tabIndex={0}
                ref={mainRef}
            >
                <p>15 jobs awaiting final inspection</p>
                <p>Scan any label to begin final the final inspection</p>
                <p>{scanData}</p>
            </div>
        </>
    );
}
