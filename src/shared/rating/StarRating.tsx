import { FC, ReactElement, useEffect, useState } from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

import { IStarRatingProps } from 'src/shared/shared.interface';

const StarRating: FC<IStarRatingProps> = ({ value, size, setReviewRating }): ReactElement => {
  const [numberOfStars] = useState<number[]>([...Array(5).keys()].map((index: number) => index + 1));
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  useEffect(() => {
    if (value) {
      setRating(value);
    }
  }, [value]);

  const handleClick = (index: number): void => {
    if (!value && setReviewRating) {
      setRating(index);
      setReviewRating(index);
    }
  };

  const handleMouseEnter = (index: number): void => {
    if (!value && setReviewRating) {
      setHoveredRating(index);
    }
  };

  const handleMouseLeave = (): void => {
    if (!value && setReviewRating) {
      setHoveredRating(0);
    }
  };

  const getStarType = (starIndex: number): 'empty' | 'half' | 'full' => {
    const currentRating = hoveredRating || rating;
    if (currentRating >= starIndex) {
      return 'full';
    } else if (currentRating >= starIndex - 0.5) {
      return 'half';
    }
    return 'empty';
  };

  const isInteractive = !value && setReviewRating;

  return (
    <div className="flex items-center">
      <div
        className={`flex items-center gap-0.5 ${isInteractive ? 'cursor-pointer' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {numberOfStars.map((index: number) => {
          const starType = getStarType(index);

          return (
            <div
              key={index}
              className={`relative transition-all duration-200 ease-out ${
                isInteractive ? 'hover:scale-110 active:scale-95' : ''
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
            >
              {starType === 'empty' && (
                <FaRegStar
                  size={size}
                  className={`transition-all duration-200 ${
                    isInteractive && hoveredRating >= index
                      ? 'text-accent drop-shadow-sm'
                      : 'text-border-default'
                  }`}
                />
              )}

              {starType === 'half' && (
                <div className="relative">
                  <FaRegStar
                    size={size}
                    className="text-border-default"
                  />
                  <FaStarHalfAlt
                    size={size}
                    className="absolute top-0 left-0 text-accent drop-shadow-sm"
                  />
                </div>
              )}

              {starType === 'full' && (
                <FaStar
                  size={size}
                  className={`transition-all duration-200 ${
                    isInteractive && hoveredRating >= index
                      ? 'text-accent drop-shadow-md transform scale-105'
                      : 'text-accent drop-shadow-sm'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Rating value display for interactive mode */}
      {isInteractive && (hoveredRating > 0 || rating > 0) && (
        <span className="ml-3 text-sm font-themeFont font-semibold text-primary transition-all duration-200">
          {hoveredRating || rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
