import Point from "./point";

export default function Ville({
    ville, lambert93ToViewBox
}: {
    ville: GeoJSON.Feature, lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    if (ville.geometry.type == "Point" && ville.properties) {
        return <Point name={ville.properties.NOM} point={ville.geometry} lambert93ToViewBox={lambert93ToViewBox}/>;
    }
}