import { lambert93ToViewBox } from './utils.js';
import communesData from '/data/communes.geojson?raw'

export async function loadVilles() {
    const data = JSON.parse(communesData);
    
    return data.features.map(feature => {
        if (feature.geometry.type === "Point" && feature.properties) {
            const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
            return `
                <g class="pointGroup" data-name="${feature.properties.NOM}">
                    <circle class="point" cx="${x}" cy="${y}"/>
                    <text class="label" x="${x + 10}" y="${y}">${feature.properties.NOM}</text>
                </g>`;
        }
        return '';
    })
    // .filter((_, index) => index < 100) // Pour limiter le nombre de points pendant le développement
    .join('');
}
