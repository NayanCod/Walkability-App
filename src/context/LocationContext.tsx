"use client";

import React from "react";

interface LocationProviderProps {
  children: React.ReactNode;
}

interface LocationContextProps {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  setLocation: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
  locationError: string;
  setLocationError: React.Dispatch<React.SetStateAction<string>>;
  resetLocation: () => void;
}

const LocationContext = React.createContext<LocationContextProps | null>(null);

export const useLocationContext = () => {
  const state = React.useContext(LocationContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = React.useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationError("");
          setLocation({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred.");
              break;
          }
          console.log(error);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0, // Do not use a cached location
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }

  React.useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, setLocation, locationError, setLocationError, resetLocation: getLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};
