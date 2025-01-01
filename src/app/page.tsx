import France from './france';
import { dims, scale } from './utils';
import Villes from './villes';
import Input from './input';
import './globals.css';



export default async function Home() {
  return <div style={{ height: '500px', width: '500px' }}>
    <Input>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox={`0 0 ${(dims.maxX - dims.minX) * scale} ${(dims.maxY - dims.minY) * scale}`}
        id="map"
      >
        <France />
        <Villes/>
      </svg>
    </Input>
  </div>;
}
