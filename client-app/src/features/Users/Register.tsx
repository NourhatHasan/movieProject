import { Formik, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Form } from "semantic-ui-react";
import { useStore } from "../../layout/Stores/Store";
import * as Yup from 'yup';

interface ErrorMessageComponentProps {
    children: React.ReactNode;
}


export default observer(function RegisterForm() {

    const { userStore } = useStore();



    const ErrorMessageComponent: React.FC<ErrorMessageComponentProps> = ({ children }) => (
        <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">{children}</div>
        </div>
    );

    const validation = Yup.object({
        username: Yup.string().required("username is required").min(4, "min 4 letters"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Minimum 8 letters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            ),
    });
    return (
        <div style={{ marginTop: "5em" }}>
            <Formik
                validationSchema={validation}
                initialValues={{ username: '', password: '', error: null }}
                onSubmit={(values) => userStore.register(values)
                    
                }
            >
                {({ handleSubmit, isSubmitting, dirty, isValid }) => (
                    <Form
                        onSubmit={handleSubmit}
                    >
                        <Form.Field>
                            <label>Username</label>
                            <Field type='text' name='username' placeholder='Username' />
                            <ErrorMessage name="username" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <Field type='text' name='password' placeholder='Password' />
                            <ErrorMessage name="password" component={ErrorMessageComponent as React.ComponentType<any>} />
                        </Form.Field>


                       

                        <Button
                            type='submit'
                            positive
                            fluid
                            loading={isSubmitting}
                          disabled={isSubmitting || !dirty || !isValid}
                        >
                            Log in
                        </Button>
                    </Form>

                )}
            </Formik>
        </div>
    )
})