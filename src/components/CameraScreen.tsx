import { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export const ImagePreview = (props: { dataUri: string }) => {
    return (
        <div>
            <img className="w-100" alt="camera" src={props.dataUri} />
        </div>
    );
};

export function CameraScreen() {
    const [dataUri, setDataUri] = useState('');

    function handleTakePhoto(dataUri: any) {
        console.log('takePhoto');
        console.log(dataUri);
        setDataUri(dataUri);
    }

    return (
        <>
            {dataUri ? (
                <ImagePreview dataUri={dataUri} />
            ) : (
                <Camera
                    isImageMirror={false}
                    onTakePhoto={(dataUri) => {
                        handleTakePhoto(dataUri);
                    }}
                    imageType={'jpg'}
                />
            )}
        </>
    );
}
