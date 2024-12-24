import Point from "./point";

export default function Ville({
    ville, lambert93ToViewBox
}: {
    ville: GeoJSON.Feature, lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    if (ville.geometry.type == "Point") {
        return <Point point={ville.geometry} lambert93ToViewBox={lambert93ToViewBox}/>;
    }
}