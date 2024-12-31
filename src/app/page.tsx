"use client";

import { useEffect, useState } from 'react';
import France from './france';
import styles from './styles.module.css';
import computeBoundingBox from './utils';
import Villes from './villes';


export default function Home() {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [franceData, setFranceData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [communesData, setCommunesData] = useState<GeoJSON.FeatureCollection | null>(null);

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
      viewBox={`0 0 ${(maxX - minX) * scale} ${(maxY - minY) * scale}`}
      id={styles.map}
    >
      <France
        franceData={franceData}
        lambert93ToViewBox={lambert93ToViewBox}
      />
      <Villes inputValue={inputValue} communesData={communesData} lambert93ToViewBox={lambert93ToViewBox} />
    </svg>
  </div>;
}
