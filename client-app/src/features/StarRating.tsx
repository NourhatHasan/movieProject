
import StarRatings from 'react-star-ratings';



interface StarRatingProps {
    rating: number;
    onRatingChange?: (newRating: number) => void ;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
    if (onRatingChange) {
     return (
        <div className="selected-stars">
            <StarRatings
                rating={rating}
                starRatedColor="orange"
                
                changeRating={newRating => {
                    onRatingChange(newRating);
                }
                }
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                starHoverColor="orange" // Setting the hover color to the same as selected color
                starEmptyColor="grey" // Setting the empty star color
            />
        </div>
        );
    } else {
        // Render static display of star rating
        return (
            <div className="selected-stars">
                <StarRatings
                    rating={rating}
                    starRatedColor="orange"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    starHoverColor="orange"
                    starEmptyColor="grey"
                />
            </div>
        );
    }
};

export default StarRating;

