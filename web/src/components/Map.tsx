import { MapContainer, Popup, TileLayer, Marker } from "react-leaflet";

export function Map() {
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
      <Marker position={[50.73288, 7.090452]}>
        <Popup>Taktsoft!</Popup>
      </Marker>
    </MapContainer>
  );
}
