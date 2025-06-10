import React from "react";
import { PlaceReview } from "./maps/GoMap"; // Importe o tipo do seu arquivo principal

interface ReviewCarouselProps {
  reviews: PlaceReview[];
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, index) => (
      <span
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        &#9733;
      </span>
    ))}
  </div>
);

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma avaliação ainda. Seja o primeiro!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto p-1">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-800">{review.author}</h4>
            <StarRatingDisplay rating={review.rating} />
          </div>
          <p className="text-gray-600 text-sm mb-2">"{review.comment}"</p>
          <p className="text-xs text-gray-400 text-right">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewCarousel;
