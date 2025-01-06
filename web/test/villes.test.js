import { loadVilles } from '../scripts/villes.js'
import { expect, describe, it, vi } from 'vitest'


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
    it('should generate SVG elements for valid point features', () => {

        vi.mock('../scripts/utils.js', () => ({
            lambert93ToViewBox: vi.fn().mockReturnValue([10, 20])
        }))
        return loadVilles(mockGeoJson).then(svg => {

            expect(svg.innerHTML).toContain('<g id="pointGroup-123" class="pointGroup">');
            expect(svg.innerHTML).toContain('<circle class="point" cx="10" cy="20"></circle>');
            expect(svg.innerHTML).toContain('<text class="label" x="20" y="20">Testville</text>');
        })
    });

    it('should append element to end of group on mouseenter', () => {
        return loadVilles(mockGeoJson).then(svg => {
            const pointGroup = svg.querySelector('#pointGroup-123');
            const spy = vi.spyOn(svg, 'appendChild');
            pointGroup.dispatchEvent(new MouseEvent('mouseenter'));
            expect(spy).toHaveBeenCalledWith(pointGroup);
        })
    })

    it('should skip features without properties', () => {
        return loadVilles(mockGeoJson).then(svg => {
            expect(svg.innerHTML).not.toContain('pointGroup-undefined');
        })
    });


    it('should skip features with non-Point geometry', () => {
        return loadVilles(mockGeoJson).then(svg => {
            expect(svg.innerHTML).not.toContain('pointGroup-456');
        })
    });

    it('should return an empty string if features is empty', () => {
        const emptyGeoJson = { ...mockGeoJson, features: [] };
        return loadVilles(emptyGeoJson).then(svg => expect(svg.children.length).toBe(0));
    });

    it('should handle null geometry', () => {
        return loadVilles(mockGeoJson).then(svg => {
            expect(svg.innerHTML).not.toContain('pointGroup-789');
        })
    })
});
