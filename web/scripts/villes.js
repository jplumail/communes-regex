import { lambert93ToViewBox } from './utils.js';

/**
 * @param {GeoJSON.FeatureCollection} communesData 
 */
export async function loadVilles(communesData) {
    const villes_group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    villes_group.id = 'villes';

    communesData.features
    .filter((_, index) => index < 100) // Pour limiter le nombre de points pendant le développement
    .forEach(feature => {
        if (feature.properties && feature.geometry && feature.geometry.type === 'Point') {
            const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = `pointGroup-${feature.properties.ID}`;
            g.classList.add('pointGroup');
            g.dataset.name = feature.properties.NOM;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.classList.add('point');
            circle.cx.baseVal.value = x;
            circle.cy.baseVal.value = y;
            g.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('label');
            text.setAttribute('x', x + 10);
            text.setAttribute('y', y);
            text.textContent = feature.properties.NOM;
            g.appendChild(text);

            g.addEventListener('mouseenter', () => {
                villes_group.appendChild(g);
            });

            villes_group.appendChild(g);
        }
    })

    return villes_group
}
