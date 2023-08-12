/* eslint-disable react/jsx-no-undef */
import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState} from "react";
import { Header, Segment, Comment, Button } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import * as Yup from 'yup'
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import TextEreaForm from "./TextAreaForm";
import StarRating from "./StarRating";
import { CommentsFormValues } from "../Models/movieComments";







interface props {
    movieId: number;
}



export default observer(function MovieDetailsChat({ movieId }: props) {

    const { commentStore } = useStore();
    const [rating, setRating] = useState < number>(0);

    const [comment, setComment] = useState<CommentsFormValues>(
        new CommentsFormValues());


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

  


   
    const handleSubmit = ((movieComments: any) => {
        console.log(movieComments);
        
        commentStore.addComment(movieComments);

    })

    const validation = Yup.object({
        
        body: Yup.string().required(),
        starRating: Yup.number().required(),

    })

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        change('starRating', newRating);
    };
    const change = (name: string, value: any) => {
       
        setComment({ ...comment, [name]: value })
        console.log(value)
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

                <Header>reviews about this movie</Header>
            </Segment>


            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment =>

                    (

                        <Comment key={comment.id}>
                            <StarRating rating={comment.starRating}
                               />
                            <Comment.Content>
                                <Comment.Avatar src={'/user.jpg'} />
                                <Comment.Author as={Link} to={``}>{comment.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(comment.createdAt, new Date())} ago</div>
                                </Comment.Metadata>
                                <Comment.Text
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >{comment.body}</Comment.Text>

                            </Comment.Content>
                        </Comment>

                    ))}



                </Comment.Group>
                <Formik
                    validationSchema={validation}
                    enableReinitialize
                    initialValues={comment}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values);
                        resetForm();
                        setRating(0);
                    }
                    }>

                    {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form onSubmit={handleSubmit} className="ui form" autoComplete="off">
                            <StarRating
                                rating={rating}
                                onRatingChange={handleRatingChange}
                              
                            />
                            <TextEreaForm name={'body'} placeholder={'Comment'} rows={3} />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting}
                                type="submit"
                                positive
                                floated="right">
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>

            </Segment>
        </>


        
    )
})