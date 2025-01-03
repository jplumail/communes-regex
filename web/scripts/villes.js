import { lambert93ToViewBox } from './utils.js';

export async function loadVilles(communesData) {
    const data = JSON.parse(communesData);
    
    return data.features.map(feature => {
        if (feature.properties && feature.geometry && feature.geometry.type === "Point") {
            const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
            return `
                <g id="pointGroup-${feature.properties.ID}" class="pointGroup" data-name="${feature.properties.NOM}">
                    <circle class="point" cx="${x}" cy="${y}"/>
                    <text class="label" x="${x + 10}" y="${y}">${feature.properties.NOM}</text>
                </g>`;
        }
        return '';
    })
    // .filter((_, index) => index < 100) // Pour limiter le nombre de points pendant le développement
    .join('');
}