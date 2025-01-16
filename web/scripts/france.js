import { lambert93ToViewBox } from './utils.js';

/**
 * @param {GeoJSON.FeatureCollection} franceData 
 */
export async function loadFrance(franceData) {    
    const svgFranceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgFranceGroup.id = 'france';
    franceData.features.forEach((feature, _) => {
        if (feature.geometry.type === "Polygon") {
            svgFranceGroup.appendChild(createPolygon(feature.geometry));
        } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon, _) => {
                svgFranceGroup.appendChild(createPolygon({ type: "Polygon", coordinates: polygon }));
            });
        }
    });
    return svgFranceGroup;
}

/**
 * @param {GeoJSON.Position[][]} polygon a list of list of coordinates
 */
function createPolygon(polygon) {
    const points = polygon.coordinates[0].map(coord => {
        const [x, y] = lambert93ToViewBox(coord);
        return `${x},${y}`;
    }).join(' ');
    
    const polygonNode = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    polygonNode.setAttribute('points', points);
    return polygonNode;
}
