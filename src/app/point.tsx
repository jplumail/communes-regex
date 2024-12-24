import styles from './styles.module.css';

export default function Point({
    point,
    name,
    visible,
    lambert93ToViewBox
}: {
    point: GeoJSON.Point,
    name: string,
    visible: boolean,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    const [x, y] = lambert93ToViewBox(point.coordinates);
    return <g className={`${styles.pointGroup} ${visible ? styles.visible : ''}`}>
        <circle className={styles.point} cx={x} cy={y} />
        <text className={styles.label} x={x + 5} y={y}>{name}</text>
    </g>;
}