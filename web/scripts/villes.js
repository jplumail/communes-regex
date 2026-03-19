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

export const createVille = (feature) => {
    const [x, y] = lambert93ToViewBox(feature.geometry.coordinates);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = `pointGroup-${feature.properties.ID}`;
    g.classList.add('pointGroup');

    g.appendChild(createCircle(x, y));
    g.appendChild(createText(x, y, feature.properties.NOM));
    return g;
}

function setHoveredState(villesGroup, pointGroup, hovered) {
    pointGroup.classList.toggle('hovered', hovered);

    if (hovered) {
        // Keep the hovered commune above the others without relying on SVG :hover persistence.
        villesGroup.appendChild(pointGroup);
    }
}

function clearHoveredState(pointGroup) {
    if (pointGroup) {
        pointGroup.classList.remove('hovered');
    }
}

/**
 * @param {GeoJSON.FeatureCollection} communesData 
 */
export async function loadVilles(communesData) {
    const villes_group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    villes_group.id = 'villes';
    let activePointGroup = null;

    communesData.features
    // .filter((_, index) => index < 100)
    .forEach(feature => {
        if (feature.properties && feature.geometry && feature.geometry.type === 'Point') {
            const g = createVille(feature);
            villes_group.appendChild(g);
            g.addEventListener('mouseenter', () => {
                if (activePointGroup && activePointGroup !== g) {
                    clearHoveredState(activePointGroup);
                }
                setHoveredState(villes_group, g, true);
                activePointGroup = g;
            });
            g.addEventListener('mouseleave', () => {
                setHoveredState(villes_group, g, false);
                if (activePointGroup === g) {
                    activePointGroup = null;
                }
            });
        }
    })

    villes_group.addEventListener('mouseleave', () => {
        clearHoveredState(activePointGroup);
        activePointGroup = null;
    });

    return villes_group
}
