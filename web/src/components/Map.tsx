import { MapContainer, Popup, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";

const API_HOST = import.meta.env.VITE_API_HOST;

interface Box {
  box_id: number;
  latitude: number;
  longitude: number;
}

export function Map() {
  const [boxes, setBoxes] = useState<Box[]>([]);
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
    </MapContainer>
  );
}
