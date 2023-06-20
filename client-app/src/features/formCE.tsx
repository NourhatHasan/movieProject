import {  ErrorMessage, Field, Formik } from 'formik';

import { Form, Button, FormField, Label, Segment, TextArea } from 'semantic-ui-react';

import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useStore } from '../layout/Stores/Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Loading from '../layout/loading';
import { Movies } from '../Models/Movies';

interface ErrorMessageComponentProps {
    children: React.ReactNode;
}

export default observer( function FormCE() {

    const { movieStore: { selectedMovie: movie, addMovie, updateMovie, loadMovie, initLoading, resetSelectedMovie } } = useStore();

    console.log(movie);

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

            loadMovie(movieId);


        }
        else {
            resetSelectedMovie();
        }
    }, [id, loadMovie, resetSelectedMovie])


    const initialValues: Movies = initLoading || !id
        ? {
            id: 0,
            movieName: '',
            description: '',
            price: 0,
            mengde: 0,
        }
        : movie || {
            id: 0,
            movieName: '',
            description: '',
            price: 0,
            mengde: 0,
        };



    const handleSubmit = (values: Movies) => {
        console.log(values);
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
        
            addMovie(values).then(() => navigate('/movies'))
        }
  };

    //validation
    const validation = Yup.object({
        movieName: Yup.string().required("movie Name is required").min(6, "min 4 letters"),
        description: Yup.string().required("description is required").max(500, "max 500 letters"),
        price: Yup.string().required("price is required"),
        mengde: Yup.string().required("mengde is required"),
       
    })

    if (initLoading) return <Loading content={"Edit form loading"} />
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
