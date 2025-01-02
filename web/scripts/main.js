import { loadFrance } from './france.js';
import { loadVilles } from './villes.js';
import { dims, scale } from './utils.js';

async function init() {
    const map = document.getElementById('map');
    map.setAttribute('viewBox', `0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`);

    const franceHTML = await loadFrance();
    const villesHTML = await loadVilles();
    map.innerHTML = franceHTML + villesHTML;

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch(e) {
    const value = e.target.value;
    const points = document.querySelectorAll('.pointGroup');

    try {
        const regex = new RegExp(value, 'i');
        points.forEach(point => {
            const name = point.dataset.name;
            if (name && regex.test(name)) {
                point.classList.add('visible');
            } else {
                point.classList.remove('visible');
            }
        });
    } catch (error) {
        // Ignore invalid regex
    }
}

init();
