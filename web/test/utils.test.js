import { dims, scale, lambert93ToViewBox } from '../scripts/utils.js';
import { expect, describe, it } from 'vitest';

describe('utils', () => {
    describe('lambert93ToViewBox', () => {
        it('should correctly convert Lambert93 coordinates to viewBox coordinates', () => {
            const [x, y] = lambert93ToViewBox([dims.minX, dims.maxY]);
            expect(x).toBe(0);
            expect(y).toBe(0);

            const [x2, y2] = lambert93ToViewBox([dims.maxX, dims.maxY]);
            expect(x2).toBe(500);
            expect(y2).toBe(0);


            const testX = dims.minX + (dims.maxX - dims.minX) / 2;
            const testY = dims.minY + (dims.maxY - dims.minY) / 2;
            const [x3, _] = lambert93ToViewBox([testX, testY]);
            expect(x3).toBe(250);
        });


        it('should handle coordinates outside the defined bounds', () => {
            const [x, y] = lambert93ToViewBox([dims.minX - 1000, dims.maxY + 1000]);
            expect(x).toBe(-1000 * scale);
            expect(y).toBe(-1000 * scale);
        });

    });

    describe('dims', () => {
        it('should have correct minX, minY, maxX, maxY values', () => {
            expect(dims.minX).toBe(99047);
            expect(dims.minY).toBe(6046554.5);
            expect(dims.maxX).toBe(1242420.4);
            expect(dims.maxY).toBe(7110497);
        });
    });

    describe('scale', () => {
        it('should be calculated correctly based on maxDimension', () => {
            const calculatedScale = 500 / Math.max(dims.maxX - dims.minX, dims.maxY - dims.minY);
            expect(scale).toBe(calculatedScale);
        });
    });
});
