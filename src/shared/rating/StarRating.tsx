import { FC, ReactElement, useEffect, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

import { IStarRatingProps } from 'src/shared/shared.interface';

const StarRating: FC<IStarRatingProps> = ({ value, size, setReviewRating }): ReactElement => {
  const [numberOfStars] = useState<number[]>([...Array(5).keys()].map((index: number) => index + 1));
  const [rating, setRating] = useState<number>(0);

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

  return (
    <div className="flex items-center">
      <div className="relative inline-flex items-center">
        {/* Background stars (outlined) */}
        <div className="flex items-center text-orange-200">
          {numberOfStars.map((index: number) => (
            <FaRegStar 
              key={`outline-${index}`}
              size={size} 
              className="cursor-pointer" 
              style={{ marginRight: index < 5 ? '2px' : '0' }}
              onClick={() => handleClick(index)} 
            />
          ))}
        </div>
        
        {/* Filled stars overlay */}
        <div className="absolute top-0 left-0 flex items-center text-orange-400 overflow-hidden">
          {numberOfStars.map((index: number) => (
            <FaStar 
              key={`filled-${index}`}
              size={size} 
              className={`${index <= rating ? 'opacity-100' : 'opacity-0'}`}
              style={{ marginRight: index < 5 ? '2px' : '0' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarRating;
