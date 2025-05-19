import { useState } from "react";

const StarRating = ({
  rating,
  onRatingChange,
  disabled = false,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (index: number, isHalf: boolean) => {
    if (!disabled) {
      onRatingChange(isHalf ? index + 0.5 : index + 1);
    }
  };

  return (
    <div
      className={`flex items-center space-x-1 mb-5 ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = hoverRating !== null ? hoverRating : rating;

        const isFull = filled >= i + 1;
        const isHalf = filled >= i + 0.5 && filled < i + 1;

        return (
          <div key={i} className="relative w-6 h-6">
            <span
              className="absolute w-1/2 h-full left-0 top-0 z-10"
              onMouseEnter={() => !disabled && setHoverRating(i + 0.5)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              onClick={() => handleClick(i, true)}
            />
            <span
              className="absolute w-1/2 h-full right-0 top-0 z-10"
              onMouseEnter={() => !disabled && setHoverRating(i + 1)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              onClick={() => handleClick(i, false)}
            />
            <span className="text-yellow-400 text-2xl">
              {isFull ? "★" : isHalf ? "⭐" : "☆"}
            </span>
          </div>
        );
      })}
      <span className="ml-2 text-sm mt-2 text-gray-700">
        {rating.toFixed(1)} / 5
      </span>
    </div>
  );
};

export default StarRating;
