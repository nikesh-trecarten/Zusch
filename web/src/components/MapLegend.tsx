import styles from "./MapLegend.module.css";

export function MapLegend() {
  return (
    <div className={styles.mapLegend}>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-green.png" alt="green marker" />
        <h4>Boxes</h4>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-grey.png" alt="grey marker" />
        <h4 className={styles.emptyBoxes}>Empty Boxes</h4>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-blue.png" alt="blue marker" />
        <h4 className={styles.yourBoxes}>Your Boxes</h4>
      </div>
      <div className={styles.mapLegendItem}>
        <img src="marker-icon-gold.png" alt="gold marker" />
        <h4 className={styles.yourEmptyBoxes}>Your Empty Boxes</h4>
      </div>
    </div>
  );
}
