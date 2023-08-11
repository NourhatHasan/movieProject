

import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';


interface props {
    name: string;
    rows: number;
    placeholder: string;
}
export default function TextEreaForm(props: props) {
    const [field, meta] = useField(props.name);
    const value = field.value || '';


    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <textarea  {...field}  {...props} style={{ whiteSpace: 'pre-wrap' }} />
            {meta.touched && meta.error ? <Label basic color='red' content={meta.error} /> : null}
        </Form.Field>
    )
}
