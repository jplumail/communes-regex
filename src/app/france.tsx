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
                return <Polygon key={index} polygon={feature.geometry} lambert93ToViewBox={lambert93ToViewBox} />;
            } else if (feature.geometry.type === "MultiPolygon") {
                return feature.geometry.coordinates.map((polygon, subIndex) => {
                    return <Polygon key={index + subIndex} polygon={{ type: "Polygon", coordinates: polygon }} lambert93ToViewBox={lambert93ToViewBox} />;
                });
            }
            return null;
        })}
    </>
}


function Polygon({
    polygon,
    lambert93ToViewBox
}: {
    polygon: GeoJSON.Polygon,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    return <polygon points={polygon.coordinates[0].map(coord => {
        const [x, y] = lambert93ToViewBox(coord);
        return `${x},${y}`;
    }).join(' ')} />
}