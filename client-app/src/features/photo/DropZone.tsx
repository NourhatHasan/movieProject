import react, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';


interface props {
    setFiles: (files: any) => void;
}

export default function DropZone({ setFiles }: props) {
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        hight: 200
    }
    const dzActive = {
        borderColor: 'green'
    }

    const onDrop = useCallback((acceptedFiles: any[]) => {
        console.log(acceptedFiles)

        setFiles(
            acceptedFiles.map((file: any) => {
                return Object.assign(file, {
                    preview: URL.createObjectURL(file),
                });
            })
        );
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='big' />
            <Header content='Drop image here' />

        </div>
    )
}

