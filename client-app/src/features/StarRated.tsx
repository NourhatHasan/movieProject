
import StarRatings from 'react-star-ratings';
interface StarRatingProps {
    rating: number;

}

const StarRated: React.FC<StarRatingProps> = ({ rating}) => {
    return (
        <div className="selected-stars">
            <StarRatings
                rating={rating}
                starRatedColor="orange"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                starHoverColor="orange" // Setting the hover color to the same as selected color
                starEmptyColor="grey" // Setting the empty star color
            />
        </div>
    );
};


export default StarRated;