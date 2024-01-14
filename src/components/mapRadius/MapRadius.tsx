import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
// import L from 'leaflet'
import 'leaflet/dist/leaflet.css';

interface MapRadiusProps {
  selectedPoint: number[];
  setSelectedPoint: any;
  radius: number;
  setRadius: any;
  centroMexico: any;
}

const MapRadius: React.FC<MapRadiusProps> = ({ selectedPoint, setSelectedPoint, radius, setRadius, centroMexico }) => {
  // const centroMexico = [23.6345, -102.5528];
  // const [selectedPoint, setSelectedPoint] = useState(centroMexico);
  // const [radius, setRadius] = useState(50000);
  const mapRef = useRef<MapContainer | null>(null);

  const handleMapClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPoint([e.latlng.lat, e.latlng.lng]);
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(event.target.value);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.addEventListener('click', handleMapClick);
    }
    return () => {
      if (map) {
        map.removeEventListener('click', handleMapClick);
      }
    };
  }, [handleMapClick]);

  return (
    <div>
      <MapContainer center={centroMexico} zoom={6} style={{ height: '500px', width: '100%' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={selectedPoint}>
          <Popup>
            Punto seleccionado: <br /> {`${selectedPoint[0]}, ${selectedPoint[1]}`}
          </Popup>
        </Marker>
        <Circle center={selectedPoint} radius={radius} />
      </MapContainer>
      <div>
      <label htmlFor="radiusInput">Radio (metros): </label>
      <input
        type="number"
        id="radiusInput"
        value={radius}
        onChange={handleRadiusChange}
      />
    </div>
  </div>
  );
}

export default MapRadius
