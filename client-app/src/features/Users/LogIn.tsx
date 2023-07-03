import { Formik, Field} from "formik";
import { observer } from "mobx-react-lite";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import { useStore } from "../../layout/Stores/Store";


interface ErrorMessageProps {
    error: string;
}


export default observer(function LogInForm() {


   

    const { userStore } = useStore();
   
    const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
        <Message negative>
            <Icon name="exclamation triangle" />
            <Message.Content>{error}</Message.Content>
        </Message>
    );

    return (
        <div style={{ marginTop: "5em" }}>
            <Formik
                initialValues={{ username: '', password: '', error: null }}
                onSubmit={(values, { setErrors }) => userStore.login(values)
                    .catch(error => {
                        if (error.message === 'Bad request') {
                            setErrors({ error: 'Bad password or username' });
                        }
                    })
                }
            >
                {({ handleSubmit, isSubmitting, errors, dirty, isValid }) => (
                <Form 
                    onSubmit={handleSubmit}
                    >
               
                    <Form.Field>
                        <label>Username</label>
                        <Field type='text' name='username' placeholder='Username' />
                     
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Field type='text' name='password' placeholder='Password' />
                      
                        </Form.Field>

                       
                    {errors.error && <ErrorMessage error={errors.error} />}


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