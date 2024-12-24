export default function Point({
    point,
    lambert93ToViewBox
}: {
    point: GeoJSON.Point,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    const [x, y] = lambert93ToViewBox(point.coordinates);
    const radius = 3 * 1000; // 10 km
    return <circle cx={x} cy={y} r={radius} fill="red" />;
}