import { lambert93ToViewBox } from "./utils";
import {promises as fs} from 'node:fs';


export default async function France() {
    const franceData = JSON.parse(await fs.readFile(process.cwd() + '/public/regions_map.geojson', 'utf8')) as GeoJSON.FeatureCollection; // Use the cached function
    return <>
        {franceData.features.map((feature, index) => {
            if (feature.geometry.type === "Polygon") {
                return <Polygon key={index} polygon={feature.geometry} />;
            } else if (feature.geometry.type === "MultiPolygon") {
                return feature.geometry.coordinates.map((polygon, subIndex) => {
                    return <Polygon key={index + subIndex} polygon={{ type: "Polygon", coordinates: polygon }} />;
                });
            }
            return null;
        })}
    </>
}


function Polygon({ polygon }: { polygon: GeoJSON.Polygon }) {
    return <polygon points={polygon.coordinates[0].map(coord => {
        const [x, y] = lambert93ToViewBox(coord);
        return `${x},${y}`;
    }).join(' ')} />
}