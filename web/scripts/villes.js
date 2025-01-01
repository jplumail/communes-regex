import { lambert93ToViewBox } from './utils.js';

export async function loadVilles() {
    const response = await fetch('/data/communes.geojson');
    const communesData = await response.json();
    
    return communesData.features.map(feature => {
        if (feature.geometry.type === "Point" && feature.properties) {
            const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
            return `
                <g class="pointGroup" data-name="${feature.properties.NOM}">
                    <circle class="point" cx="${x}" cy="${y}"/>
                    <text class="label" x="${x + 10}" y="${y}">${feature.properties.NOM}</text>
                </g>`;
        }
        return '';
    }).join('');
}
