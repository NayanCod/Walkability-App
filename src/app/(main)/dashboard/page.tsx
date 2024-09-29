'use client'
import React, { useEffect, useState } from 'react'
// import Map from './_components/map'
import DashboardNavbar from './_components/DashboardNavbar'
import dynamic from 'next/dynamic';
import FilterBadge from './_components/filterBadge';
import { useLocationContext } from '@/context/LocationContext';
import { fetchAllReviews } from '@/lib/actions/review.action';
import { ReviewType } from '@/types/review.type';
import { ChevronUp, ChevronDown } from "lucide-react";
const Map = dynamic(async () => 
  (await import('./_components/map')).default,{ssr: false}
)
const Dashboard = () => {
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const {location, resetLocation} = useLocationContext();
 

  useEffect(() => {
    resetLocation();
    const fetchStreets = async () => {
      try {
        // const res = await fetch('/api/reviews');
        // const data = await res.json();
        const result =  await fetchAllReviews();

        if (result.reviews) {
          console.log(result.reviews);
          setAllReviews(result.reviews);
          // setFilteredStreets(data.streets);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching streets:", error);
      }
    };

    fetchStreets();
  }, []);

  // Sample data for streets
  const streets = [
    { id: 1, name: 'MG Road', coordinates: '12.9716,77.5946', avgRating: 2.5 },
    { id: 2, name: 'Brigade Road', coordinates: '12.9746,77.6056', avgRating: 4.2 },
    { id: 3, name: 'Church Street', coordinates: '12.9736,77.6096', avgRating: 4.8 },
    { id: 4, name: 'Commercial Street', coordinates: '12.9780,77.6095', avgRating: 3.7 },
    { id: 5, name: 'Residency Road', coordinates: '12.9714,77.6098', avgRating: 3.1 },
    { id: 6, name: 'Richmond Road', coordinates: '12.9665,77.6010', avgRating: 1.7 },
    { id: 7, name: 'St. Marks Road', coordinates: '12.9731,77.5995', avgRating: 2.8 },
    { id: 8, name: 'Infantry Road', coordinates: '12.9821,77.6025', avgRating: 4.3 },
    { id: 9, name: 'Cunningham Road', coordinates: '12.9880,77.5905', avgRating: 1.6 },
    { id: 10, name: 'Koramangala 1st Block', coordinates: '12.9356,77.6240', avgRating: 1.9 },
    { id: 11, name: 'Koramangala 4th Block', coordinates: '12.9372,77.6211', avgRating: 4.1 },
    { id: 12, name: 'Indiranagar 100 Feet Road', coordinates: '12.9718,77.6409', avgRating: 3.9 },
    { id: 13, name: 'Ulsoor Road', coordinates: '12.9797,77.6215', avgRating: 2.6 },
    { id: 14, name: 'Vittal Mallya Road', coordinates: '12.9617,77.5964', avgRating: 4.7 },
    { id: 15, name: 'Bannerghatta Road', coordinates: '12.8911,77.6000', avgRating: 3.3 },
  ];

  const [filteredStreets, setFilteredStreets] = useState(streets);

  const handleRatingFilter = (selectedRating: number) => {
    let filtered;
    switch (selectedRating) {
      case 1:
        filtered = streets.filter(street => street.avgRating >= 1 && street.avgRating < 2);
        break;
      case 2:
        filtered = streets.filter(street => street.avgRating >= 2 && street.avgRating < 3);
        break;
      case 3:
        filtered = streets.filter(street => street.avgRating >= 3 && street.avgRating < 4);
        break;
      case 4:
        filtered = streets.filter(street => street.avgRating >= 4 && street.avgRating < 4.5);
        break;
      case 5:
        filtered = streets.filter(street => street.avgRating >= 4.5 && street.avgRating <= 5);
        break;
      default:
        filtered = streets; 
    }
    setFilteredStreets(filtered);
  };
  
  return (
    <div className='h-screen flex flex-col'>
      <DashboardNavbar/>
      <div className='flex-grow overflow-hidden relative mt-[3.8rem]'>
          <FilterBadge onSelectRating={handleRatingFilter} />
          <Map streets={[]} reviews={allReviews} center={
            location
            ? [location?.latitude, location?.longitude]
            : undefined
                  }/>
            <LegendButton/>
      </div>
    </div>
  )
}

const LegendButton = () => {
  const [showLegend, setShowLegend] = useState(false);
  return (
    <div className="forced-abs absolute bottom-20 right-14 z-999">
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="bg-gray-500 text-white p-2 rounded-full opacity-80"
      >
        {showLegend ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>
      {showLegend && (
        <div className="forced-abs absolute bottom-12 right-0 bg-white p-4 rounded-lg shadow-lg z-50 w-64 min-w-[16rem]">
          <div className="flex items-center space-x-2">
            <img src="/sad.png" alt="Sad" className="w-6 h-6" />
            <span>Rating: 1 - 1.99</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/littleSad.png" alt="Little Sad" className="w-6 h-6" />
            <span>Rating: 2 - 2.99</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/littleHappy.png"
              alt="Little Happy"
              className="w-6 h-6"
            />
            <span>Rating: 3 - 3.99</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/veryHappy.png" alt="Very Happy" className="w-6 h-6" />
            <span>Rating: 4 - 5</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard