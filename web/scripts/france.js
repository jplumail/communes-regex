import { lambert93ToViewBox } from './utils.js';
import franceData from '/data/regions_map.geojson?raw'

export async function loadFrance() {
    const data = JSON.parse(franceData);
    
    return data.features.map((feature, index) => {
        if (feature.geometry.type === "Polygon") {
            return createPolygon(feature.geometry, index);
        } else if (feature.geometry.type === "MultiPolygon") {
            return feature.geometry.coordinates.map((polygon, subIndex) => {
                return createPolygon({ type: "Polygon", coordinates: polygon }, `${index}-${subIndex}`);
            }).join('');
        }
        return '';
    }).join('');
}

function createPolygon(polygon, key) {
    const points = polygon.coordinates[0].map(coord => {
        const [x, y] = lambert93ToViewBox(coord);
        return `${x},${y}`;
    }).join(' ');
    
    return `<polygon points="${points}"/>`;
}
