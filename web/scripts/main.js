import { loadFrance } from './france.js';
import { loadVilles } from './villes.js';
import { dims, scale } from './utils.js';
import { createDropdownList } from './search.js';
import franceData from '../data/regions_map.json';
import communesData from '../data/communes.json';

export async function init() {
    const map = setupMap()

    await loadMapData().then(([villes, france]) => {
        map.appendChild(france);
        map.appendChild(villes);
    });
}

function setupMap() {
    const map = document.getElementById('map');
    map.setAttribute('viewBox', `0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`);
    return map;
}

async function loadMapData() {
    const promFrance = loadFrance(franceData);
    const promVilles = loadVilles(communesData).then(villes => {
        createDropdownList(villes.childNodes);
        return villes;
    });

    return Promise.all([promVilles, promFrance]);
}
