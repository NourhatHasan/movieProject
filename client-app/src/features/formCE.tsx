import {  ErrorMessage, Field, Formik, FormikProps } from 'formik';

import { Form, Button, FormField, Label, Segment, TextArea } from 'semantic-ui-react';
import { movieForm, Movies } from '../Models/Movies';


interface props {
    handledeleteSetForm: () => void;
    movie: Movies | undefined;
    addUpdateMovie: (movie: Movies) => void;
    
}
export default function FormCE({ handledeleteSetForm, movie, addUpdateMovie }: props) {

    console.log(movie);

    const initialValues = movie
    
        ?? {
        movieName: '',
        description: '',
        price: '',
        mengde: ''  
    }



  const handleSubmit = (values: any) => {
      // Handle form submission
      addUpdateMovie(values);
  };

  return (
    <Segment style={{ marginTop: '4em' }} clearing>
          <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize

          >
              {({ handleSubmit, isValid, isSubmitting, dirty }) => (

                  <Form onSubmit={handleSubmit} className='ui form' >
                      <FormField style={{ marginBottom: '1em' }}>
                          <Field
                              type="text"
                              component="input"
                              placeholder="movieName"
                              name="movieName"
                              style={{ width: '100%' }}
                          />
                          <ErrorMessage
                              name="movieName"
                              render={(error) => (
                                  <Label basic color="red" content={error} />
                              )}
                          />
                      </FormField>
                      <FormField style={{ marginBottom: '1em' }}>
                          <Field
                              as={TextArea}
                              placeholder="description"
                              name="description"
                              style={{ width: '100%' }}
                          />
                      </FormField>
                      <FormField style={{ marginBottom: '1em' }} >
                          <Field
                              type="number"
                              placeholder="price"
                              name="price"
                              component="input"
                              style={{ width: '100%' }}
                          />
                      </FormField>

                      <FormField style={{ marginBottom: '1em' }}>
                          <Field
                              type="number"
                              placeholder="mengde"
                              name="mengde"
                              style={{ width: '100%' }}
                          />
                      </FormField>

                      <Button.Group widths="2">
                          <Button
                              type="submit"
                              positive
                              floated="right"
                              loading={isSubmitting}
                              disabled={isSubmitting || !dirty || !isValid}
                          >
                              Submit
                          </Button>



                          <Button

                              type="button"
                              color="red"
                              floated="right"
                              onClick={() => handledeleteSetForm()}
                          >
                              Remove
                          </Button>


                      </Button.Group>
                  </Form>
              )}
      </Formik>
    </Segment>
  );
}
