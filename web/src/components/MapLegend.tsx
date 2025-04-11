import "./MapLegend.css";

export function MapLegend() {
  return (
    <div className="map-legend">
      <div className="map-legend-item">
        <img src="marker-icon-green.png" alt="green marker" />
        <h3>Boxes</h3>
      </div>
      <div className="map-legend-item">
        <img src="marker-icon-grey.png" alt="grey marker" />
        <h3>Empty Boxes</h3>
      </div>
      <div className="map-legend-item">
        <img src="marker-icon-blue.png" alt="blue marker" />
        <h3>Your Boxes</h3>
      </div>
      <div className="map-legend-item">
        <img src="marker-icon-gold.png" alt="gold marker" />
        <h3>Your Empty Boxes</h3>
      </div>
    </div>
  );
}
