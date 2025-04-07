import {
  MapContainer,
  Popup,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_HOST = import.meta.env.VITE_API_HOST;

interface Box {
  box_id: number;
  latitude: number;
  longitude: number;
}

export function Map() {
  const { user } = useUser();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [userBoxMarkers, setUserBoxMarkers] = useState<
    { lat: number; lng: number }[]
  >([]);

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const response = await axios.get(`${API_HOST}/boxes`);
        setBoxes(response.data);
      } catch (error) {
        console.error("There was a problem fetching the boxes");
      }
    }
    fetchBoxes();
  }, []);

  function AddUserBoxesOnClick() {
    useMapEvents({
      click(e) {
        if (!user) {
          console.error("User is not authenticated");
          alert("Please log in to add a box.");
          return;
        }

        const { lat, lng } = e.latlng;
        setUserBoxMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);

        const newBox = {
          location: `SRID=4326;POINT(${lng} ${lat})`,
        };

        axios
          .post(`${API_HOST}/boxes`, newBox, {
            headers: {
              Authorization: user.id,
            },
          })
          .then(() => {
            axios.get(`${API_HOST}/boxes`).then((response) => {
              setBoxes(response.data);
            });
          })
          .catch((error) => {
            console.error("There was a problem adding the new box:", error);
          });
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[50.73288, 7.090452]}
      zoom={16}
      style={{ height: "400px", width: "100%" }} // height must always be defined
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {boxes.map((box) => (
        <Marker key={box.box_id} position={[box.latitude, box.longitude]}>
          <Popup>List of checkable items</Popup>
        </Marker>
      ))}
      {userBoxMarkers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>User Marker</Popup>
        </Marker>
      ))}
      <AddUserBoxesOnClick />
    </MapContainer>
  );
}
