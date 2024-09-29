import axios from "axios";

export async function fetchStreetDetails({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  //   console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_API);

  //   const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_API}`;

  //   fetch(geocodeUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.status === "OK" && data.results.length > 0) {
  //         const street = data.results[0].formatted_address; // Get the formatted address
  //         console.log("Street name: ", street);
  //       } else {
  //         console.log("No street found for the given coordinates.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Geocoding error: ", error);
  //     });
  const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(geocodeUrl);
    if (response.status === 200) {
      const street_details = await response.data;
    //   const street_details = data; // Get the full address
      return street_details;
    } else {
      throw new Error("No street found for the given coordinates.");
    }
  } catch (error) {
    console.log("Geocoding error: ", error);
  }
}
