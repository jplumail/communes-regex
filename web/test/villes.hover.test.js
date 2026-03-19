import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadVilles } from '../scripts/villes.js';
import { setupDOM } from './utils.js';
import mainCss from '../styles/main.css?inline';

const mockGeoJson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [100000, 6500000] },
            properties: { ID: '123', NOM: 'Testville' }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [200000, 6600000] },
            properties: { ID: '456', NOM: 'Anotherville' }
        }
    ]
};

function installStyles() {
    const style = document.createElement('style');
    style.textContent = mainCss;
    document.head.appendChild(style);
}

describe('hover commune labels', () => {
    beforeEach(async () => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        installStyles();
        setupDOM();

        const map = document.getElementById('map');
        map.setAttribute('viewBox', '0 0 500 500');
        map.setAttribute('width', '500');
        map.setAttribute('height', '500');

        const villes = await loadVilles(mockGeoJson);
        map.appendChild(villes);
    });

    afterEach(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
    });

    it('shows the commune name while hovering a visible point', () => {
        const pointGroup = document.getElementById('pointGroup-123');
        const label = pointGroup.querySelector('.label');

        pointGroup.classList.add('visible');

        expect(getComputedStyle(label).visibility).toBe('hidden');

        pointGroup.dispatchEvent(new MouseEvent('mouseenter'));

        expect(pointGroup.classList.contains('hovered')).toBe(true);
        expect(getComputedStyle(label).visibility).toBe('visible');

        pointGroup.dispatchEvent(new MouseEvent('mouseleave'));

        expect(pointGroup.classList.contains('hovered')).toBe(false);
        expect(getComputedStyle(label).visibility).toBe('hidden');
    });

    it('keeps only the latest hovered commune active', () => {
        const firstPointGroup = document.getElementById('pointGroup-123');
        const secondPointGroup = document.getElementById('pointGroup-456');

        firstPointGroup.classList.add('visible');
        secondPointGroup.classList.add('visible');

        firstPointGroup.dispatchEvent(new MouseEvent('mouseenter'));

        expect(firstPointGroup.classList.contains('hovered')).toBe(true);
        expect(secondPointGroup.classList.contains('hovered')).toBe(false);

        secondPointGroup.dispatchEvent(new MouseEvent('mouseenter'));

        expect(firstPointGroup.classList.contains('hovered')).toBe(false);
        expect(secondPointGroup.classList.contains('hovered')).toBe(true);
    });

    it('keeps the label hit-testable while it is visible', () => {
        const pointGroup = document.getElementById('pointGroup-123');
        const label = pointGroup.querySelector('.label');

        pointGroup.classList.add('visible');
        pointGroup.classList.add('hovered');

        expect(getComputedStyle(label).visibility).toBe('visible');

        const rect = label.getBoundingClientRect();
        let hitsLabel = false;

        for (let y = rect.top + 2; y < rect.bottom - 2 && !hitsLabel; y += 4) {
            for (let x = rect.left + 2; x < rect.right - 2; x += 4) {
                if (document.elementFromPoint(x, y) === label) {
                    hitsLabel = true;
                    break;
                }
            }
        }

        expect(hitsLabel).toBe(true);
    });
});
