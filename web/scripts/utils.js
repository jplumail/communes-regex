export const dims = { minX: 99047, minY: 6046554.5, maxX: 1242420.4, maxY: 7110497 };
export const maxDimension = Math.max(dims.maxX - dims.minX, dims.maxY - dims.minY);
export const scale = 500 / maxDimension;

export function lambert93ToViewBox(lambert93) {
    return [(lambert93[0] - dims.minX) * scale, ((dims.maxY - lambert93[1])) * scale];
}
