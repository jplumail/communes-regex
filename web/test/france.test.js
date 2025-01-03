import { loadFrance } from '../scripts/france.js';
import { expect, describe, it, vi } from 'vitest';
import { lambert93ToViewBox } from '../scripts/utils.js';

const mockGeoJson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[[100000, 6500000], [200000, 6600000], [300000, 6700000]]]
            },
            properties: {}
        },
        {
            type: "Feature",
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    [[[400000, 6800000], [500000, 6900000], [600000, 7000000]]],
                    [[[700000, 7100000], [800000, 7200000], [900000, 7300000]]]
                ]
            },
            properties: {}
        },
         { // Invalid geometry type
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 2] },
            properties: { }
        }
    ]
};

vi.mock('../scripts/utils.js', () => ({
    lambert93ToViewBox: vi.fn().mockReturnValue([10, 20])
}))

describe('loadFrance', () => {

    it('should generate SVG polygons for Polygon features', async () => {
        const svg = await loadFrance(JSON.stringify(mockGeoJson));
        expect(svg).toContain('<polygon points="10,20 10,20 10,20"/>');

    });

    it('should generate SVG polygons for MultiPolygon features', async () => {
        const svg = await loadFrance(JSON.stringify(mockGeoJson));

        expect(svg).toContain('<polygon points="10,20 10,20 10,20"/>');
        expect(svg).toContain('<polygon points="10,20 10,20 10,20"/>');


    });


    it('should handle empty GeoJSON features', async () => {
        const emptyGeoJson = { type: "FeatureCollection", features: [] };
        const svg = await loadFrance(JSON.stringify(emptyGeoJson));
        expect(svg).toBe("");
    });

    it('should ignore invalid geometry types', async () => {
        const svg = await loadFrance(JSON.stringify(mockGeoJson));
        // Check that no polygon is generated based on Point data from mockGeoJson
        expect(svg.match(/<polygon/g)?.length).toBe(3);
    });
});

