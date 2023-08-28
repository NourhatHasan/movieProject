import react from 'react'
import 'cropperjs/dist/cropper.css'
import { Cropper } from 'react-cropper'


interface props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

export default function PhotoCropper({ imagePreview, setCropper }: props) {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            //square Image
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}


        />
    )
}