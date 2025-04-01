import "./App.css";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not defined in .env");
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 50.732791,
    lng: 7.090617,
  };

  return (
    <>
      <h1>Zusch!</h1>
      <div className="map">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={16}
          ></GoogleMap>
        </LoadScript>
      </div>
    </>
  );
}

export default App;
