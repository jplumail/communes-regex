import { loadFrance } from './france.js';
import { loadVilles } from './villes.js';
import { dims, scale } from './utils.js';
import { createDropdownList } from './search.js';
import franceData from '/data/regions_map.geojson?raw'
import communesData from '/data/communes.geojson?raw'


export async function init() {
    const map = document.getElementById('map');
    map.setAttribute('viewBox', `0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`);

    const villes = await loadVilles(JSON.parse(communesData));
    map.appendChild(await loadFrance(JSON.parse(franceData)));
    map.appendChild(villes);

    createDropdownList(villes.childNodes);
}
