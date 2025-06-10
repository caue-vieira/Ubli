import React, { useState } from "react";

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  setRating,
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className={`text-3xl transition-colors duration-150 ${
              starValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
