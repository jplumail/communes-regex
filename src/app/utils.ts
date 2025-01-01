function computeBoundingBox(
  features: GeoJSON.Feature[]
): { minX: number, minY: number, maxX: number, maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  features.forEach((feature) => {
    if (feature.geometry.type === "Polygon") {
      feature.geometry.coordinates[0].forEach((coord) => {
        minX = Math.min(minX, coord[0]);
        minY = Math.min(minY, coord[1]);
        maxX = Math.max(maxX, coord[0]);
        maxY = Math.max(maxY, coord[1]);
      });
    } else if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach((polygon) => {
        polygon[0].forEach((coord) => {
          minX = Math.min(minX, coord[0]);
          minY = Math.min(minY, coord[1]);
          maxX = Math.max(maxX, coord[0]);
          maxY = Math.max(maxY, coord[1]);
        });
      });
    }
  });
  return { minX, minY, maxX, maxY };
}

export const dims = { minX: 99047, minY: 6046554.5, maxX: 1242420.4, maxY: 7110497 };
export const maxDimension = Math.max(dims.maxX - dims.minX, dims.maxY - dims.minY);
export const scale = 500 / maxDimension;

export function lambert93ToViewBox(lambert93: GeoJSON.Position) {
  return [(lambert93[0] - dims.minX) * scale, ((dims.maxY - lambert93[1])) * scale];
};