import { ErrorMessage, Field, Formik } from 'formik';

import {Image, Form, Button, Segment, TextArea, Grid, Header } from 'semantic-ui-react';

import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../layout/loading';
import { Movies } from '../Models/Movies';
import { useStore } from '../layout/Stores/Store';
import DropZone from './photo/DropZone';
import { Photos } from '../Models/photo';
import PhotoCropper from './photo/PhotoCropper';



interface ErrorMessageComponentProps {
    children: React.ReactNode;
}

export default observer(function FormCE() {

    const { movieStore: { selectedMovie: movie, addMovie, updateMovie, loadMovie, loading, resetSelectedMovie } } = useStore();
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();
   

    const { id } = useParams();
    const navigate = useNavigate();


    const ErrorMessageComponent: React.FC<ErrorMessageComponentProps> = ({ children }) => (
        <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">{children}</div>
        </div>
    );

    useEffect(() => {
        if (id) {
            const movieId = parseInt(id, 10);
            console.log(movie);
          
           

        }
        else {
            resetSelectedMovie();
           
        }
        //clean up function 
        return () => {
            files.forEach((file: any) => {
                URL.revokeObjectURL(file.preview);
            });
        };
    }, [id, loadMovie, resetSelectedMovie,files])


    const initialValues: Movies = loading || !id
        ? {
            id: 0,
            movieName: '',
            description: '',
            price: 0,
            mengde: 0,
            photo:null,
        }
        : movie || {
            id: 0,
            movieName: '',
            description: '',
            price: 0,
            mengde: 0,
            photo:null
        };
    const getCroppedImage = (cropperInstance: Cropper): Promise<Blob> => {
        return new Promise((resolve) => {
            cropperInstance.getCroppedCanvas().toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Unable to get cropped image blob.'));
                }
            });
        });
    };


    const oncrop =async () => {
        if (cropper) {
            try {
                const croppedCanvas = cropper.getCroppedCanvas();
                const croppedUrl = croppedCanvas.toDataURL(); // Getting the data URL of the cropped canvas
                const croppedPhoto: Photos = {
                    id: 0,
                    url: croppedUrl,
                };
                setFiles([croppedPhoto]); // Update files state with the cropped photo
            } catch (error) {
                console.error('Error while cropping image:', error);
            }
        }
    }
    const handleSubmit = async (values: Movies) => {
        console.log(values);

        if (files.length > 0) {
            const croppedPhoto = files[0];
            values.photo = croppedPhoto;

            if (values.id) {
                updateMovie(values).then(() => {
                    if (movie) {
                        navigate(`/movies/${movie.id}`);
                    } else {

                        navigate('/movies');
                    }
                });
            }
            else {

                addMovie(values, croppedPhoto).then(() => navigate('/movies/{movie.id}'))
            }
        }
    };

    //validation
    const validation = Yup.object({
        movieName: Yup.string().required("movie Name is required").min(4, "min 4 letters"),
        description: Yup.string().required("description is required").max(500, "max 500 letters"),
        price: Yup.string().required("price is required"),
        mengde: Yup.string().required("mengde is required"),

    })

    if (loading) return <Loading content={"Edit form loading"} />
    return (
        <Segment style={{ marginTop: '4em' }} clearing>
            <Formik
                validationSchema={validation}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize

            >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form onSubmit={handleSubmit} className='ui form'>
                        <label>Movie Photo</label>
                        <Grid columns={3} stackable textAlign='center'>
                            <Grid.Column>
                                <Header sub color='teal' content='Add Photo' />
                                <DropZone setFiles={setFiles} />
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub color='teal' content='Resize Photo' />
                                {files && files.length > 0 && (
                                    <PhotoCropper
                                        setCropper={setCropper}
                                        imagePreview={files[0].preview}
                                    />
                                )}
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub color='teal' content='Upload Photo' />
                                {files && files.length > 0 && (

                                    <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }}></div>

                                )}
                            </Grid.Column>
                        </Grid>

                        <Form.Field>
                            <label>Movie Name</label>
                            <Field type='text' name='movieName' placeholder='Enter movie name' />
                            <ErrorMessage name="movieName" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <Field as={TextArea} name='description' placeholder='Enter movie description' />
                            <ErrorMessage name="description" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>
                        <Form.Field>
                            <label>Price</label>
                            <Field type='number' name='price' placeholder='Enter movie price' />
                            <ErrorMessage name="price" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>
                        <Form.Field>
                            <label>Mengde</label>
                            <Field type='number' name='mengde' placeholder='Enter movie mengde' />
                            <ErrorMessage name="mengde" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>
                        <Button.Group widths='2'>
                            <Button
                                type='submit'
                                positive
                                floated='right'
                                loading={isSubmitting}
                                disabled={isSubmitting || !dirty || !isValid}
                            >
                                Submit
                            </Button>

                            <Button
                                type='button'
                                color='red'
                                floated='right'
                                as={Link}
                                to='/movies'
                            >
                                Remove
                            </Button>
                        </Button.Group>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});





function reject(arg0: Error) {
    throw new Error('Function not implemented.');
}
