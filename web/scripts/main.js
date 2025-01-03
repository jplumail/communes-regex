import { loadFrance } from './france.js';
import { loadVilles } from './villes.js';
import { dims, scale } from './utils.js';
import { createDropdownList } from './dropdown.js';
import franceData from '/data/regions_map.geojson?raw'
import communesData from '/data/communes.geojson?raw'


export async function init() {
    const map = document.getElementById('map');
    map.setAttribute('viewBox', `0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`);

    const franceHTML = await loadFrance(franceData);
    const villesHTML = await loadVilles(communesData);
    map.innerHTML = franceHTML + villesHTML;

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    const mapPoints = map.querySelectorAll('g');
    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            const parent = point.parentElement;
            parent.appendChild(point);
        });
    });

    createDropdownList();
}

export function handleSearch(e) {
    const value = e.target.value;
    const points = document.querySelectorAll('.pointGroup');

    try {
        if (value.length > 0) {
            const regex = new RegExp(value, 'i');
            points.forEach(point => {
                const name = point.dataset.name;
                if (name && regex.test(name)) {
                    point.classList.add('visible');
                } else {
                    point.classList.remove('visible');
                }
            });
        } else {
            points.forEach(point => {
                point.classList.remove('visible');
            });
        }
    } catch (error) {
        // Ignore invalid regex
    }
}