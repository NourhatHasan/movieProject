import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Header, Button } from 'semantic-ui-react';
import DropZone from './DropZone'; // Import your DropZone component
import {Cropper } from 'react-cropper';

interface AddPhotoPageProps {
    loading: boolean;
    loadPhotos: (file: any) => void;
}

const AddPhotoPage: React.FC<AddPhotoPageProps> = ({ loading, loadPhotos }) => {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper | undefined>();

    function oncrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => loadPhotos(blob));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => {
                URL.revokeObjectURL(file.preview);
            });
        };
    }, [files]);

    return (
        <Grid>
            {/* ... rest of the columns ... */}
            <Grid.Column width={4}>
                <Header style={{ color: 'teal' }} content="step3-uploadphoto" />
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }}></div>
                        <Button.Group widths={2}>
                            <Button icon='check' loading={loading} onClick={oncrop} color='green' />
                            <Button icon='close' disabled={loading} onClick={() => setFiles([])} color='red' />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
};

export default observer(AddPhotoPage);
