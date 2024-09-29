"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents, ZoomControl,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../globals.css";
import { useLocationContext } from "@/context/LocationContext";
import { toast } from "sonner";
// import { useState } from "react";
import { useEffect, useState } from "react";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icon } from "leaflet";
import { StreetType } from "@/types/street.type";
import { LocateFixed, ChevronUp, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReviewType } from "@/types/review.type";

interface Street {
  id: number;
  name: string;
  coordinates?: string;
  avgRating?: number;
  bounds?: number[];
}

interface MapProps {
  reviews?: ReviewType[];
  streets: Street[];
  street?: StreetType;
  center?: [number, number];
  zoom?: number;
  height?: string;
  setLocation?: React.Dispatch<React.SetStateAction<any>>;
}

const Map: React.FC<MapProps> = ({
  reviews,
  streets,
  street,
  center,
  height,
  setLocation,
  zoom,
}) => {
  // const center = ;
  const { location } = useLocationContext();

  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempStreets, setTempStreets] = useState([]);

  const pathname = usePathname();

  const handleMarkerClick = (review: ReviewType) => {
    setSelectedReview(review);
    setIsDrawerOpen(true);
  };

  function CenterAndZoomMap() {
    const map = useMap();
    const newCenter = center || [12.9716, 77.5946];
    
    map.setView({ lat: newCenter[0], lng: newCenter[1] }, zoom || 22);
    // const newCenter = center || [location && location?.latitude, location && location?.longitude];
    // map.setView({ lat: newCenter[0] ?? 12.9716, lng: newCenter[1] ?? 77.5946 }, zoom || 13);
    map.attributionControl.remove();
    return null;
  }

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (setLocation) {
          console.log(e.latlng);

          // setLocation(e.latlng);
          setLocation({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          });
        }
      },
    });
    return location ? (
      <Marker position={{ lat: location.latitude, lng: location.longitude }} />
    ) : null;
  };

  // const locationIcon = new Icon({
  //   iconUrl: "/marker.png",
  //   iconSize: [38, 38],
  // });

  const ratingIcons = {
    sad: new Icon({
      iconUrl: "/sad.png",
      iconSize: [38, 38],
    }),
    littleSad: new Icon({
      iconUrl: "/littleSad.png",
      iconSize: [38, 38],
    }),
    littleHappy: new Icon({
      iconUrl: "/littleHappy.png",
      iconSize: [38, 38],
    }),
    veryHappy: new Icon({
      iconUrl: "/veryHappy.png",
      iconSize: [38, 38],
    }),
  };

  // Function to get the appropriate icon based on rating
  const getIconBasedOnRating = (rating: number) => {
    if (rating < 2) return ratingIcons.sad;
    else if (rating >= 2 && rating < 3) return ratingIcons.littleSad;
    else if (rating >= 3 && rating < 4) return ratingIcons.littleHappy;
    else return ratingIcons.veryHappy;
  };

  // My location component
  const MyLocationButton = () => {
    // resetLocation();
    const map = useMap();

    const handleFindMyLocation = () => {
      if (location) {
        map.flyTo([location.latitude, location.longitude], 13);
      } else {
        toast.error("Location permission is required.");
      }
    };
    return (
      <div className="z-999">
        <button
          onClick={handleFindMyLocation}
          className="forced-abs absolute bottom-36 right-2 z-999 bg-blue-500 text-white p-2 rounded-full"
          title="show your location"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (street && center) {
      const radius = 0.001;
      const bbox = `${center[0] - radius},${center[1] - radius},${
        center[0] + radius
      },${center[1] + radius}`; // Example bounding box
      const query = `
      [out:json];
      (
      way["highway"](${bbox});
      );
      out geom;
      `;

      fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          const streets = data.elements.map(
            (element: {
              id: any;
              type: any;
              tags: { name: any; highway: any };
              geometry: any[];
            }) => {
              return {
                id: element.id,
                type: element.type, // Way (Street)
                name: element.tags?.name || "Unknown street",
                highway: element.tags?.highway || "Unknown type",
                coordinates: element.geometry.map((point) => [
                  point.lat,
                  point.lon,
                ]), // Array of lat/lon points
              };
            }
          );
          setTempStreets(streets);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [street]);

  return (
    <>
      {/* <div className="relative"> */}
      <MapContainer
        style={{
          height: height || "100vh",
          width: "100%",
          zIndex: 1,
          position: "relative",
        }}
        zoomControl={false}
      >
        {/* to mark the streets */}

        {tempStreets.map((street: any) => (
          <Polyline
            key={street.id}
            positions={street.coordinates}
            pathOptions={{ color: "lightblue" }}
          />
        ))}

        <CenterAndZoomMap />
        {/* This is street map */}
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}

        {/* This is satellite map */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, USGS, NOAA'
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri'
        />
        {setLocation && <LocationMarker />}
        {reviews?.map(
          (review) =>
            review?.rating && (
              <Marker
                key={review.id}
                position={
                  [review.latitude, review.longitude]
                }
                eventHandlers={{
                  click: () => handleMarkerClick(review),
                }}
                icon={getIconBasedOnRating(review?.rating)}
              >
                <Popup>
                  <div>{review.street?.displayName}</div>
                  <div>Walkability: {review.rating} / 5</div>
                </Popup>
              </Marker>
            )
        )}
        {location?.latitude && location?.longitude && (
          <Marker
            position={
              [location.latitude, location.longitude] as [number, number]
            }
            // icon={locationIcon}
          >
            <Popup>
              <div>You are here</div>
            </Popup>
          </Marker>
        )}
        {center && (
          <Marker
            position={
              center as [number, number]
            }
            // icon={locationIcon}
          >
            <Popup>
              <div>You are here</div>
            </Popup>
          </Marker>
        )}

        <ZoomControl position="bottomright" />
        {pathname === "/dashboard" && (
          <>
            <MyLocationButton />
            {/* <LegendButton /> */}
          </>
        )}
      </MapContainer>
      {/* </div> */}

      {isDrawerOpen ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="z-50">
            <DrawerHeader>
              <DrawerTitle>Street Details</DrawerTitle>
              <DrawerDescription>
                Information about the selected street.
              </DrawerDescription>
            </DrawerHeader>

            {selectedReview ? (
              <div className="p-4">
                <p>Name: {selectedReview.street?.displayName}</p>
                <p>Walkability: {selectedReview.rating} / 5</p>
                {selectedReview.photoUrl &&
                  <>
                  <p>Street images</p>
                  <img src={selectedReview.photoUrl} className="w-30 h-20" alt="street images"/>
                  </>
                }
              </div>
            ) : (
              <div className="p-4">No street selected</div>
            )}

            <DrawerFooter>
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
};

export default Map;
