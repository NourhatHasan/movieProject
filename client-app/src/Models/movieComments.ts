

export interface MovieComments {
    id: number;
    starRating: number;
    body: string;
    username: string;
    createdAt: Date;
}


export class CommentsFormValues {
    id?: string = "";
    body: string = "";
    starRating: number = 0;

    constructor(comment?: CommentsFormValues) {
        if (comment) {
            this.body = comment.body;
            this.starRating = comment.starRating;
            this.id = comment.id;
            
        }

    }




}


