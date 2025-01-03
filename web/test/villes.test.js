import { loadVilles } from '../scripts/villes.js'
import { expect, describe, it, vi } from 'vitest'
import { lambert93ToViewBox } from '../scripts/utils.js';


const mockGeoJson = {
    type: "FeatureCollection",
    features: [
        { // Valid point feature
            type: "Feature",
            geometry: { type: "Point", coordinates: [100000, 6500000] },
            properties: { ID: "123", NOM: "Testville" }
        },
        { // Feature without properties
            type: "Feature",
            geometry: { type: "Point", coordinates: [200000, 6600000] }
        },
        { // Feature with non-Point geometry
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [[[1, 2], [3, 4]]] },
            properties: { ID: "456", NOM: "Testpolygon" }
        },
        { // Feature with null geometry
            type: "Feature",
            geometry: null,
            properties: { ID: "789", NOM: "Nullville" }
        },

    ]
}



describe('loadVilles', () => {
    it('should generate SVG elements for valid point features', async () => {

        vi.mock('../scripts/utils.js', () => ({
            lambert93ToViewBox: vi.fn().mockReturnValue([10, 20])
        }))
        const svg = await loadVilles(JSON.stringify(mockGeoJson));

        expect(svg).toContain('<g id="pointGroup-123" class="pointGroup" data-name="Testville">');
        expect(svg).toContain('<circle class="point" cx="10" cy="20"/>');
        expect(svg).toContain('<text class="label" x="20" y="20">Testville</text>');
    });

    it('should skip features without properties', async () => {
        const svg = await loadVilles(JSON.stringify(mockGeoJson));
        expect(svg).not.toContain('pointGroup-undefined');
    });


    it('should skip features with non-Point geometry', async () => {
        const svg = await loadVilles(JSON.stringify(mockGeoJson));
        expect(svg).not.toContain('pointGroup-456');
    });

    it('should return an empty string if features is empty', async () => {
        const emptyGeoJson = { ...mockGeoJson, features: [] };
        const svg = await loadVilles(JSON.stringify(emptyGeoJson));
        expect(svg).toBe("");
    });

    it('should handle null geometry', async () => {
        const svg = await loadVilles(JSON.stringify(mockGeoJson));
        expect(svg).not.toContain('pointGroup-789');
    })
});
