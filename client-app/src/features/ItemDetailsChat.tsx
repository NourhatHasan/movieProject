/* eslint-disable react/jsx-no-undef */
import { Formik, Form, Field, FieldProps } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Header, Segment, Comment, Loader } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import * as Yup from 'yup'
import { Link } from "react-router-dom";



interface props {
    movieId: number;
}



export default observer(function MovieDetailsChat({ movieId }: props) {

    const { commentStore } = useStore();

    useEffect(() => {
        if (movieId) {
            commentStore.createhubConnection(movieId);
        }
        else {
             //clean the comments
        return () => {
            commentStore.clearComments();
        }
        }
       

    }, [commentStore, movieId])

    commentStore.comments.forEach(comment => {
        console.log(comment);
    });

    function formatDistanceToNow(createdDate: any): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>


            <Segment attached clearing>
                <Comment.Group>

                    <Formik

                        onSubmit={(values, { resetForm }) =>
                            commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}

                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{ position: 'relative' }} >
                                            <Loader active={isSubmitting} />
                                            <textarea
                                                placeholder='Enter your comment (Enter to Submit and Enter + Shift for new line)'
                                                rows={2}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if (e.key === 'Enter' && e.shiftKey) {
                                                        //new line
                                                        return;
                                                    }
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}

                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                    {commentStore.comments.map(comment =>

                    (

                        <Comment key={comment.id}>
                          
                            <Comment.Content>
                                <Comment.Avatar src={'/pictures/user.png'} />
                                <Comment.Author as={Link} to={``}>{comment.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >{comment.body}</Comment.Text>

                            </Comment.Content>
                        </Comment>

                    ))}



                </Comment.Group>


            </Segment>
        </>


        
    )
})