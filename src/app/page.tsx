"use client";

import { useEffect, useState } from 'react';
import France from './france';
import Ville from './ville';
import styles from './styles.module.css';

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

export default function Home() {
  const [franceData, setFranceData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [communesData, setCommunesData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [filteredCommunes, setFilteredCommunes] = useState<GeoJSON.Feature[]>([]);
  const [inputValue, setInputValue] = useState<string | null>(null);
  
  let regex: RegExp | null = null;
  if (inputValue) {
    try {
      regex = new RegExp(inputValue, 'i');
    } catch (e) {
      if (e instanceof SyntaxError) {
        regex = null;
      } else {
        throw e;
      }
    }
  }

  useEffect(() => {
    fetch("regions_map.geojson")
      .then(response => response.json())
      .then(data => setFranceData(data))
      .catch(err => console.error(err));

    fetch("communes.geojson")
      .then(response => response.json())
      .then(data => setCommunesData(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    async function filterCommunes () {
      if (inputValue && inputValue.length > 1 && communesData && regex) {
        setFilteredCommunes(communesData.features.filter(
          feature => feature.properties && (
            regex.test(feature.properties.NOM)
          )
        ));
      } else {
        setFilteredCommunes([]);
      }
    };

    filterCommunes();
  }, [inputValue]);

  if (!franceData || !communesData) {
    return <div>Loading...</div>;
  }

  const { minX, minY, maxX, maxY } = computeBoundingBox(franceData.features);
  const maxDimension = Math.max(maxX - minX, maxY - minY);
  const scale = 500 / maxDimension;

  function lambert93ToViewBox(
    lambert93: GeoJSON.Position
  ): GeoJSON.Position {
    return [(lambert93[0] - minX) * scale, ((maxY - lambert93[1])) * scale];
  }

  return <div style={{ height: '500px', width: '500px' }}>
    <input
      type="text"
      value={inputValue || ""}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Enter text"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`0 0 ${(maxX - minX)*scale} ${(maxY - minY)*scale}`}
      id={styles.map}
    >
      <France
        franceData={franceData}
        lambert93ToViewBox={lambert93ToViewBox}
      />
      {filteredCommunes.map(feature => {
        return <Ville
          key={feature.properties && feature.properties.ID}
          ville={feature}
          lambert93ToViewBox={lambert93ToViewBox} />
      })};
    </svg>
  </div>;
}
