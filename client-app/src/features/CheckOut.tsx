/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import { CheckOutForm } from "../Models/checkOut";
import * as Yup from 'yup';
import agent from "../layout/api/agent";

interface ErrorMessageComponentProps {
    children: React.ReactNode;
}

export default observer(function CheckOut() {

    const { shopingStore } = useStore();



    const navigate = useNavigate();



    const ErrorMessageComponent: React.FC<ErrorMessageComponentProps> = ({ children }) => (
        <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">{children}</div>
        </div>
    );


    const initialValues = CheckOutForm.getInitialValues();
    console.log(initialValues);


    const handleSubmit = (values: CheckOutForm) => {
        console.log(values)
        shopingStore.checkOut(values)
    }
    const validation = Yup.object({
        cardholderName: Yup.string().required("cardholderName is required"),
        cardNumber: Yup.string().required("cardNumber is required"),
        expiryMonth: Yup.string().required("expiryMonth is required"),
        expiryYear: Yup.string().required("expiryYear is required"),
        cvv: Yup.string().required("cvv is required"),

    })


    return (
        <div style={{ marginTop: "5em" }} >
            <Formik
                initialValues={initialValues}
                validationSchema={validation}

                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isSubmitting, dirty, isValid }) => (
                    <Form
                        onSubmit={handleSubmit}
                        className='ui form'
                    >

                        <Form.Field>
                            <label>cardholderName</label>
                            <Field type='text' name='cardholderName' placeholder='cardholderName' />
                            <ErrorMessage name="cardholderName" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>


                        <Form.Field>
                            <label>cardNumber</label>
                            <Field type='text' name='cardNumber' placeholder='cardNumber' />
                            <ErrorMessage name="cardNumber" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>

                        <Form.Field>
                            <label>expiryMonth</label>
                            <Field type='text' name='expiryMonth' placeholder='expiryMonth' />
                            <ErrorMessage name="expiryMonth" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>


                        <Form.Field>
                            <label>expiryYear</label>
                            <Field type='text' name='expiryYear' placeholder='expiryYear' />
                            <ErrorMessage name="expiryYear" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>


                        <Form.Field>
                            <label>cvv</label>
                            <Field type='text' name='cvv' placeholder='cvv' />
                            <ErrorMessage name="cvv" component={ErrorMessageComponent as React.ComponentType<any>} />

                        </Form.Field>





                        <Button
                            type='submit'
                            positive
                            fluid
                            loading={isSubmitting}
                            disabled={isSubmitting || !dirty || !isValid}
                        >
                            checkOut
                        </Button>
                    </Form>

                )}
            </Formik>
        </div>
    )
})

