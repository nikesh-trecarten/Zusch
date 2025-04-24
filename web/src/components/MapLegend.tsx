import styles from "./MapLegend.module.css";

export function MapLegend() {
  return (
    <div className={styles.mapLegend}>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-green.png" alt="green marker" />
        <h3>Boxes</h3>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-grey.png" alt="grey marker" />
        <h3>Empty Boxes</h3>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-blue.png" alt="blue marker" />
        <h3>Your Boxes</h3>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-gold.png" alt="gold marker" />
        <h3>Your Empty Boxes</h3>
      </div>
    </div>
  );
}
