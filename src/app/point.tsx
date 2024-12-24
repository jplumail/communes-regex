import styles from './styles.module.css';

export default function Point({
    point,
    lambert93ToViewBox
}: {
    point: GeoJSON.Point,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    const [x, y] = lambert93ToViewBox(point.coordinates);
    return <circle className={styles.point} cx={x} cy={y} />;
}