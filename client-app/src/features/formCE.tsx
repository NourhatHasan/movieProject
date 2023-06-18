import {  ErrorMessage, Field, Formik } from 'formik';

import { Form, Button, FormField, Label, Segment, TextArea } from 'semantic-ui-react';

import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useStore } from '../layout/Stores/Store';


export default observer( function FormCE() {

    const { movieStore: { selectedMovie: movie, handleDeleteSetForm, addMovie, updateMovie } } = useStore();

    console.log(movie);


    const initialValues = movie
    
        ?? {
        movieName: '',
        description: '',
        price: '',
        mengde: ''  
    }



    const handleSubmit = (values: any) => {
        console.log(values);
        if (values.id) {
            updateMovie(values)
        }
        else {
            addMovie(values);
        }
  };

    //validation
    const validation = Yup.object({
        movieName: Yup.string().required("movie Name is required").min(6, "min 4 letters"),
        description: Yup.string().required("description is required").max(50, "max 50 letters"),
        price: Yup.string().required("price is required"),
        mengde: Yup.string().required("mengde is required"),
       
    })


  return (
    <Segment style={{ marginTop: '4em' }} clearing>
          <Formik
              validationSchema={validation}
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
                          <ErrorMessage
                              name="description"
                              render={(error) => (
                                  <Label basic color="red" content={error} />
                              )}
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
                          <ErrorMessage
                              name="price"
                              render={(error) => (
                                  <Label basic color="red" content={error} />
                              )}
                          />
                      </FormField>

                      <FormField style={{ marginBottom: '1em' }}>
                          <Field
                              type="number"
                              placeholder="mengde"
                              name="mengde"
                              style={{ width: '100%' }}
                          />
                          <ErrorMessage
                              name="mengde"
                              render={(error) => (
                                  <Label basic color="red" content={error} />
                              )}
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
                              onClick={handleDeleteSetForm}
                          >
                              Remove
                          </Button>


                      </Button.Group>
                  </Form>
              )}
      </Formik>
    </Segment>
  );
})
