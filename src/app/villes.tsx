import { lambert93ToViewBox } from './utils';
import { promises as fs } from 'node:fs';


export default async function Villes() {
    const communesData = JSON.parse(await fs.readFile(process.cwd() + '/public/communes_small.geojson', 'utf8')) as GeoJSON.FeatureCollection;
    return communesData.features.map(feature => {
        return <Ville
            key={feature.properties && feature.properties.ID}
            ville={feature}
        />
    });
}

function Ville({ ville }: { ville: GeoJSON.Feature }) {
    if (ville.geometry.type == "Point" && ville.properties) {
        return <Point name={ville.properties.NOM} point={ville.geometry} />;
    }
}

function Point({
    point,
    name
}: {
    point: GeoJSON.Point,
    name: string
}) {
    const [x, y] = lambert93ToViewBox(point.coordinates);
    return <g
        className="pointGroup"
    >
        <circle className="point" cx={x} cy={y} />
        <text className="label" x={x + 10} y={y}>{name}</text>
    </g>;
}