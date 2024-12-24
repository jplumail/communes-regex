export default function France({
    franceData,
    lambert93ToViewBox
}: {
    franceData: GeoJSON.FeatureCollection,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    return <>
        {franceData.features.map((feature, index) => {
            if (feature.geometry.type === "Polygon") {
                return <polygon key={index} points={feature.geometry.coordinates[0].map(coord => {
                    const [x, y] = lambert93ToViewBox(coord);
                    return `${x},${y}`;
                }).join(' ')} />
            } else if (feature.geometry.type === "MultiPolygon") {
                return feature.geometry.coordinates.map((polygon, subIndex) => {
                    return <polygon key={`${index}-${subIndex}`} points={polygon[0].map((coord) => {
                        const [x, y] = lambert93ToViewBox(coord);
                        return `${x},${y}`;
                    }).join(' ')} />
                });
            }
            return null;
        })}
    </>
}