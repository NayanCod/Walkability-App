import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FilterBadgeProps {
  onSelectRating: (rating: number) => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ onSelectRating }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleFilterClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (rating: number) => {
    setSelectedRating(rating);
    onSelectRating(rating);
    setShowOptions(false);
  };

  return (
    <div className="absolute w-full top-4 z-20 mx-3 flex items-center gap-4">
      <button className="bg-white border border-gray-800 shadow-lg text-gray-800 cursor-pointer flex items-center gap-1 py-1.5 px-3 rounded-full" onClick={handleFilterClick}>
        <Star className='w-5 h-5' fill='#cccc00' stroke='#cccc00' />
        <p className='text-gray-800 font-semibold'>{selectedRating !== null ? `Rating: ${selectedRating}` : 'Rating: All'}</p>
      </button>

      {showOptions && (
        <div className="absolute mt-52 bg-white shadow-lg py-2 rounded-lg">
          <div
            className="cursor-pointer w-full px-6 py-1 hover:bg-gray-200 rounded-lg"
            onClick={() => handleOptionClick(null)} 
          >
            All
          </div>

          {[1, 2, 3, 4, 5].map((rating) => (
            <div
              key={rating}
              className="cursor-pointer w-full px-6 py-1 hover:bg-gray-200 rounded-lg"
              onClick={() => handleOptionClick(rating)}
            >
              {rating} Star
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBadge;
