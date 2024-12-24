"use client";

import { useEffect, useState } from 'react';
import France from './france';

export default function Home() {
  const filePath = "regions_map.geojson";
  const [franceData, setFranceData] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetch(filePath)
      .then(response => response.json())
      .then(data => setFranceData(data))
      .catch(err => console.error(err));
  }, []);

  if (!franceData) {
    return <div>Loading...</div>;
  }

  // compute minX, minY, maxX, maxY
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  franceData.features.forEach((feature) => {
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
  const offsetX = minX;
  const offsetY = minY;

  function lambert93ToViewBox(lambert93: GeoJSON.Position): GeoJSON.Position {
    return [lambert93[0] - offsetX, lambert93[1] - offsetY];
  }

  return <div style={{ height: '500px', width: '500px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`${minX - offsetX} ${minY - offsetY} ${maxX - offsetX} ${maxY - offsetY}`}
      transform="scale(1, -1)"
    >
      <France franceData={franceData} lambert93ToViewBox={lambert93ToViewBox} />
    </svg>
  </div>;
}
