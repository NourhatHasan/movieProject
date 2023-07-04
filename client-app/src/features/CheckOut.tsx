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
        <div style={{ marginTop: "5em" }}>
            <Formik
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isSubmitting, dirty, isValid }) => (
                    <Form onSubmit={handleSubmit} className="ui form">
                        <Form.Field>
                            <label>Cardholder Name</label>
                            <Field type="text" name="cardholderName" placeholder="Cardholder Name" />
                            <ErrorMessage name="cardholderName" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>

                        <Form.Field>
                            <label>Card Number</label>
                            <Field type="text" name="cardNumber" placeholder="Card Number" />
                            <ErrorMessage name="cardNumber" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>

                        <Form.Field>
                            <label>Expiration Date</label>
                       
                        <div className="expiration-date-container">
                          
                            <div className="expiration-date-fields">
                                <div className="field">
                                    <Field as="select" name="expiryMonth" placeholder="Expiration Month">
                                        <option value="" disabled>Month</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        
                                    </Field>
                                </div>
                                <div className="field">
                                    <Field as="select" name="expiryYear" placeholder="Expiration Year">
                                        <option value="" disabled>Year</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                       
                                    </Field>
                                </div>
                            </div>
                            <div className="error-message">
                                <ErrorMessage name="expiryMonth" component={ErrorMessageComponent as React.ComponentType<any>} />
                                <ErrorMessage name="expiryYear" component={ErrorMessageComponent as React.ComponentType<any>} />
                            </div>
                        </div>
                        </Form.Field>


                        <Form.Field>
                            <label>CVV</label>
                            <Field type="text" name="cvv" placeholder="CVV" />
                            <ErrorMessage name="cvv" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>

                        <Button
                            type="submit"
                            positive
                            fluid
                            loading={isSubmitting}
                            disabled={isSubmitting || !dirty || !isValid}
                        >
                            Check Out
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
})

