import { loadFrance } from './france.js';
import { loadVilles } from './villes.js';
import { dims, scale } from './utils.js';
import { createDropdownList } from './search.js';
import franceData from '/data/regions_map.geojson?raw';
import communesData from '/data/communes.geojson?raw';

export async function init() {
    const map = setupMap()

    await loadMapData().then(([villes, france]) => {
        map.appendChild(france);
        map.appendChild(villes);
    });

    detectFirefox();
}

function setupMap() {
    const map = document.getElementById('map');
    map.setAttribute('viewBox', `0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`);
    return map;
}

async function loadMapData() {
    const promFrance = loadFrance(JSON.parse(franceData));
    const promVilles = loadVilles(JSON.parse(communesData)).then(villes => {
        createDropdownList(villes.childNodes);
        return villes;
    });

    return Promise.all([promVilles, promFrance]);
}

function detectFirefox() {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        alert("Attention : ce site pourrait ne pas fonctionner correctement sur Firefox. Testé sur Chrome et Safari.");
    }
}