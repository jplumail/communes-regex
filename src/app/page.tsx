"use client";

import { useEffect, useState } from 'react';
import France from './france';
import Ville from './ville';
import styles from './styles.module.css';
import computeBoundingBox from './utils';


export default function Home() {
  const [franceData, setFranceData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [communesData, setCommunesData] = useState<GeoJSON.FeatureCollection | null>(null);
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
  } else {
    regex = null;
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

  function isVilleFiltered(ville: GeoJSON.Feature): boolean {
    if (!inputValue || ville.properties == null) {
      return false;
    }
    if (regex == null) {
      return true;
    }
    return regex.test(ville.properties.NOM)
  }

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
      {communesData.features.map(feature => {
        return <Ville
          key={feature.properties && feature.properties.ID}
          ville={feature}
          lambert93ToViewBox={lambert93ToViewBox}
          visible={isVilleFiltered(feature)} />
      })};
    </svg>
  </div>;
}
