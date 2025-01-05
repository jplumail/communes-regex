import { lambert93ToViewBox } from './utils.js';

const createCircle = (x, y) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('point');
    circle.cx.baseVal.value = x;
    circle.cy.baseVal.value = y;
    return circle;
}

const createText = (x, y, textContent) => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.classList.add('label');
    text.setAttribute('x', x + 10);
    text.setAttribute('y', y);
    text.textContent = textContent;
    return text;
}

const createVille = (feature) => {
    const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = `pointGroup-${feature.properties.ID}`;
    g.classList.add('pointGroup');
    g.dataset.name = feature.properties.NOM;

    g.appendChild(createCircle(x, y));
    g.appendChild(createText(x, y, feature.properties.NOM));
    return g;
}

/**
 * @param {GeoJSON.FeatureCollection} communesData 
 */
export async function loadVilles(communesData) {
    const villes_group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    villes_group.id = 'villes';

    communesData.features
    // .filter((_, index) => index < 100)
    .forEach(feature => {
        if (feature.properties && feature.geometry && feature.geometry.type === 'Point') {
            const g = createVille(feature);
            villes_group.appendChild(g);
            g.addEventListener('mouseenter', () => {
                // move the element to the last element of villes_group
                villes_group.appendChild(g);
            });
        }
    })

    return villes_group
}
